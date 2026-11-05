// SunoAPI requires a callBackUrl. The app polls for status instead,
// so this simply acknowledges the callback.
export default async () =>
  new Response(JSON.stringify({ code: 200, msg: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
