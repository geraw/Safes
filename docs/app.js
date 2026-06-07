const tokenKey = "cyber-riddles-team-token";
const teamKey = "cyber-riddles-team";
const solvedKey = "cyber-riddles-solved";
const checkerBase = (new URLSearchParams(location.search).get("checker") || window.CYBER_RIDDLES_CHECKER || "").replace(/\/$/, "");
const configuredApi = new URLSearchParams(location.search).get("api") || window.CYBER_RIDDLES_API || "";
const apiBase = configuredApi.replace(/\/$/, "");
const apiMode = new URLSearchParams(location.search).get("apiMode") || window.CYBER_RIDDLES_API_MODE || (apiBase.includes("/macros/s/") ? "apps-script" : "rest");
const hasApi = Boolean(apiBase);
const hasChecker = Boolean(checkerBase);
let state = { challenges: [], leaderboard: [], solved: [], team: null };

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

function setBackendControlsEnabled(enabled) {
  els.registerForm.querySelectorAll("input, button").forEach((control) => {
    control.disabled = !enabled;
  });
}

function token() {
  return localStorage.getItem(tokenKey) || "";
}

function storedTeam() {
  try {
    return JSON.parse(localStorage.getItem(teamKey) || "null");
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  if (!apiBase) throw new Error("לא הוגדר חיבור למערכת.");
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

async function checkerState() {
  if (!hasChecker) return null;
  const response = await fetch(`${checkerBase}/state`);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "שגיאה לא צפויה.");
  return data;
}

function storedSolved() {
  try {
    return JSON.parse(localStorage.getItem(solvedKey) || "[]");
  } catch {
    return [];
  }
}

function markSolved(challengeId) {
  const solved = new Set(storedSolved());
  solved.add(challengeId);
  localStorage.setItem(solvedKey, JSON.stringify(Array.from(solved)));
  state.solved = Array.from(new Set([...(state.solved || []), challengeId]));
}

async function submitToChecker(payload) {
  if (!hasChecker) throw new Error("לא הוגדר חיבור לבדיקת Paiza.");
  const response = await fetch(`${checkerBase}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "שגיאה לא צפויה.");
  return data;
}

function shortTeamName(name) {
  const clean = String(name || "").trim();
  if (clean.length <= 14) return clean;
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 4).map((word) => word[0]).join("");
  return `${clean.slice(0, 12)}...`;
}

function renderDetailedLeaderboard() {
  if (!els.detailedHead || !els.detailedBody) return;
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
    const submitButton = node.querySelector("button[type=submit]");
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

    if (!hasApi && !hasChecker) {
      textarea.disabled = true;
      submitButton.disabled = true;
      output.textContent = "הגשה תופעל אחרי חיבור לבדיקת Paiza.";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      output.className = "";
      output.textContent = "בודק...";
      try {
        if (hasChecker) {
          const team = storedTeam();
          if (!team) throw new Error("צריך להרשם כקבוצה לפני העלאת פתרון.");
          const result = await submitToChecker({
            teamName: team.name,
            members: team.members || "",
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            solution: textarea.value,
            source: challenge.source,
            compilerUrl: challenge.compilerUrl || ""
          });
          output.className = result.ok ? "ok" : "fail";
          if (result.ok) {
            markSolved(challenge.id);
            output.textContent = "נפתר. ההגשה נרשמה.";
            const liveState = await checkerState().catch(() => null);
            if (liveState) state.leaderboard = liveState.leaderboard || [];
            renderLeaderboard();
            renderChallenges();
          } else {
            output.textContent = `לא עבר: ${result.output || result.error || "No Hooray"}`;
          }
          return;
        }
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
  const response = await fetch(`README.md?v=20260607-3`, { cache: "no-store" });
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
      <h2>החידות נטענו, אבל אין חיבור למערכת</h2>
      <p>${escapeHtml(error.message)}</p>
      <p>בדקו שהגדרת החיבור ב-<code>docs/config.js</code> תקינה.</p>
    </div>
  `;
}

function showSetupNotice() {
  els.apiNotice.innerHTML = `
    <div class="setup-notice">
      <h2>מצב צפייה בלבד</h2>
      <p>החידות וקישורי Paiza זמינים. בדיקה אוטומטית ורישום הגשות יפעלו אחרי חיבור המערכת.</p>
      <p>פתחו את האתר עם <code>?checker=https://...workers.dev</code> או הגדירו <code>window.CYBER_RIDDLES_CHECKER</code> בקובץ <code>docs/config.js</code>.</p>
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
  if (hasChecker && !hasApi) {
    const liveState = await checkerState().catch(() => null);
    state = {
      challenges: staticChallenges,
      leaderboard: liveState?.leaderboard || [],
      team: storedTeam(),
      solved: storedSolved()
    };
    setBackendControlsEnabled(true);
    clearApiNotice();
    renderTeam();
    renderLeaderboard();
    renderDetailedLeaderboard();
    renderChallenges();
    return;
  }
  if (!hasApi) {
    state = { challenges: staticChallenges, leaderboard: [], team: null, solved: [] };
    setBackendControlsEnabled(false);
    renderTeam();
    renderLeaderboard();
    renderDetailedLeaderboard();
    renderChallenges();
    showSetupNotice();
    return;
  }
  const serverState = await request(`/state${query}`);
  state = {
    challenges: serverState.challenges?.length ? serverState.challenges : staticChallenges,
    leaderboard: serverState.leaderboard || [],
    team: serverState.team || null,
    solved: serverState.solved || []
  };
  clearApiNotice();
  setBackendControlsEnabled(true);
  renderTeam();
  renderLeaderboard();
  renderDetailedLeaderboard();
  renderChallenges();
}

els.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!hasApi) {
    if (hasChecker) {
      const team = {
        token: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: els.teamName.value.trim(),
        members: els.teamMembers.value.trim()
      };
      if (team.name.length < 2) {
        showApiNotice(new Error("שם קבוצה חייב להכיל לפחות שני תווים."));
        return;
      }
      localStorage.setItem(teamKey, JSON.stringify(team));
      state.team = team;
      renderTeam();
      renderChallenges();
      clearApiNotice();
      return;
    }
    showSetupNotice();
    return;
  }
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

if (els.scoreboardLink && els.detailedPanel) {
  els.scoreboardLink.addEventListener("click", (event) => {
    event.preventDefault();
    els.detailedPanel.hidden = false;
    renderDetailedLeaderboard();
    els.detailedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (hasApi) {
  setInterval(() => {
    refresh().catch(() => {});
  }, 5000);
}
