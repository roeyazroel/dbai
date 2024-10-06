CREATE TABLE IF NOT EXISTS "queries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"message_id" bigint NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queries" ADD CONSTRAINT "queries_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
