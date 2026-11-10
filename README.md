# Axium Video Downloader

Axium Cyber LLC's Cloudflare-hosted direct-media downloader and Chrome companion.

## Cloudflare implementation

The current Cloudflare implementation is in [cloudflare/](cloudflare/README.md):
- Cloudflare Worker API and static asset hosting
- D1 job metadata, R2 media storage, Queue-based processing
- Custom domain target: https://downloader.axiumcyber.com
- GitHub Actions deploy workflow: .github/workflows/cloudflare-deploy.yml
- Chrome Manifest V3 companion: cloudflare/extension/

The earlier React/Express/FFmpeg prototype remains under `apps/` as a legacy reference and is not used by the Cloudflare Worker deployment.

## Deploy

Create D1 database `axium-video-downloader`, R2 bucket `axium-video-downloader-media`, and Queue `axium-video-downloads`. Put the D1 database ID in `cloudflare/wrangler.jsonc`. Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then add `downloader.axiumcyber.com` as a Worker custom domain after deployment. See [cloudflare/README.md](cloudflare/README.md).

## Chrome extension

Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `cloudflare/extension/`.

## Safety

This implementation is for directly accessible media files you own or are authorized to save. It does not bypass DRM, paywalls, login requirements, or access controls. Before public multi-user production, add identity/authentication, rate limits, quotas, DNS-pinning egress protection, monitoring, and an abuse/takedown process. See the security notes in the Cloudflare guide.
