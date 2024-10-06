import {
  bigint,
  bigserial,
  index,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const conversations = pgTable(
  "conversations",
  {
    id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (conversations) => ({
    titleIdx: index("title_idx").on(conversations.title),
  })
);

export const messages = pgTable("messages", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  conversationId: bigint("conversation_id", { mode: "number" })
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  content: varchar("content").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queries = pgTable("queries", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  messageId: bigint("message_id", { mode: "number" })
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
