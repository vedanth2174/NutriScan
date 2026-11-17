# NutriScan standalone project

## Architecture
- Next.js 16 frontend and API routes
- Payload CMS 4 with the official PostgreSQL adapter
- Auth.js email/password app sessions plus optional Google OAuth
- OpenAI server-side integration (`APP_OPENAI_API_KEY`)
- Open Food Facts barcode lookup
- Local media storage by default; optional S3-compatible storage when S3 credentials are configured

## Local development
1. Copy `.env.example` to `.env` and set `PAYLOAD_SECRET` and `AUTH_SECRET`.
2. Start PostgreSQL with `docker compose up -d db`.
3. Run `pnpm install`.
4. Run `pnpm payload generate:importmap` and `pnpm payload generate:types`.
5. Run `pnpm dev`.

Do not commit `.env`, database credentials, OAuth secrets, or OpenAI keys. Never expose server secrets through `NEXT_PUBLIC_*`.

## Database
Use PostgreSQL. Development schema push is enabled by the adapter's development default. Production deployments must use reviewed Payload migrations (`pnpm db:migrate:create`, then `pnpm db:migrate`). Back up the database before schema changes.

## Media storage
Local uploads are written to `media/`; production must mount a persistent volume at that path or configure the optional S3 adapter.
