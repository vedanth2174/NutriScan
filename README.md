# NutriScan — standalone backend migration

This package removes the Figma Make runtime dependency and keeps the existing NutriScan Next.js UI and nutrition API routes. The backend now uses a standalone Payload CMS configuration with PostgreSQL. Email/password app authentication is retained; Google OAuth is optional. OpenAI and Open Food Facts integrations remain server-side.

## Requirements

- Node.js `^24.22.3 || >=26.13.1` (your Node `26.13.1` version satisfies this)
- pnpm `10.34.9` (or pnpm 9/10/11)
- Docker Desktop with Docker Compose, for local PostgreSQL

## Windows PowerShell — local setup

Open PowerShell in this project folder.

### 1. Create your environment file

```powershell
Copy-Item .env.example .env
notepad .env
```

Generate two different secrets (run twice):

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Paste one value into `PAYLOAD_SECRET` and the other into `AUTH_SECRET` in `.env`. Set `POSTGRES_PASSWORD` and make the password in `DATABASE_URL` match it. Keep `.env` private.

### 2. Start PostgreSQL

```powershell
docker compose up -d db
docker compose ps
```

Wait until the `db` service reports healthy. Ensure `DATABASE_URL` in `.env` matches the compose credentials.

### 3. Install dependencies

```powershell
pnpm install
```

The old Figma-managed lockfile was removed because its dependency graph contained Figma-only packages. This install creates a fresh `pnpm-lock.yaml` for the standalone dependency set. Commit that newly generated lockfile after successful install.

### 4. Regenerate Payload-generated files

```powershell
pnpm payload generate:importmap
pnpm payload generate:types
```

This refreshes the Payload admin import map and TypeScript collection types against the standalone config.

### 5. Start NutriScan

```powershell
pnpm dev
```

Open:

- NutriScan UI: http://localhost:3000
- Payload admin: http://localhost:3000/admin
- Backend + database health: http://localhost:3000/api/health

Create the first Payload admin account at `/admin`. The `admins` collection permits first-admin creation only while the collection is empty. Then create a normal NutriScan account from the app's sign-up screen.

### 6. Configure AI

Set `APP_OPENAI_API_KEY` in `.env`, restart `pnpm dev`, then test food analysis and chat. The key is read only by server-side code and must never be placed in a `NEXT_PUBLIC_*` variable. The model remains `gpt-4.1-mini` in `src/lib/openai.ts`.

### 7. Optional Google sign-in

Create a Google OAuth web client and set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. Add the local callback URL `http://localhost:3000/api/auth/callback/google` in the Google OAuth client. Email/password sign-in does not require Google credentials. For production, add the production callback URL too.

### 8. Optional persistent S3 media storage

By default, uploaded media is written to the project's `media/` directory. This is suitable for local development. For production, either mount a persistent volume at `media/` or set all of `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY` to enable the Payload S3 adapter. `S3_ENDPOINT` and `S3_FORCE_PATH_STYLE` are optional for S3-compatible services. Never commit credentials.

## Production build and database migrations

Set production values for `PAYLOAD_SECRET`, `AUTH_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, and `APP_OPENAI_API_KEY` in the hosting provider's secret manager. Use a managed PostgreSQL database and persistent object storage or a persistent media volume.

For a new or changed production schema, generate and inspect a migration, then apply it to the target database:

```powershell
pnpm db:migrate:create
pnpm db:migrate
```

Build and start:

```powershell
pnpm build
pnpm start
```

Do not run schema-changing migrations against production without a database backup and review. The local development adapter can push schema changes automatically; production should use migrations.

## What is retained

- NutriScan UI components and styles
- Nutrition analyze, barcode, chat, and profile API routes
- OpenAI server-side integration
- Open Food Facts barcode dataset lookup
- Payload collections for users, admins, assessments, nutrition plans, food scans, meal logs, progress, chat messages, subscriptions and media
- Email/password authentication and optional Google OAuth

## Important data note

The uploaded ZIP contains application source code, not the Figma-managed database or its uploaded media. This standalone project starts with a new PostgreSQL database. Existing hosted users, password hashes, scan history, and media are **not** automatically transferred. To migrate real records, export them from the original data source and perform a separately planned import; do not assume the source ZIP contains them.

## Verification status

The migration package was statically checked for remaining Figma package imports, Figma environment references in runtime source, stale preview OAuth routes, and stale generated admin import-map entries. A dependency install, Payload type generation, database connection, and production build still need to be run on the target Windows machine because package downloads and a PostgreSQL service are not available in this build workspace. Follow the commands above and report the first terminal error verbatim if one occurs.
