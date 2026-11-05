import { suno, json } from "./_suno.mjs";

const MODELS = ["V6", "V6_WILD", "V6_MINI"];
const trim = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export default async (req) => {
  if (req.method !== "POST") return json({ code: 405, msg: "Use POST" }, 405);

  let input;
  try { input = await req.json(); } catch { return json({ code: 400, msg: "Invalid JSON body" }, 400); }

  const customMode = !!input.customMode;
  const instrumental = !!input.instrumental;
  const model = MODELS.includes(input.model) ? input.model : "V6";
  const origin = new URL(req.url).origin;

  const body = {
    customMode,
    instrumental,
    model,
    // Required by the API. We poll for results, so this endpoint just acknowledges.
    callBackUrl: `${origin}/.netlify/functions/callback`,
  };

  const style = trim(input.style, 1000);
  const lyrics = trim(input.lyrics, 5000);

  if (customMode) {
    const title = trim(input.title, 80);
    const negativeTags = trim(input.negativeTags, 1000);
    if (title) body.title = title;
    if (style) body.style = style;
    if (!instrumental && lyrics) body.lyrics = lyrics;
    if (negativeTags) body.negativeTags = negativeTags;
    if (input.vocalGender === "m" || input.vocalGender === "f") body.vocalGender = input.vocalGender;
    const duration = Number(input.duration);
    if (duration >= 10 && duration <= 360) body.duration = Math.round(duration);
    if (!style && !lyrics && !negativeTags) {
      return json({ code: 400, msg: "Custom mode needs at least a style, lyrics, or tags to exclude." }, 400);
    }
  } else {
    const prompt = trim(input.prompt, 3000);
    if (!prompt && !style) {
      return json({ code: 400, msg: "Describe the song you want (prompt) or give a style." }, 400);
    }
    if (prompt) body.prompt = prompt;
    if (style) body.style = style;
  }

  return suno("/api/v1/generate", { method: "POST", body });
};
