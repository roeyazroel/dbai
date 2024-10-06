CREATE TABLE IF NOT EXISTS "conversations" (
	"id" bigint PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"user_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" bigint PRIMARY KEY NOT NULL,
	"conversation_id" bigint NOT NULL,
	"content" varchar(1000) NOT NULL,
	"role" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "conversations" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "conversations" USING btree ("user_id");