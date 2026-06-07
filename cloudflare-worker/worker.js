const PAIZA_API_KEY = "guest";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return corsResponse("", 204);
    if (url.pathname === "/state" && request.method === "GET") return state(env);
    if (url.pathname === "/submit" && request.method === "POST") return submit(request, env);
    return corsJson({ error: "Not found." }, 404);
  }
};

async function submit(request, env) {
  const body = await request.json();
  const required = ["teamName", "challengeId", "challengeTitle", "solution", "source"];
  for (const key of required) {
    if (!String(body[key] || "").trim()) return corsJson({ error: `Missing ${key}.` }, 400);
  }

  const result = await checkWithPaiza(body.source, body.solution);
  await recordSubmission(env, body, result);
  await submitToGoogleForm(env, {
    submittedAt: new Date().toISOString(),
    teamName: body.teamName,
    members: body.members || "",
    challengeId: body.challengeId,
    challengeTitle: body.challengeTitle,
    solution: body.solution,
    checkStatus: result.ok ? "ok" : "failed",
    compilerUrl: body.compilerUrl || "",
    paizaId: result.paizaId,
    output: result.output || "",
    error: result.error || ""
  });

  return corsJson(result);
}

async function state(env) {
  const submissions = await readSubmissions(env);
  return corsJson({
    leaderboard: leaderboard(submissions),
    submissions: submissions.length
  });
}

async function recordSubmission(env, body, result) {
  if (!env.CONTEST_KV) return;
  const submissions = await readSubmissions(env);
  submissions.push({
    submittedAt: new Date().toISOString(),
    teamName: body.teamName,
    members: body.members || "",
    challengeId: body.challengeId,
    challengeTitle: body.challengeTitle,
    ok: Boolean(result.ok),
    output: String(result.output || "").slice(0, 500),
    error: String(result.error || "").slice(0, 500),
    paizaId: result.paizaId || ""
  });
  await env.CONTEST_KV.put("submissions", JSON.stringify(submissions.slice(-5000)));
}

async function readSubmissions(env) {
  if (!env.CONTEST_KV) return [];
  const raw = await env.CONTEST_KV.get("submissions");
  return raw ? JSON.parse(raw) : [];
}

function leaderboard(submissions) {
  const teamMap = new Map();
  const solvedByChallenge = new Map();

  for (const submission of submissions) {
    if (!submission.teamName) continue;
    if (!teamMap.has(submission.teamName)) {
      teamMap.set(submission.teamName, {
        name: submission.teamName,
        members: submission.members || "",
        solved: 0,
        score: 0,
        challenges: {}
      });
    }
    if (!submission.ok) continue;
    if (!solvedByChallenge.has(submission.challengeId)) solvedByChallenge.set(submission.challengeId, new Set());
    solvedByChallenge.get(submission.challengeId).add(submission.teamName);
  }

  for (const [challengeId, teams] of solvedByChallenge.entries()) {
    const points = teams.size ? 1 / teams.size : 0;
    for (const teamName of teams) {
      const team = teamMap.get(teamName);
      team.solved += 1;
      team.score += points;
      team.challenges[challengeId] = Number(points.toFixed(4));
    }
  }

  return Array.from(teamMap.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.solved !== a.solved) return b.solved - a.solved;
    return a.name.localeCompare(b.name);
  });
}

async function checkWithPaiza(source, input) {
  const create = await fetch("https://api.paiza.io/runners/create", {
    method: "POST",
    body: new URLSearchParams({
      source_code: source,
      input,
      language: "c",
      api_key: PAIZA_API_KEY
    })
  });
  const created = await create.json();
  if (!created.id) throw new Error("Paiza did not return a run id.");

  const detailsUrl = `https://api.paiza.io/runners/get_details?id=${encodeURIComponent(created.id)}&api_key=${PAIZA_API_KEY}`;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await sleep(700);
    const details = await fetch(detailsUrl).then((response) => response.json());
    if (details.status !== "completed") continue;
    return {
      ok: /\bHooray\b/.test(String(details.stdout || "")),
      output: details.stdout || "",
      error: details.stderr || details.build_stderr || "",
      paizaId: created.id
    };
  }

  throw new Error("Paiza did not finish in time.");
}

async function submitToGoogleForm(env, fields) {
  if (!env.GOOGLE_FORM_ACTION) return;
  const data = new URLSearchParams();
  add(data, env.FIELD_SUBMITTED_AT, fields.submittedAt);
  add(data, env.FIELD_TEAM_NAME, fields.teamName);
  add(data, env.FIELD_MEMBERS, fields.members);
  add(data, env.FIELD_CHALLENGE_ID, fields.challengeId);
  add(data, env.FIELD_CHALLENGE_TITLE, fields.challengeTitle);
  add(data, env.FIELD_SOLUTION, fields.solution);
  add(data, env.FIELD_CHECK_STATUS, fields.checkStatus);
  add(data, env.FIELD_COMPILER_URL, fields.compilerUrl);
  add(data, env.FIELD_PAIZA_ID, fields.paizaId);
  add(data, env.FIELD_OUTPUT, fields.output.slice(0, 1000));
  add(data, env.FIELD_ERROR, fields.error.slice(0, 1000));

  await fetch(env.GOOGLE_FORM_ACTION, {
    method: "POST",
    body: data
  });
}

function add(data, key, value) {
  if (key) data.append(key, value ?? "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function corsJson(payload, status = 200) {
  return corsResponse(JSON.stringify(payload), status, {
    "Content-Type": "application/json; charset=utf-8"
  });
}

function corsResponse(body, status, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...headers
    }
  });
}
