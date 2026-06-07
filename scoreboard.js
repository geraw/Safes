const configuredApi = new URLSearchParams(location.search).get("api") || window.CYBER_RIDDLES_API || "";
const apiBase = configuredApi.replace(/\/$/, "");
const apiMode = new URLSearchParams(location.search).get("apiMode") || window.CYBER_RIDDLES_API_MODE || (apiBase.includes("/macros/s/") ? "apps-script" : "rest");

const staticChallengeIndex = [
  { id: "sanity-42", title: "Sanity 42" },
  { id: "bit-twister", title: "Bit Twister" },
  { id: "collatz", title: "Collatz" },
  { id: "floating-point", title: "Floating Point" },
  { id: "easy-hex", title: "Easy Hex" },
  { id: "absurd", title: "Absurd" },
  { id: "i-am-a-riddle", title: "I Am A Riddle" },
  { id: "bgu", title: "BGU" },
  { id: "floating-point-comparison", title: "Floating Point Comparison" },
  { id: "tricky-hex", title: "Tricky Hex" },
  { id: "matthew-18-15", title: "Matthew 18:15" },
  { id: "buffer-overflow-exploit", title: "Buffer Overflow Exploit" },
  { id: "inequality", title: "Inequality" },
  { id: "associativity", title: "Associativity" }
];

const els = {
  status: document.querySelector("#scoreboard-status"),
  notice: document.querySelector("#scoreboard-notice"),
  head: document.querySelector("#detailed-scoreboard-head"),
  body: document.querySelector("#detailed-scoreboard-body")
};

function formatScore(score) {
  return Number(score).toLocaleString("he-IL", { maximumFractionDigits: 4 });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shortTeamName(name) {
  const clean = String(name || "").trim();
  if (clean.length <= 14) return clean;
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 4).map((word) => word[0]).join("");
  return `${clean.slice(0, 12)}...`;
}

async function request(path) {
  const action = path.replace(/^\//, "").split("?")[0];
  const query = path.includes("?") ? `&${path.split("?")[1]}` : "";
  const url = apiMode === "apps-script" ? `${apiBase}?action=${encodeURIComponent(action)}${query}` : `${apiBase}${path}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "שגיאה לא צפויה.");
  return data;
}

async function loadReadmeChallenges() {
  const response = await fetch(`README.md?v=20260607-2`, { cache: "no-store" });
  const readme = await response.text();
  return staticChallengeIndex.map((challenge, index) => {
    const start = readme.indexOf(`## ${challenge.title}`);
    const nextTitle = staticChallengeIndex[index + 1]?.title;
    const next = nextTitle ? readme.indexOf(`\n## ${nextTitle}`, start + 1) : readme.length;
    const section = start >= 0 ? readme.slice(start, next >= 0 ? next : readme.length) : "";
    const compilerUrl = section.match(/\]\((https:\/\/paiza\.io\/projects\/new\?language=c&source_code=[^)]+)\)/)?.[1] || "";
    return { ...challenge, compilerUrl };
  });
}

function render(challenges, leaderboard) {
  els.head.innerHTML = "";
  els.body.innerHTML = "";
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th class="team-column">קבוצה</th>
    ${challenges.map((challenge) => `<th class="challenge-column">${escapeHtml(challenge.title)}</th>`).join("")}
    <th>סה"כ</th>
  `;
  els.head.append(headerRow);

  if (!leaderboard.length) {
    els.body.innerHTML = `<tr><td class="empty" colspan="${challenges.length + 2}">עדיין אין נתוני ניקוד להצגה.</td></tr>`;
    return;
  }

  leaderboard.forEach((team) => {
    const row = document.createElement("tr");
    const cells = challenges.map((challenge) => {
      const value = team.challenges?.[challenge.id];
      return `<td class="${value ? "score-cell" : "empty-score"}">${value ? formatScore(value) : ""}</td>`;
    });
    row.innerHTML = `
      <th class="team-column" title="${escapeHtml(team.name)}">${escapeHtml(shortTeamName(team.name))}</th>
      ${cells.join("")}
      <td class="total-cell">${formatScore(team.score || 0)}</td>
    `;
    els.body.append(row);
  });
}

function showNotice(message) {
  els.notice.innerHTML = `
    <div class="setup-notice">
      <h2>אין מקור נתונים לקריאה</h2>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

async function init() {
  const staticChallenges = await loadReadmeChallenges().catch(() => staticChallengeIndex);
  if (!apiBase) {
    render(staticChallenges, []);
    els.status.textContent = "לא מחובר";
    showNotice("העמוד המפורט צריך API שמחזיר leaderboard. כרגע ההגשות נכתבות ל-Google Form דרך Worker, אבל אין קריאה חוזרת מהגיליון.");
    return;
  }
  const state = await request("/state");
  render(state.challenges?.length ? state.challenges : staticChallenges, state.leaderboard || []);
  els.status.textContent = "מתעדכן";
  els.status.classList.add("active");
}

init().catch((error) => {
  els.status.textContent = "שגיאה";
  showNotice(error.message);
});
