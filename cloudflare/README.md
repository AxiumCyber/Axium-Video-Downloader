# Cloudflare deployment

This folder contains the Cloudflare Worker implementation. Create D1 database `axium-video-downloader`, R2 bucket `axium-video-downloader-media`, and Queue `axium-video-downloads`. Put the D1 database ID in `wrangler.jsonc`, then run `npm install`, `npx wrangler d1 execute axium-video-downloader --remote --file=db/schema.sql`, and `npx wrangler deploy`. Add the custom domain `downloader.axiumcyber.com` to the Worker after the zone is active in Cloudflare DNS.

Add GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Use a token scoped to Workers, D1, R2, and Queues.

This minimal Worker implementation supports accessible direct audio/video file URLs. Before public multi-user use, add authentication, per-user quotas, rate limiting, a DNS-pinning egress proxy to mitigate DNS rebinding, and a reviewed abuse/takedown process. Do not use it to bypass DRM, paywalls, authentication, or other access controls.

## Admin access

Set the secret with `npx wrangler secret put ADMIN_API_KEY` from this folder. Open `/admin.html` after deployment and enter the secret. The key is sent only to the same-origin admin endpoint and held in the current tab's session storage. Do not commit it or place it in `wrangler.jsonc`.
