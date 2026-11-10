# Axium Video Downloader

A FetchV-inspired, independently branded media-task manager for media you own or are authorized to download.

## What is included

- `apps/web`: React + TypeScript + Vite dashboard, task creation, task list, status/progress UI, format selection and admin overview.
- `apps/api`: Node.js + Express API with URL validation, task lifecycle, FFmpeg worker integration, health endpoint and basic rate limiting.
- `apps/extension`: Chrome Manifest V3 extension that detects standard media request URLs (MP4, WEBM, M3U8, MPD) on the active tab and sends them to the dashboard.
- `docker-compose.yml`: local API + Redis + FFmpeg deployment.
- `docs/DEPLOYMENT.md`: GitHub, Cloudflare Pages, API host and extension deployment instructions.

## Important limitations

This project is a functional starter, not a byte-for-byte copy of FetchV and not a finished production service. The extension detects media URLs visible to the browser; it does not defeat DRM, authentication walls, paywalls, anti-bot controls, or site restrictions. It does not target YouTube. Use it only for content you own or are licensed/authorized to download.

The initial API worker uses FFmpeg to process direct media URLs and standard HLS/DASH manifests. Production use requires hardening (see Security checklist below), persistent job storage, worker isolation, monitoring, and a properly configured public API origin. The in-memory task store resets when the API restarts.

## Requirements

- Node.js 20+
- npm 10+
- FFmpeg installed locally, or Docker
- Chrome/Edge for the extension

## Local development

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

Web app: http://localhost:5173  
API health: http://localhost:8787/health

To load the extension:
1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select `apps/extension`.

Set the web app API URL with `VITE_API_BASE_URL` (default `http://localhost:8787`).

## Security checklist before public launch

- Put the API behind HTTPS and an authenticated user/session layer.
- Keep `ALLOWED_MEDIA_HOSTS` restrictive in production.
- Run FFmpeg in a non-root, isolated container with CPU, memory, disk and time limits.
- Use a durable queue and object storage; never rely on the in-memory demo task store.
- Add per-user quotas, abuse monitoring, CSRF protection if cookie auth is used, and audit logging.
- Keep extension host permissions as narrow as possible for your intended users.
- Review the legal terms and copyright rules for each supported source.
