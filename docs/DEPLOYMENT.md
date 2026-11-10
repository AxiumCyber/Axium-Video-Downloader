# Deployment guide

## 1. Create the GitHub repository

Create a new repository named `Axium-Video-Downloader` under your GitHub account. Upload the contents of this project to the repository root, or use Git:

```bash
git init
git add .
git commit -m "Initial Axium Video Downloader implementation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Axium-Video-Downloader.git
git push -u origin main
```

## 2. Deploy the web dashboard to Cloudflare Pages

1. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `Axium-Video-Downloader`.
3. Set root directory to `apps/web`.
4. Framework preset: **Vite**.
5. Build command: `npm run build` (for a monorepo root install, set root to repository root and use `npm run build -w @axium/web`).
6. Build output directory: `dist`.
7. Set `VITE_API_BASE_URL` to the HTTPS URL of your API service.
8. Deploy.

For simplest workspace builds, keep the repository root as the project root, use build command `npm install && npm run build -w @axium/web`, and output directory `apps/web/dist`.

## 3. Deploy the API

The API needs a Node.js host with FFmpeg for media processing. It is not a static Cloudflare Pages function. You can run it on a Linux VPS or container host.

```bash
cd apps/api
cp .env.example .env
# Edit WEB_ORIGIN to your Pages URL
npm install
npm run build
npm start
```

Set `WEB_ORIGIN` to your deployed dashboard origin. Set `ALLOWED_MEDIA_HOSTS` to the exact media domains you intend to support. Do not leave the API open to arbitrary hosts in production.

## 4. Load the Chrome extension

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Select **Load unpacked** and choose `apps/extension`.
4. Browse to a page containing a standard HTML5 media URL.
5. Open the Axium extension to inspect detected media.
6. Copy the media URL into the dashboard.

## 5. Production work still required

- Replace in-memory task storage with Redis/Postgres and a durable queue.
- Implement a separate isolated FFmpeg worker. The API's `/start` route is deliberately disabled in this starter.
- Add authentication, per-user quotas, signed download URLs and object storage.
- Harden URL validation against DNS rebinding and redirect-based SSRF; revalidate every redirect and resolve IPs at connection time.
- Add content length, duration, CPU, memory and disk limits.
- Configure extension host permissions for your actual deployment domain.
- Add automated tests, dependency scanning, logging, alerting and backups.
