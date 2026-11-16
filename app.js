const STORAGE_KEY = "lanelab-analysis-history-v1";

const positions = {
  mid: {
    label: "미드",
    champions: [
      { id: "Ahri", difficulty: "난이도 · 보통", reason: "안정적인 라인전과 로밍으로 주도권을 넓히는 연습", tags: ["기동성", "픽 메이킹"] },
      { id: "Orianna", difficulty: "난이도 · 보통", reason: "웨이브 관리와 교전 거리 조절을 익히기 좋아요", tags: ["웨이브", "한타 설계"] },
      { id: "Annie", difficulty: "난이도 · 쉬움", reason: "기본기와 확실한 진입 타이밍에 집중할 수 있어요", tags: ["기본기", "이니시에이팅"] },
    ],
    note: "초반 교전 성과는 좋은 편이에요. 다만 10분 이후 CS 증가 폭이 줄어드는 패턴이 보여요. 유리한 라인전을 안정적인 아이템 격차로 연결하는 연습이 다음 단계예요.",
    focus: "라인 우위를 골드로 바꾸기",
  },
  top: {
    label: "탑",
    champions: [
      { id: "Garen", difficulty: "난이도 · 쉬움", reason: "안정적인 라인 운영과 귀환 타이밍을 익히기 좋아요", tags: ["라인 관리", "안정성"] },
      { id: "Gnar", difficulty: "난이도 · 보통", reason: "분노 관리와 교전 진입 타이밍을 연습할 수 있어요", tags: ["변신 타이밍", "한타"] },
      { id: "Gwen", difficulty: "난이도 · 보통", reason: "사이드 운영과 유리한 교전 선택을 연습해요", tags: ["사이드", "교전"] },
    ],
    note: "라인에서 얻은 이득을 사이드 운영으로 이어가 보세요. 귀환 전 웨이브를 정리하고, 상대 정글 위치를 확인한 뒤 압박하는 습관이 도움이 돼요.",
    focus: "웨이브를 정리하고 안전하게 압박하기",
  },
  jungle: {
    label: "정글",
    champions: [
      { id: "Vi", difficulty: "난이도 · 쉬움", reason: "갱킹 경로와 확실한 진입 판단을 연습할 수 있어요", tags: ["갱킹", "목표물"] },
      { id: "Amumu", difficulty: "난이도 · 쉬움", reason: "정글 동선과 한타 개시 타이밍을 익히기 좋아요", tags: ["동선", "이니시에이팅"] },
      { id: "Viego", difficulty: "난이도 · 보통", reason: "교전 후속 판단과 리셋 활용을 연습해요", tags: ["교전 판단", "리셋"] },
    ],
    note: "교전 성과뿐 아니라 동선의 일관성도 함께 살펴보세요. 첫 정글 캠프 전에 다음 목표와 갱킹 가능 라인을 정해두면 판단이 더 선명해져요.",
    focus: "첫 동선과 오브젝트 타이밍 맞추기",
  },
  bottom: {
    label: "바텀",
    champions: [
      { id: "Ashe", difficulty: "난이도 · 쉬움", reason: "사거리 유지와 안전한 딜링 위치를 연습해요", tags: ["포지셔닝", "유틸리티"] },
      { id: "Jinx", difficulty: "난이도 · 보통", reason: "교전 거리와 리셋 이후의 판단을 익히기 좋아요", tags: ["교전", "리셋"] },
      { id: "MissFortune", difficulty: "난이도 · 쉬움", reason: "라인전 교환과 궁극기 각을 연습할 수 있어요", tags: ["라인전", "한타"] },
    ],
    note: "라인전에서 안전하게 CS를 챙긴 뒤, 교전이 열릴 때 합류하는 타이밍을 다듬어 보세요. 딜량보다 먼저 생존 가능한 위치를 확인하는 습관이 중요해요.",
    focus: "안전한 위치에서 꾸준히 딜하기",
  },
  support: {
    label: "서포터",
    champions: [
      { id: "Nautilus", difficulty: "난이도 · 쉬움", reason: "시야를 확보한 뒤 이니시에이팅하는 흐름을 익혀요", tags: ["시야", "이니시에이팅"] },
      { id: "Leona", difficulty: "난이도 · 쉬움", reason: "교전 전 아군 위치와 진입 각을 연습해요", tags: ["진입 판단", "시야"] },
      { id: "Lulu", difficulty: "난이도 · 보통", reason: "아군 보호와 스킬 사용 우선순위를 다듬어요", tags: ["보호", "스킬 판단"] },
    ],
    note: "시야 점수만큼이나 시야를 확보하는 타이밍과 안전한 경로가 중요해요. 오브젝트 생성 전에 귀환·시야 정비 시간을 확보하는 연습을 해보세요.",
    focus: "오브젝트 전 시야를 먼저 준비하기",
  },
};

const baselineStats = {
  mid: { winRate: 56, kda: 3.4, cs: 6.8, vision: 28 },
  top: { winRate: 53, kda: 3.1, cs: 6.5, vision: 25 },
  jungle: { winRate: 54, kda: 3.6, cs: 5.4, vision: 31 },
  bottom: { winRate: 55, kda: 3.2, cs: 7.1, vision: 24 },
  support: { winRate: 52, kda: 3.8, cs: 1.2, vision: 39 },
};

const regionNames = {
  kr: "KR", na1: "NA", euw1: "EUW", eun1: "EUNE", jp1: "JP", br1: "BR",
  oc1: "OCE", la1: "LAN", la2: "LAS", tr1: "TR", ru: "RU",
};
const regionOptions = [
  ["kr", "대한민국 (KR)"], ["na1", "북미 (NA)"], ["euw1", "유럽 서부 (EUW)"],
  ["eun1", "유럽 북동부 (EUNE)"], ["jp1", "일본 (JP)"], ["br1", "브라질 (BR)"],
  ["oc1", "오세아니아 (OCE)"], ["la1", "라틴 아메리카 북부 (LAN)"],
  ["la2", "라틴 아메리카 남부 (LAS)"], ["tr1", "튀르키예 (TR)"], ["ru", "러시아 (RU)"],
];
const MAX_ACCOUNTS = 10;

const championNames = new Map(Object.entries({
  Ahri: "아리", Orianna: "오리아나", Annie: "애니",
  Garen: "가렌", Gnar: "나르", Gwen: "그웬",
  Vi: "바이", Amumu: "아무무", Viego: "비에고",
  Ashe: "애쉬", Jinx: "징크스", MissFortune: "미스 포츈",
  Nautilus: "노틸러스", Leona: "레오나", Lulu: "룰루",
}));
let ddragonVersion = "latest";
let currentAnalysis = null;

const form = document.querySelector("#analysis-form");
const accountList = document.querySelector("#account-list");
const accountCountLabel = document.querySelector("#account-count-label");
const addAccountButton = document.querySelector("#add-account");
const positionSelect = document.querySelector("#position");
const analyzeButton = document.querySelector("#analyze-button");
const formMessage = document.querySelector("#form-message");

function stableHash(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeDemoAnalysis(riotId, region, position) {
  const seed = stableHash(`${riotId.toLowerCase()}-${region}-${position}`);
  const base = baselineStats[position];
  const variation = (seed % 7) - 3;
  return {
    riotId,
    region,
    position,
    games: 50,
    winRate: Math.max(40, Math.min(68, base.winRate + variation)),
    kda: (base.kda + ((seed >>> 4) % 7 - 3) * 0.1).toFixed(1),
    cs: (base.cs + ((seed >>> 8) % 7 - 3) * 0.1).toFixed(1),
    vision: Math.max(8, base.vision + ((seed >>> 12) % 7 - 3)),
    createdAt: new Date().toISOString(),
  };
}

function updateAccountControls() {
  const rows = [...accountList.querySelectorAll(".account-row")];
  accountCountLabel.textContent = `${rows.length} / ${MAX_ACCOUNTS}`;
  addAccountButton.disabled = rows.length >= MAX_ACCOUNTS;
  rows.forEach((row, index) => {
    row.querySelector(".account-index").textContent = String(index + 1).padStart(2, "0");
    const remove = row.querySelector(".remove-account");
    remove.hidden = rows.length === 1;
    remove.setAttribute("aria-label", `계정 ${index + 1} 삭제`);
  });
}

function addAccountRow({ riotId = "", region = "kr" } = {}) {
  if (accountList.children.length >= MAX_ACCOUNTS) return;
  const rowId = `account-${crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random()}`;
  const row = document.createElement("div");
  row.className = "account-row";

  const index = document.createElement("span");
  index.className = "account-index";
  index.setAttribute("aria-hidden", "true");

  const regionLabel = document.createElement("label");
  regionLabel.className = "field-group account-region";
  regionLabel.htmlFor = `${rowId}-region`;
  const regionText = document.createElement("span");
  regionText.textContent = "지역";
  const regionSelect = document.createElement("select");
  regionSelect.id = `${rowId}-region`;
  regionSelect.className = "account-region-select";
  regionOptions.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    regionSelect.append(option);
  });
  regionSelect.value = region;
  regionLabel.append(regionText, regionSelect);

  const riotLabel = document.createElement("label");
  riotLabel.className = "field-group account-id";
  riotLabel.htmlFor = `${rowId}-riot-id`;
  const riotText = document.createElement("span");
  riotText.textContent = "Riot ID";
  const inputWrap = document.createElement("div");
  inputWrap.className = "riot-input-wrap";
  const input = document.createElement("input");
  input.id = `${rowId}-riot-id`;
  input.className = "account-riot-input";
  input.type = "text";
  input.placeholder = "게임이름#태그라인";
  input.autocomplete = "off";
  input.value = riotId;
  const hashHint = document.createElement("span");
  hashHint.className = "input-hint";
  hashHint.textContent = "#";
  inputWrap.append(input, hashHint);
  riotLabel.append(riotText, inputWrap);

  const removeButton = document.createElement("button");
  removeButton.className = "remove-account";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.addEventListener("click", () => {
    row.remove();
    updateAccountControls();
  });

  row.append(index, regionLabel, riotLabel, removeButton);
  accountList.append(row);
  updateAccountControls();
  if (riotId) input.focus();
}

function collectAccountInputs() {
  const result = [];
  const rows = [...accountList.querySelectorAll(".account-row")];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const riotId = row.querySelector(".account-riot-input").value.trim();
    const region = row.querySelector(".account-region-select").value;
    if (!riotId && rows.length > 1) continue;
    const separator = riotId.lastIndexOf("#");
    if (separator < 1 || separator === riotId.length - 1) {
      return { error: `계정 ${index + 1}: Riot ID를 게임이름#태그라인 형식으로 입력해 주세요.`, input: row.querySelector(".account-riot-input") };
    }
    const duplicate = result.some((item) => item.region === region && item.riotId.toLocaleLowerCase() === riotId.toLocaleLowerCase());
    if (duplicate) {
      return { error: `계정 ${index + 1}: 같은 지역에 동일한 Riot ID가 이미 있어요.`, input: row.querySelector(".account-riot-input") };
    }
    result.push({ riotId, region });
  }
  if (result.length === 0) {
    const firstInput = accountList.querySelector(".account-riot-input");
    return { error: "분석할 Riot ID를 하나 이상 입력해 주세요.", input: firstInput };
  }
  return { accounts: result };
}

function combineDemoAnalyses(accounts, position) {
  const analyses = accounts.map(({ riotId, region }) => makeDemoAnalysis(riotId, region, position));
  const totalGames = analyses.reduce((sum, analysis) => sum + analysis.games, 0);
  const average = (key) => analyses.reduce((sum, analysis) => sum + Number(analysis[key]) * analysis.games, 0) / totalGames;
  return {
    accounts: accounts.map(({ riotId, region }) => ({ riotId, region })),
    position,
    games: totalGames,
    winRate: Math.round(average("winRate")),
    kda: average("kda").toFixed(1),
    cs: average("cs").toFixed(1),
    vision: Math.round(average("vision")),
    createdAt: new Date().toISOString(),
  };
}

function updateStatChart(analysis) {
  const bars = document.querySelectorAll(".chart-bars i");
  const win = analysis.winRate;
  const cs = Number(analysis.cs);
  const values = [Math.min(92, 64 + (win - 50) * 2), Math.min(88, 36 + cs * 4), 66, 68, 70 + (win - 50)];
  bars.forEach((bar, index) => {
    bar.style.setProperty("--bar", `${Math.max(28, values[index])}%`);
  });
}

function updateDashboard(analysis, accountLookupVerified = false) {
  const position = positions[analysis.position];
  const accounts = analysis.accounts || [{ riotId: analysis.riotId, region: analysis.region }];
  document.querySelector("#win-rate").textContent = analysis.winRate;
  document.querySelector("#avg-kda").textContent = analysis.kda;
  document.querySelector("#cs-min").textContent = analysis.cs;
  document.querySelector("#vision-score").textContent = analysis.vision;
  document.querySelector("#report-player").textContent = accounts.length === 1
    ? `${accounts[0].riotId} · ${regionNames[accounts[0].region] || accounts[0].region.toUpperCase()}`
    : `${accounts.length}개 계정 · ${accounts[0].riotId} 외 ${accounts.length - 1}개`;
  document.querySelector("#report-period").textContent = "계정별 최대 50경기";
  document.querySelector("#games-covered").textContent = `총 ${analysis.games}경기`;
  document.querySelector("#report-mode-label").textContent = accountLookupVerified ? "Account-V1 확인 · 경기 데모" : "예시 데이터 · API 미조회";
  document.querySelector("#coach-note").textContent = position.note;
  document.querySelector(".plan-progress-row h3").textContent = position.focus;
  updateStatChart(analysis);
  renderChampions(analysis.position);
}

function createChampionCard(champion, index, position) {
  const article = document.createElement("article");
  article.className = "champion-card";

  const art = document.createElement("div");
  art.className = "champion-art";
  const image = document.createElement("img");
  image.alt = "";
  image.loading = "lazy";
  image.src = `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${champion.id}.png`;
  image.addEventListener("error", () => image.remove(), { once: true });
  art.append(image);

  const number = document.createElement("span");
  number.className = "champion-number";
  number.textContent = `PICK 0${index + 1}`;
  art.append(number);

  const role = document.createElement("span");
  role.className = "champion-role";
  role.textContent = positions[position].label;
  art.append(role);

  const info = document.createElement("div");
  info.className = "champion-info";
  const titleRow = document.createElement("div");
  titleRow.className = "champion-title-row";
  const title = document.createElement("h3");
  title.textContent = championNames.get(champion.id) || champion.fallback || champion.id;
  const difficulty = document.createElement("span");
  difficulty.className = "champion-difficulty";
  difficulty.textContent = champion.difficulty;
  titleRow.append(title, difficulty);

  const reason = document.createElement("p");
  reason.className = "champion-reason";
  reason.textContent = champion.reason;
  const tags = document.createElement("div");
  tags.className = "champion-tags";
  champion.tags.forEach((label) => {
    const tag = document.createElement("span");
    tag.textContent = label;
    tags.append(tag);
  });
  info.append(titleRow, reason, tags);
  article.append(art, info);
  return article;
}

function renderChampions(position) {
  const grid = document.querySelector("#champion-grid");
  grid.replaceChildren(...positions[position].champions.map((champion, index) => createChampionCard(champion, index, position)));
}

function getHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const list = document.querySelector("#history-list");
  const history = getHistory();
  list.replaceChildren();
  if (history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "아직 저장된 분석이 없어요.\n분석 후 ‘기록 저장’을 눌러보세요.";
    list.append(empty);
    return;
  }

  history.slice(0, 4).forEach((item) => {
    const entry = document.createElement("div");
    entry.className = "history-entry";
    const mark = document.createElement("div");
    mark.className = "history-entry-mark";
    mark.textContent = "↗";
    const copy = document.createElement("div");
    copy.className = "history-entry-copy";
    const name = document.createElement("strong");
    const accountNames = item.accounts?.map((account) => account.riotId).filter(Boolean) || [];
    name.textContent = accountNames.length > 1
      ? `${accountNames.length}개 계정 · ${accountNames[0]} 외 ${accountNames.length - 1}개`
      : accountNames[0] || item.riotId || "저장된 분석";
    const meta = document.createElement("span");
    const date = new Date(item.createdAt);
    const dateLabel = Number.isNaN(date.getTime()) ? "날짜 정보 없음" : new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(date);
    meta.textContent = `${dateLabel} · ${item.games || 50}경기 · ${positions[item.position]?.label || "포지션"} · 승률 ${item.winRate}%`;
    copy.append(name, meta);
    entry.append(mark, copy);
    list.append(entry);
  });
}

function saveAnalysis() {
  const message = document.querySelector("#saved-message");
  if (!currentAnalysis) {
    message.textContent = "먼저 Riot ID를 입력해 데모 분석을 시작해 주세요.";
    return;
  }
  const history = getHistory();
  const duplicate = history.some((item) => item.createdAt === currentAnalysis.createdAt);
  if (duplicate) {
    message.textContent = "이미 저장된 분석이에요.";
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([currentAnalysis, ...history].slice(0, 20)));
    message.textContent = "이 브라우저에 분석 기록을 저장했어요.";
    renderHistory();
  } catch {
    message.textContent = "브라우저 저장 공간을 사용할 수 없어요.";
  }
  window.setTimeout(() => { message.textContent = ""; }, 3500);
}

function setLoading(loading) {
  analyzeButton.disabled = loading;
  analyzeButton.querySelector("span:first-child").textContent = loading ? "계정 확인 중" : "Riot ID 확인";
  analyzeButton.querySelector(".button-arrow").textContent = loading ? "…" : "↗";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  const collected = collectAccountInputs();
  if (collected.error) {
    formMessage.textContent = collected.error;
    collected.input?.focus();
    return;
  }

  const selectedPosition = positionSelect.value;
  setLoading(true);
  try {
    const response = await fetch("/api/accounts/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts: collected.accounts }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const failed = (result.accounts || []).filter((account) => !account.ok);
      const detail = failed.map((account) => `${account.riotId || "계정"}: ${account.error}`).join(" ");
      throw new Error(detail || result.error || `서버 요청 실패 (HTTP ${response.status})`);
    }

    currentAnalysis = combineDemoAnalyses(result.accounts, selectedPosition);
    updateDashboard(currentAnalysis, true);
    formMessage.textContent = `${result.accounts.length}개 계정의 PUUID를 확인했어요. Match-V5 연결 전이라 경기 통계는 데모 데이터입니다.`;
  } catch (error) {
    formMessage.textContent = error instanceof TypeError
      ? "LaneLab 서버에 연결할 수 없어요. README의 python server.py 실행 방법을 확인해 주세요."
      : error.message;
  } finally {
    setLoading(false);
  }
  window.setTimeout(() => { formMessage.textContent = ""; }, 7000);
});

document.querySelector("#demo-fill").addEventListener("click", () => {
  accountList.replaceChildren();
  addAccountRow({ riotId: "Summoner#KR1", region: "kr" });
  addAccountRow({ riotId: "SummonerTwo#KR1", region: "kr" });
  positionSelect.value = "mid";
  currentAnalysis = combineDemoAnalyses(collectAccountInputs().accounts, positionSelect.value);
  updateDashboard(currentAnalysis);
  formMessage.textContent = "예시 화면으로 바꿨어요. 실제 계정 조회는 ‘Riot ID 확인’을 눌러주세요.";
  window.setTimeout(() => { formMessage.textContent = ""; }, 5000);
});

addAccountButton.addEventListener("click", () => addAccountRow());

document.querySelector("#save-analysis").addEventListener("click", saveAnalysis);

document.querySelector("#clear-history").addEventListener("click", () => {
  if (getHistory().length === 0) return;
  if (!window.confirm("이 브라우저에 저장된 분석 기록을 모두 삭제할까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
  document.querySelector("#saved-message").textContent = "저장된 기록을 삭제했어요.";
  window.setTimeout(() => { document.querySelector("#saved-message").textContent = ""; }, 3000);
});

const helpDialog = document.querySelector("#help-dialog");
document.querySelector("#help-button").addEventListener("click", () => helpDialog.showModal());

document.querySelectorAll(".task-check").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const completed = document.querySelectorAll(".task-check:checked").length;
    const total = document.querySelectorAll(".task-check").length;
    const display = document.querySelector(".progress-ring > span");
    display.innerHTML = `${completed}<span>/${total}</span>`;
    const ring = document.querySelector(".progress-ring");
    ring.style.borderTopColor = completed ? "var(--lime)" : "#46533a";
  });
});

document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

async function loadDataDragon() {
  try {
    const versionResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    if (!versionResponse.ok) return;
    const versions = await versionResponse.json();
    if (!Array.isArray(versions) || !versions[0]) return;
    ddragonVersion = versions[0];
    const championResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/ko_KR/champion.json`);
    if (!championResponse.ok) return;
    const catalog = await championResponse.json();
    Object.values(catalog.data || {}).forEach((champion) => championNames.set(champion.id, champion.name));
    if (currentAnalysis) renderChampions(currentAnalysis.position);
    else renderChampions(positionSelect.value);
  } catch {
    // Keep the built-in Korean champion names and art fallbacks when Data Dragon is unavailable.
  }
}

renderHistory();
addAccountRow();
renderChampions(positionSelect.value);
loadDataDragon();
