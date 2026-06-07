const SHEETS = {
  teams: "Teams",
  submissions: "Submissions",
  challenges: "Challenges"
};

const HEADERS = {
  Teams: ["token", "name", "members", "createdAt"],
  Submissions: ["submittedAt", "teamToken", "challengeId", "ok", "solutionHash", "output", "error"],
  Challenges: ["id", "title", "compilerUrl", "source"]
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    ensureSheets();
    const action = String(e.parameter.action || "state").toLowerCase();
    const body = parseBody(e);

    if (action === "state") return jsonResponse(state(e.parameter.token || ""));
    if (action === "register") return jsonResponse(register(body));
    if (action === "submit") return jsonResponse(submit(body));
    return jsonResponse({ error: "Unknown action." });
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

function parseBody(e) {
  if (!e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureSheets() {
  Object.keys(HEADERS).forEach((name) => {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS[name]);
  });
}

function rows(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  return values
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}

function append(name, values) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  sheet.appendRow(HEADERS[name].map((header) => values[header] ?? ""));
}

function state(token) {
  return {
    challenges: rows(SHEETS.challenges),
    leaderboard: leaderboard(),
    team: token ? teamByToken(token) : null,
    solved: token ? solvedByTeam(token) : []
  };
}

function register(body) {
  const name = String(body.name || "").trim();
  const members = String(body.members || "").trim();
  if (name.length < 2) throw new Error("שם קבוצה חייב להכיל לפחות שני תווים.");
  if (rows(SHEETS.teams).some((team) => String(team.name).toLowerCase() === name.toLowerCase())) {
    throw new Error("שם הקבוצה כבר קיים.");
  }

  const token = Utilities.getUuid();
  append(SHEETS.teams, { token, name, members, createdAt: new Date().toISOString() });
  return { token, name, members };
}

function submit(body) {
  const token = String(body.token || "");
  const challengeId = String(body.challengeId || "");
  const solution = String(body.solution || "");
  const team = teamByToken(token);
  if (!team) throw new Error("צריך להרשם כקבוצה לפני העלאת פתרון.");
  if (!challengeId) throw new Error("חידה לא קיימת.");
  if (!solution.trim()) throw new Error("הפתרון ריק.");

  const result = checkSolution(challengeId, solution);
  append(SHEETS.submissions, {
    submittedAt: new Date().toISOString(),
    teamToken: token,
    challengeId,
    ok: result.ok ? "TRUE" : "FALSE",
    solutionHash: hash(solution),
    output: String(result.output || "").slice(0, 500),
    error: String(result.error || "").slice(0, 500)
  });

  return {
    ok: result.ok,
    output: result.output || "",
    error: result.error || "",
    leaderboard: leaderboard(),
    solved: solvedByTeam(token)
  };
}

function checkSolution(challengeId, solution) {
  const checkerUrl = PropertiesService.getScriptProperties().getProperty("CHECKER_URL");
  if (!checkerUrl) throw new Error("לא הוגדר CHECKER_URL ב-Script Properties.");

  const response = UrlFetchApp.fetch(checkerUrl, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify({ challengeId, solution })
  });
  const data = JSON.parse(response.getContentText());
  if (response.getResponseCode() >= 400) throw new Error(data.error || "שרת הבדיקה החזיר שגיאה.");
  return data;
}

function leaderboard() {
  const teams = rows(SHEETS.teams);
  const solved = solvedSets();
  const scores = teams.map((team) => ({
    teamId: team.token,
    name: team.name,
    members: team.members,
    solved: 0,
    score: 0,
    challenges: {}
  }));
  const byToken = Object.fromEntries(scores.map((team) => [team.teamId, team]));

  Object.keys(solved).forEach((challengeId) => {
    const teamTokens = Object.keys(solved[challengeId]);
    const points = teamTokens.length ? 1 / teamTokens.length : 0;
    teamTokens.forEach((teamToken) => {
      if (!byToken[teamToken]) return;
      byToken[teamToken].solved += 1;
      byToken[teamToken].score += points;
      byToken[teamToken].challenges[challengeId] = Number(points.toFixed(4));
    });
  });

  return scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.solved !== a.solved) return b.solved - a.solved;
    return String(a.name).localeCompare(String(b.name));
  });
}

function solvedSets() {
  const solved = {};
  rows(SHEETS.submissions).forEach((submission) => {
    if (String(submission.ok).toUpperCase() !== "TRUE") return;
    solved[submission.challengeId] = solved[submission.challengeId] || {};
    solved[submission.challengeId][submission.teamToken] = true;
  });
  return solved;
}

function solvedByTeam(token) {
  const ids = {};
  rows(SHEETS.submissions).forEach((submission) => {
    if (submission.teamToken === token && String(submission.ok).toUpperCase() === "TRUE") {
      ids[submission.challengeId] = true;
    }
  });
  return Object.keys(ids);
}

function teamByToken(token) {
  return rows(SHEETS.teams).find((team) => team.token === token) || null;
}

function hash(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map((byte) => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, "0")).join("");
}
