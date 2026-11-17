import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "oauth_handoffs" (
      "code_hash" varchar PRIMARY KEY NOT NULL,
      "payload_user_id" varchar NOT NULL,
      "expires_at" timestamp(3) with time zone NOT NULL
    );

    CREATE INDEX "oauth_handoffs_expires_at_idx"
      ON "oauth_handoffs" ("expires_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "oauth_handoffs";
  `)
}