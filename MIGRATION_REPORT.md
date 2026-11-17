# NutriScan standalone migration report

## Source reviewed

`NutriScan_Final (1).zip` supplied in this conversation.

## Changes made

- Replaced `buildFigmaConfig()` with Payload `buildConfig()`.
- Added the official Payload PostgreSQL adapter (`@payloadcms/db-postgres@4.0.0-beta.8`).
- Added the official Payload S3 storage adapter (`@payloadcms/storage-s3@4.0.0-beta.8`) as an optional production media backend; local filesystem uploads remain the default for development.
- Kept the existing Payload collections and the existing Next.js frontend/API route structure. The NutriScan component styles and screen markup were preserved; the only change in the main app component removes the Figma preview-only Google OAuth branch and uses the normal Auth.js Google flow.
- Kept the existing email/password app auth and standard Auth.js Google OAuth flow; removed the Figma preview OAuth bridge.
- Fixed app-session cookies so local HTTP development does not incorrectly set the `Secure` attribute; production cookies remain secure.
- Changed signup error handling so database/configuration failures are not mislabeled as duplicate emails.
- Added a database-backed `/api/health` endpoint.
- Added a local PostgreSQL Docker Compose service, `.env.example`, Windows-first setup instructions, and migration scripts.
- Removed Figma runtime packages, generated Figma admin components, Figma image loader, preview routes, Make site-settings/custom-code wrappers, and Figma-only directories.
- Updated generated admin import-map references to remove Figma and MCP plugin entries. The setup instructions regenerate the import map and Payload types against the new config.

## Verification performed in this workspace

- `package.json` parses as valid JSON.
- Edited JavaScript import-map file passes `node --check`.
- Edited TypeScript files were passed through the available TypeScript parser; no TS parser/syntax diagnostics were reported. This parser check is not a full project typecheck.
- Static scan of runtime source/config/package files found no Figma package imports, `FIGMA_*` environment references, Figma preview OAuth references, or MCP plugin references.
- Confirmed the expected new files exist: standalone Payload config, PostgreSQL Compose service, environment template, health endpoint, README, and migration report.
- Confirmed PostgreSQL and S3 Payload adapter version `4.0.0-beta.8` exists in the package registry; this matches the existing Payload v4 beta.8 package set. The official Payload installation requirements list Node.js `^24.22.3 || >=26.13.1`, which the user’s Node `26.13.1` satisfies.

## Not verified here

- `pnpm install`, because package downloads were not available from this workspace.
- Payload `generate:importmap` / `generate:types` against the newly installed dependencies.
- Actual PostgreSQL connectivity, first-admin creation, email/password registration, Google OAuth, OpenAI requests, S3 uploads, or production build.

Run the exact Windows setup in `README.md`. Do not treat this archive as a tested production deployment until those runtime checks pass.

## Data migration limitation

The source ZIP contains code and configuration, not the Figma-hosted database or uploaded media. This migration therefore configures a new PostgreSQL database; it does not transfer existing hosted accounts, password hashes, scan history, nutrition plans, or uploaded media. Those records require a separate export/import from the original data source if they must be retained.
