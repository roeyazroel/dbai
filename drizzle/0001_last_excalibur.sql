DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN IF EXISTS "user_id";