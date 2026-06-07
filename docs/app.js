const tokenKey = "cyber-riddles-team-token";
const configuredApi = new URLSearchParams(location.search).get("api") || window.CYBER_RIDDLES_API || "";
const apiBase = configuredApi.replace(/\/$/, "");
const apiMode = new URLSearchParams(location.search).get("apiMode") || window.CYBER_RIDDLES_API_MODE || (apiBase.includes("/macros/s/") ? "apps-script" : "rest");
let state = { challenges: [], leaderboard: [], solved: [], team: null };

const staticChallengeIndex = [
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
  teamStatus: document.querySelector("#team-status"),
  registerForm: document.querySelector("#register-form"),
  scoreboardLink: document.querySelector("#scoreboard-link"),
  teamName: document.querySelector("#team-name"),
  teamMembers: document.querySelector("#team-members"),
  leaderboard: document.querySelector("#leaderboard-body"),
  detailedPanel: document.querySelector("#detailed-scoreboard"),
  detailedHead: document.querySelector("#detailed-scoreboard-head"),
  detailedBody: document.querySelector("#detailed-scoreboard-body"),
  challenges: document.querySelector("#challenges"),
  challengeCount: document.querySelector("#challenge-count"),
  apiNotice: document.querySelector("#api-notice"),
  template: document.querySelector("#challenge-template")
};

function token() {
  return localStorage.getItem(tokenKey) || "";
}

async function request(path, options = {}) {
  if (!apiBase) throw new Error("לא הוגדר חיבור ל-Google Sheets.");
  const action = path.replace(/^\//, "").split("?")[0];
  const query = path.includes("?") ? `&${path.split("?")[1]}` : "";
  const url = apiMode === "apps-script" ? `${apiBase}?action=${encodeURIComponent(action)}${query}` : `${apiBase}${path}`;
  const contentType = apiMode === "apps-script" ? "text/plain" : "application/json";
  const response = await fetch(url, {
    headers: { "Content-Type": contentType, ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "שגיאה לא צפויה.");
  return data;
}

function formatScore(score) {
  return Number(score).toLocaleString("he-IL", { maximumFractionDigits: 4 });
}

function renderTeam() {
  if (!state.team) {
    els.teamStatus.textContent = "לא רשומים";
    els.teamStatus.classList.remove("active");
    return;
  }
  els.teamStatus.textContent = state.team.name;
  els.teamStatus.classList.add("active");
  els.teamName.value = state.team.name;
  els.teamMembers.value = state.team.members || "";
}

function renderLeaderboard() {
  els.leaderboard.innerHTML = "";
  if (!state.leaderboard.length) {
    els.leaderboard.innerHTML = `<tr><td class="empty" colspan="4">עדיין אין קבוצות רשומות.</td></tr>`;
    return;
  }
  state.leaderboard.forEach((team, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(team.name)}</td>
      <td>${team.solved}</td>
      <td>${formatScore(team.score)}</td>
    `;
    els.leaderboard.append(row);
  });
}

function shortTeamName(name) {
  const clean = String(name || "").trim();
  if (clean.length <= 14) return clean;
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 4).map((word) => word[0]).join("");
  return `${clean.slice(0, 12)}...`;
}

function renderDetailedLeaderboard() {
  els.detailedHead.innerHTML = "";
  els.detailedBody.innerHTML = "";

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th class="team-column">קבוצה</th>
    ${state.challenges.map((challenge) => `<th class="challenge-column">${escapeHtml(challenge.title)}</th>`).join("")}
    <th>סה"כ</th>
  `;
  els.detailedHead.append(headerRow);

  if (!state.leaderboard.length) {
    els.detailedBody.innerHTML = `<tr><td class="empty" colspan="${state.challenges.length + 2}">עדיין אין קבוצות רשומות.</td></tr>`;
    return;
  }

  state.leaderboard.forEach((team) => {
    const row = document.createElement("tr");
    const cells = state.challenges.map((challenge) => {
      const value = team.challenges?.[challenge.id];
      const content = value ? formatScore(value) : "";
      return `<td class="${value ? "score-cell" : "empty-score"}">${content}</td>`;
    });
    row.innerHTML = `
      <th class="team-column" title="${escapeHtml(team.name)}">${escapeHtml(shortTeamName(team.name))}</th>
      ${cells.join("")}
      <td class="total-cell">${formatScore(team.score)}</td>
    `;
    els.detailedBody.append(row);
  });
}

function renderChallenges() {
  els.challengeCount.textContent = `${state.challenges.length} חידות`;
  els.challenges.innerHTML = "";
  for (const challenge of state.challenges) {
    const solved = state.solved.includes(challenge.id);
    const node = els.template.content.cloneNode(true);
    const article = node.querySelector(".challenge");
    const title = node.querySelector("h3");
    const pill = node.querySelector(".solved-pill");
    const code = node.querySelector("code");
    const link = node.querySelector(".compiler-link");
    const form = node.querySelector(".submit-form");
    const textarea = node.querySelector("textarea");
    const file = node.querySelector("input[type=file]");
    const output = node.querySelector("output");

    article.dataset.challengeId = challenge.id;
    title.textContent = challenge.title;
    code.textContent = challenge.source;
    pill.textContent = solved ? "נפתר" : "לא נפתר";
    pill.classList.toggle("done", solved);
    if (challenge.compilerUrl) {
      link.href = challenge.compilerUrl;
    } else {
      link.removeAttribute("href");
      link.textContent = "אין קישור קומפיילר";
    }

    file.addEventListener("change", async () => {
      const selected = file.files[0];
      if (selected) textarea.value = await selected.text();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      output.className = "";
      output.textContent = "בודק...";
      try {
        const result = await request("/submit", {
          method: "POST",
          body: JSON.stringify({ token: token(), challengeId: challenge.id, solution: textarea.value, source: challenge.source })
        });
        state.leaderboard = result.leaderboard;
        state.solved = result.solved;
        output.className = result.ok ? "ok" : "fail";
        output.textContent = result.ok ? "נפתר. הניקוד עודכן." : `לא עבר: ${result.output || result.error || "No Hooray"}`;
        renderLeaderboard();
        renderDetailedLeaderboard();
        renderChallenges();
      } catch (error) {
        output.className = "fail";
        output.textContent = error.message;
      }
    });

    els.challenges.append(node);
  }
}

async function loadReadmeChallenges() {
  const response = await fetch("README.md");
  const readme = await response.text();
  return staticChallengeIndex.map((challenge, index) => {
    const start = readme.indexOf(`## ${challenge.title}`);
    const nextTitle = staticChallengeIndex[index + 1]?.title;
    const next = nextTitle ? readme.indexOf(`\n## ${nextTitle}`, start + 1) : readme.length;
    const section = start >= 0 ? readme.slice(start, next >= 0 ? next : readme.length) : "";
    const source = section.match(/```c\s*([\s\S]*?)```/)?.[1]?.trim() || "";
    const compilerUrl = section.match(/\]\((https:\/\/paiza\.io\/projects\/new\?language=c&source_code=[^)]+)\)/)?.[1] || "";
    return { ...challenge, source, compilerUrl };
  });
}

function showApiNotice(error) {
  els.apiNotice.innerHTML = `
    <div class="api-error">
      <h2>החידות נטענו, אבל אין חיבור ל-Google Sheets</h2>
      <p>${escapeHtml(error.message)}</p>
      <p>הבדיקה מתבצעת דרך Paiza מתוך Google Apps Script. הגדירו את <code>window.CYBER_RIDDLES_API</code> בקובץ <code>docs/config.js</code>, או פתחו עם <code>?api=https://script.google.com/macros/s/.../exec</code>.</p>
    </div>
  `;
}

function clearApiNotice() {
  els.apiNotice.innerHTML = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refresh() {
  const query = token() ? `?token=${encodeURIComponent(token())}` : "";
  const staticChallenges = await loadReadmeChallenges().catch(() => []);
  const serverState = await request(`/state${query}`);
  state = {
    challenges: serverState.challenges?.length ? serverState.challenges : staticChallenges,
    leaderboard: serverState.leaderboard || [],
    team: serverState.team || null,
    solved: serverState.solved || []
  };
  clearApiNotice();
  renderTeam();
  renderLeaderboard();
  renderDetailedLeaderboard();
  renderChallenges();
}

els.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const result = await request("/register", {
    method: "POST",
    body: JSON.stringify({ name: els.teamName.value, members: els.teamMembers.value })
  });
  localStorage.setItem(tokenKey, result.token);
  await refresh();
});

refresh().catch(async (error) => {
  state = { challenges: await loadReadmeChallenges().catch(() => []), leaderboard: [], solved: [], team: null };
  renderTeam();
  renderLeaderboard();
  renderDetailedLeaderboard();
  renderChallenges();
  showApiNotice(error);
});

els.scoreboardLink.addEventListener("click", (event) => {
  event.preventDefault();
  els.detailedPanel.hidden = false;
  renderDetailedLeaderboard();
  els.detailedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

setInterval(() => {
  refresh().catch(() => {});
}, 5000);
