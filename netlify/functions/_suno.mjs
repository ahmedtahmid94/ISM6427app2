// Shared helper for talking to SunoAPI (https://docs.sunoapi.org).
// The API key is read from the SUNO_API_KEY environment variable so it is
// never exposed to the browser or committed to the repo.
export const BASE_URL = process.env.SUNO_API_BASE || "https://apibox.erweima.ai";

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function suno(path, { method = "GET", body } = {}) {
  const key = process.env.SUNO_API_KEY;
  if (!key) {
    return json({ code: 500, msg: "SUNO_API_KEY is not set in the Netlify environment." }, 500);
  }
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { code: res.status, msg: text || res.statusText }; }
    return json(data, res.ok ? 200 : res.status);
  } catch (err) {
    return json({ code: 502, msg: `Could not reach SunoAPI: ${err.message}` }, 502);
  }
}
