import { suno, json } from "./_suno.mjs";

export default async (req) => {
  const taskId = new URL(req.url).searchParams.get("taskId");
  if (!taskId) return json({ code: 400, msg: "taskId is required" }, 400);
  return suno(`/api/v1/lyrics/record-info?taskId=${encodeURIComponent(taskId)}`);
};
