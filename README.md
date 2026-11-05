# Songsmith 🎵

A small web app that turns an idea into a song using [SunoAPI](https://docs.sunoapi.org/).
Static frontend (`public/`) + Netlify Functions (`netlify/functions/`) that call SunoAPI
server-side, so the API key never reaches the browser.

## Features
- **Simple mode** – describe the song; lyrics are written first (SunoAPI `/api/v1/lyrics`), then sung by the music model.
- **Custom mode** – your own title, lyrics (or "Write lyrics for me"), style, styles to avoid, vocal gender, length.
- Instrumental toggle, model picker (V6, V6 Wild, V6 Mini).
- Live progress, streaming preview while rendering, download MP3, song history saved in your browser.

## Deploy on Netlify
1. Import this repo in Netlify (build settings come from `netlify.toml`; no build command needed).
2. **Site settings → Environment variables** → add `SUNO_API_KEY` = your SunoAPI key.
3. Deploy (or redeploy after adding the variable).

Optional: `SUNO_API_BASE` overrides the API host (default `https://apibox.erweima.ai`, the server listed in the docs; `https://api.sunoapi.org` also works).

## Local dev
```bash
npm i -g netlify-cli
cp .env.example .env   # put your key in .env
netlify dev
```

## How it works
1. `POST /.netlify/functions/generate` → SunoAPI `POST /api/v1/generate` → returns `taskId`.
2. The page polls `/.netlify/functions/status?taskId=…` → `GET /api/v1/generate/record-info`
   every 5 s until status is `SUCCESS` (or a failure status).
3. `/.netlify/functions/credits` shows remaining credits; `/.netlify/functions/callback` satisfies the required `callBackUrl`.
