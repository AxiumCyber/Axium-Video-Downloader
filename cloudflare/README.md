# Cloudflare deployment

This folder contains the Cloudflare Worker implementation and static dashboard.

## Provision resources

From this folder, using a logged-in Wrangler CLI:

```bash
npx wrangler d1 create axium-video-downloader
npx wrangler r2 bucket create axium-video-downloader-media
npx wrangler queues create axium-video-downloads
```

Copy the D1 database ID into `wrangler.jsonc` in place of `REPLACE_WITH_D1_DATABASE_ID`. Apply the schema:

```bash
npx wrangler d1 execute axium-video-downloader --remote --file=db/schema.sql
```

Set secrets (never add these to source control):

```bash
npx wrangler secret put ADMIN_API_KEY
```

Use a unique random value of at least 32 bytes. Deploy:

```bash
npm install
npx wrangler deploy
```

After the first deployment, add the Worker custom domain `downloader.axiumcyber.com` in Cloudflare Workers & Pages. The zone must be active on Cloudflare DNS. Keep `APP_ORIGIN` aligned with the deployed origin.

## GitHub Actions

Add repository secrets:
- `CLOUDFLARE_API_TOKEN` with Workers Scripts: Edit and access to the account.
- `CLOUDFLARE_ACCOUNT_ID`.

The workflow at `.github/workflows/cloudflare-deploy.yml` deploys when files under `cloudflare/` change on `main`. Create the D1/R2/Queue resources and replace the D1 ID before the first successful deployment.

## Admin access

Open `/admin.html` after deployment and enter the Worker `ADMIN_API_KEY`. The key is sent only to the same-origin admin endpoint and held in the current tab's session storage. It is not committed to the repository.

## Chrome extension

Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `cloudflare/extension/`. The extension observes common direct media file requests and uses Chrome's native download manager. It does not upload detected media to Axium servers.

## Supported functionality and limitations

- The Worker queues accessible direct HTTP(S) audio/video files, validates redirects, rejects obvious local/private and literal-IP destinations, enforces a streamed byte limit, and stores completed files in R2.
- Per-job random access tokens protect job status and download URLs; the API does not expose a public list of everyone's jobs.
- A D1 per-IP creation limit is included. Add Cloudflare WAF/rate-limiting rules and monitoring before public launch.
- The server worker does not merge HLS/DASH streams, use browser cookies, or process DRM-protected media. Chrome's extension handles direct media URLs already visible to the browser.
- Hostname validation alone cannot fully prevent DNS rebinding. Do not expose arbitrary URL fetching as a public multi-tenant service until you add a vetted egress proxy that resolves and pins public IPs and blocks private/reserved ranges.
- This is not a certified production security review. Add formal abuse handling, quotas, operational alerts, backups, and security testing before public launch.

Use only media you own or are authorized to save. This service does not bypass DRM, paywalls, authentication, or access controls.
