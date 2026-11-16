"""Local LaneLab server with a server-side Riot Account-V1 proxy."""

from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
MAX_ACCOUNTS = 10
MAX_BODY_BYTES = 16_384
REGIONAL_ROUTING = {
    "na1": "americas",
    "br1": "americas",
    "la1": "americas",
    "la2": "americas",
    "eun1": "europe",
    "euw1": "europe",
    "tr1": "europe",
    "ru": "europe",
    "kr": "asia",
    "jp1": "asia",
    "oc1": "sea",
    "ph2": "sea",
    "sg2": "sea",
    "th2": "sea",
    "tw2": "sea",
    "vn2": "sea",
}


def load_local_env() -> None:
    """Load simple KEY=VALUE entries from .env without overriding process env."""
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        name = name.strip()
        value = value.strip().strip("\"'")
        if name and name not in os.environ:
            os.environ[name] = value


def json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)


def account_lookup(riot_id: str, region: str, api_key: str) -> dict:
    parts = riot_id.rsplit("#", 1)
    if len(parts) != 2 or not parts[0].strip() or not parts[1].strip():
        return {"riotId": riot_id, "region": region, "ok": False, "error": "Riot ID 형식은 게임이름#태그라인입니다."}

    routing = REGIONAL_ROUTING.get(region.lower())
    if not routing:
        return {"riotId": riot_id, "region": region, "ok": False, "error": "지원하지 않는 지역입니다."}

    game_name, tag_line = parts[0].strip(), parts[1].strip()
    url = (
        f"https://{routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"
        f"{quote(game_name, safe='')}/{quote(tag_line, safe='')}"
    )
    request = Request(
        url,
        headers={"X-Riot-Token": api_key, "Accept": "application/json"},
        method="GET",
    )

    try:
        with urlopen(request, timeout=12) as response:
            account = json.loads(response.read().decode("utf-8"))
        puuid = account.get("puuid")
        if not puuid:
            return {"riotId": riot_id, "region": region, "ok": False, "error": "응답에 PUUID가 없습니다."}
        return {
            "riotId": f"{account.get('gameName', game_name)}#{account.get('tagLine', tag_line)}",
            "region": region,
            "puuid": puuid,
            "ok": True,
        }
    except HTTPError as error:
        if error.code == 401 or error.code == 403:
            message = "Riot API 키가 유효하지 않거나 만료됐습니다. Developer Portal에서 키를 확인해 주세요."
        elif error.code == 404:
            message = "해당 지역에서 Riot ID를 찾을 수 없습니다. ID와 지역을 확인해 주세요."
        elif error.code == 429:
            message = "Riot API 요청 제한에 도달했습니다. 잠시 기다린 뒤 다시 시도해 주세요."
        else:
            message = f"Riot API에서 오류가 발생했습니다 (HTTP {error.code})."
        return {"riotId": riot_id, "region": region, "ok": False, "error": message, "status": error.code}
    except (URLError, TimeoutError):
        return {"riotId": riot_id, "region": region, "ok": False, "error": "Riot API에 연결하지 못했습니다. 네트워크를 확인해 주세요."}
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {"riotId": riot_id, "region": region, "ok": False, "error": "Riot API 응답을 읽을 수 없습니다."}


class LaneLabHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        if urlparse(self.path).path == "/api/health":
            json_response(self, 200, {"ok": True, "riotApiKeyConfigured": bool(os.environ.get("RIOT_API_KEY"))})
            return
        super().do_GET()

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/api/accounts/resolve":
            json_response(self, 404, {"error": "API 경로를 찾을 수 없습니다."})
            return

        api_key = os.environ.get("RIOT_API_KEY", "").strip()
        if not api_key:
            json_response(self, 503, {"error": "서버에 RIOT_API_KEY가 설정되지 않았습니다. .env를 확인해 주세요."})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            content_length = 0
        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            json_response(self, 400, {"error": "요청 본문이 비어 있거나 너무 큽니다."})
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            json_response(self, 400, {"error": "올바른 JSON 요청이 아닙니다."})
            return

        accounts = payload.get("accounts") if isinstance(payload, dict) else None
        if not isinstance(accounts, list) or not 1 <= len(accounts) <= MAX_ACCOUNTS:
            json_response(self, 400, {"error": f"계정은 1개부터 최대 {MAX_ACCOUNTS}개까지 요청할 수 있습니다."})
            return

        results = []
        seen = set()
        for item in accounts:
            if not isinstance(item, dict):
                results.append({"ok": False, "error": "계정 입력 형식이 올바르지 않습니다."})
                continue
            riot_id = str(item.get("riotId", "")).strip()
            region = str(item.get("region", "")).strip().lower()
            dedupe_key = (region, riot_id.casefold())
            if dedupe_key in seen:
                results.append({"riotId": riot_id, "region": region, "ok": False, "error": "같은 지역에 동일한 Riot ID가 중복 입력됐습니다."})
                continue
            seen.add(dedupe_key)
            results.append(account_lookup(riot_id, region, api_key))

        all_ok = all(result.get("ok") for result in results)
        json_response(self, 200 if all_ok else 422, {"accounts": results})

    def log_message(self, format: str, *args) -> None:
        # Keep request paths in the console, but never log request bodies or API keys.
        super().log_message(format, *args)


if __name__ == "__main__":
    load_local_env()
    port = int(os.environ.get("PORT", "8001"))
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), LaneLabHandler)
    print(f"LaneLab local server: http://127.0.0.1:{port}")
    print(f"Riot API key configured: {'yes' if os.environ.get('RIOT_API_KEY') else 'no'}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nLaneLab server stopped.")
    finally:
        server.server_close()
