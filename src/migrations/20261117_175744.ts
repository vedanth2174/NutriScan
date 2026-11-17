import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_users_theme" AS ENUM('dark', 'light', 'system');
  CREATE TYPE "public"."enum_nutrition_plans_status" AS ENUM('active', 'completed', 'paused', 'archived');
  CREATE TYPE "public"."enum__nutrition_plans_v_version_status" AS ENUM('active', 'completed', 'paused', 'archived');
  CREATE TYPE "public"."enum_food_scans_mode" AS ENUM('camera', 'barcode', 'label', 'gallery', 'voice', 'text');
  CREATE TYPE "public"."enum__food_scans_v_version_mode" AS ENUM('camera', 'barcode', 'label', 'gallery', 'voice', 'text');
  CREATE TYPE "public"."enum_meal_logs_meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');
  CREATE TYPE "public"."enum__meal_logs_v_version_meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');
  CREATE TYPE "public"."enum_progress_entries_metric" AS ENUM('weight', 'water', 'steps', 'sleep', 'energy', 'calories', 'protein', 'carbs', 'fat', 'fiber');
  CREATE TYPE "public"."enum__progress_entries_v_version_metric" AS ENUM('weight', 'water', 'steps', 'sleep', 'energy', 'calories', 'protein', 'carbs', 'fat', 'fiber');
  CREATE TYPE "public"."enum_chat_messages_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum__chat_messages_v_version_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum_subscriptions_provider" AS ENUM('stripe', 'manual');
  CREATE TYPE "public"."enum_subscriptions_tier" AS ENUM('free', 'pro');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('inactive', 'trialing', 'active', 'past_due', 'canceled');
  CREATE TYPE "public"."enum__subscriptions_v_version_provider" AS ENUM('stripe', 'manual');
  CREATE TYPE "public"."enum__subscriptions_v_version_tier" AS ENUM('free', 'pro');
  CREATE TYPE "public"."enum__subscriptions_v_version_status" AS ENUM('inactive', 'trialing', 'active', 'past_due', 'canceled');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_h_folders_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"_stored" boolean,
  	"_transforms" jsonb,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"original__stored" boolean,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar NOT NULL,
  	"version__h_folders_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version__stored" boolean,
  	"version__transforms" jsonb,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_original__stored" boolean,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_folders_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_folders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_folders_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_tags_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_tags_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"google_provider_id" varchar,
  	"avatar_u_r_l" varchar,
  	"theme" "enum_users_theme" DEFAULT 'dark',
  	"onboarding_complete" boolean DEFAULT false,
  	"nutrition_profile_goal" varchar,
  	"nutrition_profile_dietary_preference" varchar,
  	"nutrition_profile_health_conditions" jsonb,
  	"nutrition_profile_allergies" jsonb,
  	"nutrition_profile_daily_calories" numeric,
  	"nutrition_profile_protein_target" numeric,
  	"nutrition_profile_carbs_target" numeric,
  	"nutrition_profile_fat_target" numeric,
  	"nutrition_profile_water_target_ml" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "assessments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"responses" jsonb NOT NULL,
  	"goal" varchar,
  	"health_conditions" jsonb,
  	"allergies" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assessments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_assessments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_responses" jsonb NOT NULL,
  	"version_goal" varchar,
  	"version_health_conditions" jsonb,
  	"version_allergies" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_assessments_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "nutrition_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"name" varchar DEFAULT 'My nutrition plan' NOT NULL,
  	"status" "enum_nutrition_plans_status" DEFAULT 'active',
  	"starts_on" timestamp(3) with time zone NOT NULL,
  	"ends_on" timestamp(3) with time zone,
  	"targets" jsonb NOT NULL,
  	"days" jsonb NOT NULL,
  	"grocery_list" jsonb,
  	"supplements" jsonb,
  	"lifestyle" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "nutrition_plans_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_nutrition_plans_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_name" varchar DEFAULT 'My nutrition plan' NOT NULL,
  	"version_status" "enum__nutrition_plans_v_version_status" DEFAULT 'active',
  	"version_starts_on" timestamp(3) with time zone NOT NULL,
  	"version_ends_on" timestamp(3) with time zone,
  	"version_targets" jsonb NOT NULL,
  	"version_days" jsonb NOT NULL,
  	"version_grocery_list" jsonb,
  	"version_supplements" jsonb,
  	"version_lifestyle" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_nutrition_plans_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "food_scans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"mode" "enum_food_scans_mode" NOT NULL,
  	"barcode" varchar,
  	"food_name" varchar NOT NULL,
  	"brand" varchar,
  	"result" jsonb NOT NULL,
  	"personalized_score" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "food_scans_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_food_scans_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_mode" "enum__food_scans_v_version_mode" NOT NULL,
  	"version_barcode" varchar,
  	"version_food_name" varchar NOT NULL,
  	"version_brand" varchar,
  	"version_result" jsonb NOT NULL,
  	"version_personalized_score" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_food_scans_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "meal_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"meal_type" "enum_meal_logs_meal_type",
  	"eaten_at" timestamp(3) with time zone NOT NULL,
  	"portion_grams" numeric,
  	"nutrition" jsonb NOT NULL,
  	"scan_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "meal_logs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_meal_logs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_meal_type" "enum__meal_logs_v_version_meal_type",
  	"version_eaten_at" timestamp(3) with time zone NOT NULL,
  	"version_portion_grams" numeric,
  	"version_nutrition" jsonb NOT NULL,
  	"version_scan_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_meal_logs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "progress_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"metric" "enum_progress_entries_metric" NOT NULL,
  	"value" numeric NOT NULL,
  	"unit" varchar NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "progress_entries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_progress_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_recorded_at" timestamp(3) with time zone NOT NULL,
  	"version_metric" "enum__progress_entries_v_version_metric" NOT NULL,
  	"version_value" numeric NOT NULL,
  	"version_unit" varchar NOT NULL,
  	"version_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_progress_entries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "chat_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"thread_id" varchar NOT NULL,
  	"role" "enum_chat_messages_role" NOT NULL,
  	"content" varchar NOT NULL,
  	"citations" jsonb,
  	"confidence" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_messages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_chat_messages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_thread_id" varchar NOT NULL,
  	"version_role" "enum__chat_messages_v_version_role" NOT NULL,
  	"version_content" varchar NOT NULL,
  	"version_citations" jsonb,
  	"version_confidence" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_chat_messages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer NOT NULL,
  	"provider" "enum_subscriptions_provider" NOT NULL,
  	"provider_customer_id" varchar,
  	"provider_subscription_id" varchar,
  	"tier" "enum_subscriptions_tier" NOT NULL,
  	"status" "enum_subscriptions_status" NOT NULL,
  	"current_period_end" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_subscriptions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_owner_id" integer NOT NULL,
  	"version_provider" "enum__subscriptions_v_version_provider" NOT NULL,
  	"version_provider_customer_id" varchar,
  	"version_provider_subscription_id" varchar,
  	"version_tier" "enum__subscriptions_v_version_tier" NOT NULL,
  	"version_status" "enum__subscriptions_v_version_status" NOT NULL,
  	"version_current_period_end" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_subscriptions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"media_id" integer,
  	"folders_id" integer,
  	"tags_id" integer,
  	"users_id" integer,
  	"assessments_id" integer,
  	"nutrition_plans_id" integer,
  	"food_scans_id" integer,
  	"meal_logs_id" integer,
  	"progress_entries_id" integer,
  	"chat_messages_id" integer,
  	"subscriptions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assessments" ADD CONSTRAINT "assessments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assessments_rels" ADD CONSTRAINT "assessments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assessments_rels" ADD CONSTRAINT "assessments_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assessments_rels" ADD CONSTRAINT "assessments_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_assessments_v" ADD CONSTRAINT "_assessments_v_parent_id_assessments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assessments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_assessments_v" ADD CONSTRAINT "_assessments_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_assessments_v_rels" ADD CONSTRAINT "_assessments_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_assessments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_assessments_v_rels" ADD CONSTRAINT "_assessments_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_assessments_v_rels" ADD CONSTRAINT "_assessments_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nutrition_plans_rels" ADD CONSTRAINT "nutrition_plans_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nutrition_plans_rels" ADD CONSTRAINT "nutrition_plans_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nutrition_plans_rels" ADD CONSTRAINT "nutrition_plans_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nutrition_plans_v" ADD CONSTRAINT "_nutrition_plans_v_parent_id_nutrition_plans_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_nutrition_plans_v" ADD CONSTRAINT "_nutrition_plans_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_nutrition_plans_v_rels" ADD CONSTRAINT "_nutrition_plans_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_nutrition_plans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nutrition_plans_v_rels" ADD CONSTRAINT "_nutrition_plans_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nutrition_plans_v_rels" ADD CONSTRAINT "_nutrition_plans_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_scans" ADD CONSTRAINT "food_scans_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "food_scans_rels" ADD CONSTRAINT "food_scans_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_scans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_scans_rels" ADD CONSTRAINT "food_scans_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "food_scans_rels" ADD CONSTRAINT "food_scans_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_scans_v" ADD CONSTRAINT "_food_scans_v_parent_id_food_scans_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."food_scans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_food_scans_v" ADD CONSTRAINT "_food_scans_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_food_scans_v_rels" ADD CONSTRAINT "_food_scans_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_food_scans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_scans_v_rels" ADD CONSTRAINT "_food_scans_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_food_scans_v_rels" ADD CONSTRAINT "_food_scans_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_scan_id_food_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."food_scans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meal_logs_rels" ADD CONSTRAINT "meal_logs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."meal_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_logs_rels" ADD CONSTRAINT "meal_logs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "meal_logs_rels" ADD CONSTRAINT "meal_logs_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_meal_logs_v" ADD CONSTRAINT "_meal_logs_v_parent_id_meal_logs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."meal_logs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_meal_logs_v" ADD CONSTRAINT "_meal_logs_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_meal_logs_v" ADD CONSTRAINT "_meal_logs_v_version_scan_id_food_scans_id_fk" FOREIGN KEY ("version_scan_id") REFERENCES "public"."food_scans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_meal_logs_v_rels" ADD CONSTRAINT "_meal_logs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_meal_logs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_meal_logs_v_rels" ADD CONSTRAINT "_meal_logs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_meal_logs_v_rels" ADD CONSTRAINT "_meal_logs_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress_entries_rels" ADD CONSTRAINT "progress_entries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."progress_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "progress_entries_rels" ADD CONSTRAINT "progress_entries_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "progress_entries_rels" ADD CONSTRAINT "progress_entries_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_progress_entries_v" ADD CONSTRAINT "_progress_entries_v_parent_id_progress_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."progress_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_progress_entries_v" ADD CONSTRAINT "_progress_entries_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_progress_entries_v_rels" ADD CONSTRAINT "_progress_entries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_progress_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_progress_entries_v_rels" ADD CONSTRAINT "_progress_entries_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_progress_entries_v_rels" ADD CONSTRAINT "_progress_entries_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat_messages_rels" ADD CONSTRAINT "chat_messages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_messages_rels" ADD CONSTRAINT "chat_messages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_messages_rels" ADD CONSTRAINT "chat_messages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_chat_messages_v" ADD CONSTRAINT "_chat_messages_v_parent_id_chat_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_messages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_chat_messages_v" ADD CONSTRAINT "_chat_messages_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_chat_messages_v_rels" ADD CONSTRAINT "_chat_messages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_chat_messages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_chat_messages_v_rels" ADD CONSTRAINT "_chat_messages_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_chat_messages_v_rels" ADD CONSTRAINT "_chat_messages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions_rels" ADD CONSTRAINT "subscriptions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions_rels" ADD CONSTRAINT "subscriptions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions_rels" ADD CONSTRAINT "subscriptions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_subscriptions_v" ADD CONSTRAINT "_subscriptions_v_parent_id_subscriptions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_subscriptions_v" ADD CONSTRAINT "_subscriptions_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_subscriptions_v_rels" ADD CONSTRAINT "_subscriptions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_subscriptions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_subscriptions_v_rels" ADD CONSTRAINT "_subscriptions_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_subscriptions_v_rels" ADD CONSTRAINT "_subscriptions_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assessments_fk" FOREIGN KEY ("assessments_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nutrition_plans_fk" FOREIGN KEY ("nutrition_plans_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_food_scans_fk" FOREIGN KEY ("food_scans_id") REFERENCES "public"."food_scans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_meal_logs_fk" FOREIGN KEY ("meal_logs_id") REFERENCES "public"."meal_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_progress_entries_fk" FOREIGN KEY ("progress_entries_id") REFERENCES "public"."progress_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_messages_fk" FOREIGN KEY ("chat_messages_id") REFERENCES "public"."chat_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE INDEX "admins_rels_users_id_idx" ON "admins_rels" USING btree ("users_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "media_rels_users_id_idx" ON "media_rels" USING btree ("users_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_rels_users_id_idx" ON "_media_v_rels" USING btree ("users_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "folders_rels_users_id_idx" ON "folders_rels" USING btree ("users_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_rels_users_id_idx" ON "_folders_v_rels" USING btree ("users_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "tags_rels_users_id_idx" ON "tags_rels" USING btree ("users_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_rels_users_id_idx" ON "_tags_v_rels" USING btree ("users_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_google_provider_id_idx" ON "users" USING btree ("google_provider_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_admins_id_idx" ON "users_rels" USING btree ("admins_id");
  CREATE INDEX "users_rels_users_id_idx" ON "users_rels" USING btree ("users_id");
  CREATE INDEX "assessments_owner_idx" ON "assessments" USING btree ("owner_id");
  CREATE INDEX "assessments_updated_at_idx" ON "assessments" USING btree ("updated_at");
  CREATE INDEX "assessments_created_at_idx" ON "assessments" USING btree ("created_at");
  CREATE INDEX "assessments_rels_order_idx" ON "assessments_rels" USING btree ("order");
  CREATE INDEX "assessments_rels_parent_idx" ON "assessments_rels" USING btree ("parent_id");
  CREATE INDEX "assessments_rels_path_idx" ON "assessments_rels" USING btree ("path");
  CREATE INDEX "assessments_rels_admins_id_idx" ON "assessments_rels" USING btree ("admins_id");
  CREATE INDEX "assessments_rels_users_id_idx" ON "assessments_rels" USING btree ("users_id");
  CREATE INDEX "_assessments_v_parent_idx" ON "_assessments_v" USING btree ("parent_id");
  CREATE INDEX "_assessments_v_version_version_owner_idx" ON "_assessments_v" USING btree ("version_owner_id");
  CREATE INDEX "_assessments_v_version_version_updated_at_idx" ON "_assessments_v" USING btree ("version_updated_at");
  CREATE INDEX "_assessments_v_version_version_created_at_idx" ON "_assessments_v" USING btree ("version_created_at");
  CREATE INDEX "_assessments_v_created_at_idx" ON "_assessments_v" USING btree ("created_at");
  CREATE INDEX "_assessments_v_updated_at_idx" ON "_assessments_v" USING btree ("updated_at");
  CREATE INDEX "_assessments_v_rels_order_idx" ON "_assessments_v_rels" USING btree ("order");
  CREATE INDEX "_assessments_v_rels_parent_idx" ON "_assessments_v_rels" USING btree ("parent_id");
  CREATE INDEX "_assessments_v_rels_path_idx" ON "_assessments_v_rels" USING btree ("path");
  CREATE INDEX "_assessments_v_rels_admins_id_idx" ON "_assessments_v_rels" USING btree ("admins_id");
  CREATE INDEX "_assessments_v_rels_users_id_idx" ON "_assessments_v_rels" USING btree ("users_id");
  CREATE INDEX "nutrition_plans_owner_idx" ON "nutrition_plans" USING btree ("owner_id");
  CREATE INDEX "nutrition_plans_updated_at_idx" ON "nutrition_plans" USING btree ("updated_at");
  CREATE INDEX "nutrition_plans_created_at_idx" ON "nutrition_plans" USING btree ("created_at");
  CREATE INDEX "nutrition_plans_rels_order_idx" ON "nutrition_plans_rels" USING btree ("order");
  CREATE INDEX "nutrition_plans_rels_parent_idx" ON "nutrition_plans_rels" USING btree ("parent_id");
  CREATE INDEX "nutrition_plans_rels_path_idx" ON "nutrition_plans_rels" USING btree ("path");
  CREATE INDEX "nutrition_plans_rels_admins_id_idx" ON "nutrition_plans_rels" USING btree ("admins_id");
  CREATE INDEX "nutrition_plans_rels_users_id_idx" ON "nutrition_plans_rels" USING btree ("users_id");
  CREATE INDEX "_nutrition_plans_v_parent_idx" ON "_nutrition_plans_v" USING btree ("parent_id");
  CREATE INDEX "_nutrition_plans_v_version_version_owner_idx" ON "_nutrition_plans_v" USING btree ("version_owner_id");
  CREATE INDEX "_nutrition_plans_v_version_version_updated_at_idx" ON "_nutrition_plans_v" USING btree ("version_updated_at");
  CREATE INDEX "_nutrition_plans_v_version_version_created_at_idx" ON "_nutrition_plans_v" USING btree ("version_created_at");
  CREATE INDEX "_nutrition_plans_v_created_at_idx" ON "_nutrition_plans_v" USING btree ("created_at");
  CREATE INDEX "_nutrition_plans_v_updated_at_idx" ON "_nutrition_plans_v" USING btree ("updated_at");
  CREATE INDEX "_nutrition_plans_v_rels_order_idx" ON "_nutrition_plans_v_rels" USING btree ("order");
  CREATE INDEX "_nutrition_plans_v_rels_parent_idx" ON "_nutrition_plans_v_rels" USING btree ("parent_id");
  CREATE INDEX "_nutrition_plans_v_rels_path_idx" ON "_nutrition_plans_v_rels" USING btree ("path");
  CREATE INDEX "_nutrition_plans_v_rels_admins_id_idx" ON "_nutrition_plans_v_rels" USING btree ("admins_id");
  CREATE INDEX "_nutrition_plans_v_rels_users_id_idx" ON "_nutrition_plans_v_rels" USING btree ("users_id");
  CREATE INDEX "food_scans_owner_idx" ON "food_scans" USING btree ("owner_id");
  CREATE INDEX "food_scans_barcode_idx" ON "food_scans" USING btree ("barcode");
  CREATE INDEX "food_scans_updated_at_idx" ON "food_scans" USING btree ("updated_at");
  CREATE INDEX "food_scans_created_at_idx" ON "food_scans" USING btree ("created_at");
  CREATE INDEX "food_scans_rels_order_idx" ON "food_scans_rels" USING btree ("order");
  CREATE INDEX "food_scans_rels_parent_idx" ON "food_scans_rels" USING btree ("parent_id");
  CREATE INDEX "food_scans_rels_path_idx" ON "food_scans_rels" USING btree ("path");
  CREATE INDEX "food_scans_rels_admins_id_idx" ON "food_scans_rels" USING btree ("admins_id");
  CREATE INDEX "food_scans_rels_users_id_idx" ON "food_scans_rels" USING btree ("users_id");
  CREATE INDEX "_food_scans_v_parent_idx" ON "_food_scans_v" USING btree ("parent_id");
  CREATE INDEX "_food_scans_v_version_version_owner_idx" ON "_food_scans_v" USING btree ("version_owner_id");
  CREATE INDEX "_food_scans_v_version_version_barcode_idx" ON "_food_scans_v" USING btree ("version_barcode");
  CREATE INDEX "_food_scans_v_version_version_updated_at_idx" ON "_food_scans_v" USING btree ("version_updated_at");
  CREATE INDEX "_food_scans_v_version_version_created_at_idx" ON "_food_scans_v" USING btree ("version_created_at");
  CREATE INDEX "_food_scans_v_created_at_idx" ON "_food_scans_v" USING btree ("created_at");
  CREATE INDEX "_food_scans_v_updated_at_idx" ON "_food_scans_v" USING btree ("updated_at");
  CREATE INDEX "_food_scans_v_rels_order_idx" ON "_food_scans_v_rels" USING btree ("order");
  CREATE INDEX "_food_scans_v_rels_parent_idx" ON "_food_scans_v_rels" USING btree ("parent_id");
  CREATE INDEX "_food_scans_v_rels_path_idx" ON "_food_scans_v_rels" USING btree ("path");
  CREATE INDEX "_food_scans_v_rels_admins_id_idx" ON "_food_scans_v_rels" USING btree ("admins_id");
  CREATE INDEX "_food_scans_v_rels_users_id_idx" ON "_food_scans_v_rels" USING btree ("users_id");
  CREATE INDEX "meal_logs_owner_idx" ON "meal_logs" USING btree ("owner_id");
  CREATE INDEX "meal_logs_eaten_at_idx" ON "meal_logs" USING btree ("eaten_at");
  CREATE INDEX "meal_logs_scan_idx" ON "meal_logs" USING btree ("scan_id");
  CREATE INDEX "meal_logs_updated_at_idx" ON "meal_logs" USING btree ("updated_at");
  CREATE INDEX "meal_logs_created_at_idx" ON "meal_logs" USING btree ("created_at");
  CREATE INDEX "meal_logs_rels_order_idx" ON "meal_logs_rels" USING btree ("order");
  CREATE INDEX "meal_logs_rels_parent_idx" ON "meal_logs_rels" USING btree ("parent_id");
  CREATE INDEX "meal_logs_rels_path_idx" ON "meal_logs_rels" USING btree ("path");
  CREATE INDEX "meal_logs_rels_admins_id_idx" ON "meal_logs_rels" USING btree ("admins_id");
  CREATE INDEX "meal_logs_rels_users_id_idx" ON "meal_logs_rels" USING btree ("users_id");
  CREATE INDEX "_meal_logs_v_parent_idx" ON "_meal_logs_v" USING btree ("parent_id");
  CREATE INDEX "_meal_logs_v_version_version_owner_idx" ON "_meal_logs_v" USING btree ("version_owner_id");
  CREATE INDEX "_meal_logs_v_version_version_eaten_at_idx" ON "_meal_logs_v" USING btree ("version_eaten_at");
  CREATE INDEX "_meal_logs_v_version_version_scan_idx" ON "_meal_logs_v" USING btree ("version_scan_id");
  CREATE INDEX "_meal_logs_v_version_version_updated_at_idx" ON "_meal_logs_v" USING btree ("version_updated_at");
  CREATE INDEX "_meal_logs_v_version_version_created_at_idx" ON "_meal_logs_v" USING btree ("version_created_at");
  CREATE INDEX "_meal_logs_v_created_at_idx" ON "_meal_logs_v" USING btree ("created_at");
  CREATE INDEX "_meal_logs_v_updated_at_idx" ON "_meal_logs_v" USING btree ("updated_at");
  CREATE INDEX "_meal_logs_v_rels_order_idx" ON "_meal_logs_v_rels" USING btree ("order");
  CREATE INDEX "_meal_logs_v_rels_parent_idx" ON "_meal_logs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_meal_logs_v_rels_path_idx" ON "_meal_logs_v_rels" USING btree ("path");
  CREATE INDEX "_meal_logs_v_rels_admins_id_idx" ON "_meal_logs_v_rels" USING btree ("admins_id");
  CREATE INDEX "_meal_logs_v_rels_users_id_idx" ON "_meal_logs_v_rels" USING btree ("users_id");
  CREATE INDEX "progress_entries_owner_idx" ON "progress_entries" USING btree ("owner_id");
  CREATE INDEX "progress_entries_recorded_at_idx" ON "progress_entries" USING btree ("recorded_at");
  CREATE INDEX "progress_entries_updated_at_idx" ON "progress_entries" USING btree ("updated_at");
  CREATE INDEX "progress_entries_created_at_idx" ON "progress_entries" USING btree ("created_at");
  CREATE INDEX "progress_entries_rels_order_idx" ON "progress_entries_rels" USING btree ("order");
  CREATE INDEX "progress_entries_rels_parent_idx" ON "progress_entries_rels" USING btree ("parent_id");
  CREATE INDEX "progress_entries_rels_path_idx" ON "progress_entries_rels" USING btree ("path");
  CREATE INDEX "progress_entries_rels_admins_id_idx" ON "progress_entries_rels" USING btree ("admins_id");
  CREATE INDEX "progress_entries_rels_users_id_idx" ON "progress_entries_rels" USING btree ("users_id");
  CREATE INDEX "_progress_entries_v_parent_idx" ON "_progress_entries_v" USING btree ("parent_id");
  CREATE INDEX "_progress_entries_v_version_version_owner_idx" ON "_progress_entries_v" USING btree ("version_owner_id");
  CREATE INDEX "_progress_entries_v_version_version_recorded_at_idx" ON "_progress_entries_v" USING btree ("version_recorded_at");
  CREATE INDEX "_progress_entries_v_version_version_updated_at_idx" ON "_progress_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_progress_entries_v_version_version_created_at_idx" ON "_progress_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_progress_entries_v_created_at_idx" ON "_progress_entries_v" USING btree ("created_at");
  CREATE INDEX "_progress_entries_v_updated_at_idx" ON "_progress_entries_v" USING btree ("updated_at");
  CREATE INDEX "_progress_entries_v_rels_order_idx" ON "_progress_entries_v_rels" USING btree ("order");
  CREATE INDEX "_progress_entries_v_rels_parent_idx" ON "_progress_entries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_progress_entries_v_rels_path_idx" ON "_progress_entries_v_rels" USING btree ("path");
  CREATE INDEX "_progress_entries_v_rels_admins_id_idx" ON "_progress_entries_v_rels" USING btree ("admins_id");
  CREATE INDEX "_progress_entries_v_rels_users_id_idx" ON "_progress_entries_v_rels" USING btree ("users_id");
  CREATE INDEX "chat_messages_owner_idx" ON "chat_messages" USING btree ("owner_id");
  CREATE INDEX "chat_messages_thread_id_idx" ON "chat_messages" USING btree ("thread_id");
  CREATE INDEX "chat_messages_updated_at_idx" ON "chat_messages" USING btree ("updated_at");
  CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");
  CREATE INDEX "chat_messages_rels_order_idx" ON "chat_messages_rels" USING btree ("order");
  CREATE INDEX "chat_messages_rels_parent_idx" ON "chat_messages_rels" USING btree ("parent_id");
  CREATE INDEX "chat_messages_rels_path_idx" ON "chat_messages_rels" USING btree ("path");
  CREATE INDEX "chat_messages_rels_admins_id_idx" ON "chat_messages_rels" USING btree ("admins_id");
  CREATE INDEX "chat_messages_rels_users_id_idx" ON "chat_messages_rels" USING btree ("users_id");
  CREATE INDEX "_chat_messages_v_parent_idx" ON "_chat_messages_v" USING btree ("parent_id");
  CREATE INDEX "_chat_messages_v_version_version_owner_idx" ON "_chat_messages_v" USING btree ("version_owner_id");
  CREATE INDEX "_chat_messages_v_version_version_thread_id_idx" ON "_chat_messages_v" USING btree ("version_thread_id");
  CREATE INDEX "_chat_messages_v_version_version_updated_at_idx" ON "_chat_messages_v" USING btree ("version_updated_at");
  CREATE INDEX "_chat_messages_v_version_version_created_at_idx" ON "_chat_messages_v" USING btree ("version_created_at");
  CREATE INDEX "_chat_messages_v_created_at_idx" ON "_chat_messages_v" USING btree ("created_at");
  CREATE INDEX "_chat_messages_v_updated_at_idx" ON "_chat_messages_v" USING btree ("updated_at");
  CREATE INDEX "_chat_messages_v_rels_order_idx" ON "_chat_messages_v_rels" USING btree ("order");
  CREATE INDEX "_chat_messages_v_rels_parent_idx" ON "_chat_messages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_chat_messages_v_rels_path_idx" ON "_chat_messages_v_rels" USING btree ("path");
  CREATE INDEX "_chat_messages_v_rels_admins_id_idx" ON "_chat_messages_v_rels" USING btree ("admins_id");
  CREATE INDEX "_chat_messages_v_rels_users_id_idx" ON "_chat_messages_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "subscriptions_owner_idx" ON "subscriptions" USING btree ("owner_id");
  CREATE INDEX "subscriptions_provider_customer_id_idx" ON "subscriptions" USING btree ("provider_customer_id");
  CREATE UNIQUE INDEX "subscriptions_provider_subscription_id_idx" ON "subscriptions" USING btree ("provider_subscription_id");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE INDEX "subscriptions_rels_order_idx" ON "subscriptions_rels" USING btree ("order");
  CREATE INDEX "subscriptions_rels_parent_idx" ON "subscriptions_rels" USING btree ("parent_id");
  CREATE INDEX "subscriptions_rels_path_idx" ON "subscriptions_rels" USING btree ("path");
  CREATE INDEX "subscriptions_rels_admins_id_idx" ON "subscriptions_rels" USING btree ("admins_id");
  CREATE INDEX "subscriptions_rels_users_id_idx" ON "subscriptions_rels" USING btree ("users_id");
  CREATE INDEX "_subscriptions_v_parent_idx" ON "_subscriptions_v" USING btree ("parent_id");
  CREATE INDEX "_subscriptions_v_version_version_owner_idx" ON "_subscriptions_v" USING btree ("version_owner_id");
  CREATE INDEX "_subscriptions_v_version_version_provider_customer_id_idx" ON "_subscriptions_v" USING btree ("version_provider_customer_id");
  CREATE INDEX "_subscriptions_v_version_version_provider_subscription_i_idx" ON "_subscriptions_v" USING btree ("version_provider_subscription_id");
  CREATE INDEX "_subscriptions_v_version_version_updated_at_idx" ON "_subscriptions_v" USING btree ("version_updated_at");
  CREATE INDEX "_subscriptions_v_version_version_created_at_idx" ON "_subscriptions_v" USING btree ("version_created_at");
  CREATE INDEX "_subscriptions_v_created_at_idx" ON "_subscriptions_v" USING btree ("created_at");
  CREATE INDEX "_subscriptions_v_updated_at_idx" ON "_subscriptions_v" USING btree ("updated_at");
  CREATE INDEX "_subscriptions_v_rels_order_idx" ON "_subscriptions_v_rels" USING btree ("order");
  CREATE INDEX "_subscriptions_v_rels_parent_idx" ON "_subscriptions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_subscriptions_v_rels_path_idx" ON "_subscriptions_v_rels" USING btree ("path");
  CREATE INDEX "_subscriptions_v_rels_admins_id_idx" ON "_subscriptions_v_rels" USING btree ("admins_id");
  CREATE INDEX "_subscriptions_v_rels_users_id_idx" ON "_subscriptions_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_assessments_id_idx" ON "payload_locked_documents_rels" USING btree ("assessments_id");
  CREATE INDEX "payload_locked_documents_rels_nutrition_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("nutrition_plans_id");
  CREATE INDEX "payload_locked_documents_rels_food_scans_id_idx" ON "payload_locked_documents_rels" USING btree ("food_scans_id");
  CREATE INDEX "payload_locked_documents_rels_meal_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("meal_logs_id");
  CREATE INDEX "payload_locked_documents_rels_progress_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("progress_entries_id");
  CREATE INDEX "payload_locked_documents_rels_chat_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_messages_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "payload_llm_instructions_rels_users_id_idx" ON "payload_llm_instructions_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "assessments" CASCADE;
  DROP TABLE "assessments_rels" CASCADE;
  DROP TABLE "_assessments_v" CASCADE;
  DROP TABLE "_assessments_v_rels" CASCADE;
  DROP TABLE "nutrition_plans" CASCADE;
  DROP TABLE "nutrition_plans_rels" CASCADE;
  DROP TABLE "_nutrition_plans_v" CASCADE;
  DROP TABLE "_nutrition_plans_v_rels" CASCADE;
  DROP TABLE "food_scans" CASCADE;
  DROP TABLE "food_scans_rels" CASCADE;
  DROP TABLE "_food_scans_v" CASCADE;
  DROP TABLE "_food_scans_v_rels" CASCADE;
  DROP TABLE "meal_logs" CASCADE;
  DROP TABLE "meal_logs_rels" CASCADE;
  DROP TABLE "_meal_logs_v" CASCADE;
  DROP TABLE "_meal_logs_v_rels" CASCADE;
  DROP TABLE "progress_entries" CASCADE;
  DROP TABLE "progress_entries_rels" CASCADE;
  DROP TABLE "_progress_entries_v" CASCADE;
  DROP TABLE "_progress_entries_v_rels" CASCADE;
  DROP TABLE "chat_messages" CASCADE;
  DROP TABLE "chat_messages_rels" CASCADE;
  DROP TABLE "_chat_messages_v" CASCADE;
  DROP TABLE "_chat_messages_v_rels" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "subscriptions_rels" CASCADE;
  DROP TABLE "_subscriptions_v" CASCADE;
  DROP TABLE "_subscriptions_v_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_theme";
  DROP TYPE "public"."enum_nutrition_plans_status";
  DROP TYPE "public"."enum__nutrition_plans_v_version_status";
  DROP TYPE "public"."enum_food_scans_mode";
  DROP TYPE "public"."enum__food_scans_v_version_mode";
  DROP TYPE "public"."enum_meal_logs_meal_type";
  DROP TYPE "public"."enum__meal_logs_v_version_meal_type";
  DROP TYPE "public"."enum_progress_entries_metric";
  DROP TYPE "public"."enum__progress_entries_v_version_metric";
  DROP TYPE "public"."enum_chat_messages_role";
  DROP TYPE "public"."enum__chat_messages_v_version_role";
  DROP TYPE "public"."enum_subscriptions_provider";
  DROP TYPE "public"."enum_subscriptions_tier";
  DROP TYPE "public"."enum_subscriptions_status";
  DROP TYPE "public"."enum__subscriptions_v_version_provider";
  DROP TYPE "public"."enum__subscriptions_v_version_tier";
  DROP TYPE "public"."enum__subscriptions_v_version_status";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";`)
}
