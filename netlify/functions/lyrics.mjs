import { suno, json } from "./_suno.mjs";

// Starts a lyrics-only generation task (POST /api/v1/lyrics). Prompt max 200 chars.
export default async (req) => {
  if (req.method !== "POST") return json({ code: 405, msg: "Use POST" }, 405);
  let input;
  try { input = await req.json(); } catch { return json({ code: 400, msg: "Invalid JSON body" }, 400); }
  const prompt = typeof input.prompt === "string" ? input.prompt.trim().slice(0, 200) : "";
  if (!prompt) return json({ code: 400, msg: "Describe what the lyrics should be about." }, 400);
  const origin = new URL(req.url).origin;
  return suno("/api/v1/lyrics", {
    method: "POST",
    body: { prompt, callBackUrl: `${origin}/.netlify/functions/callback` },
  });
};
