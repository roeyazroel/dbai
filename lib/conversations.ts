"use server";

import { asc, eq } from "drizzle-orm";
import { conversations, messages, queries } from "../schema/sql";
import { db } from "./db";

export interface Conversation {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Query {
  id: number;
  messageId: number;
  content: string;
  createdAt: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: string;
  createdAt: Date;
  queries?: Query[];
}

export async function getMessageById(messageId: number) {
  const messageWithQueries = await db
    .select()
    .from(messages)
    .where(eq(messages.id, messageId))
    .leftJoin(queries, eq(messages.id, queries.messageId));

  if (messageWithQueries.length === 0) {
    return null;
  }

  const message = messageWithQueries[0].messages;
  const queriesArray = messageWithQueries
    .map((row) => row.queries)
    .filter(Boolean);

  return {
    id: message.id,
    content: message.content,
    role: message.role,
    createdAt: message.createdAt,
    queries: queriesArray,
  };
}

export async function createConversation(title: string): Promise<Conversation> {
  const [newConversation] = await db
    .insert(conversations)
    .values({
      title,
    })
    .returning();
  return newConversation;
}

export async function deleteConversation(id: number): Promise<void> {
  // First, delete all messages associated with the conversation
  await db.delete(messages).where(eq(messages.conversationId, id));

  // Then, delete the conversation itself
  await db.delete(conversations).where(eq(conversations.id, id));
}

export async function renameConversation(
  id: number,
  newTitle: string
): Promise<Conversation> {
  const [updatedConversation] = await db
    .update(conversations)
    .set({ title: newTitle, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning();
  return updatedConversation;
}

export async function getConversations(): Promise<Conversation[]> {
  return await db.select().from(conversations);
}

export async function getConversation(conversationId: number) {
  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));
}

export async function getConversationMessages(conversationId: number) {
  const conversationMessages = await db
    .select()
    .from(messages)
    .leftJoin(queries, eq(messages.id, queries.messageId))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  return conversationMessages;
}

export async function addMessage(
  conversationId: number,
  content: string,
  role: string
): Promise<Message> {
  console.log(
    `Adding message to conversation ${conversationId}: ${content} (${role})`
  );
  try {
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        content,
        role,
      })
      .returning();
    console.log("Message added successfully");
    return newMessage;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error; // Re-throw the error so it can be caught in the component
  }
}

export async function addQuery(
  messageId: number,
  content: string
): Promise<void> {
  await db.insert(queries).values({
    messageId,
    content,
  });
}
