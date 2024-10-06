"use server";

import { getKnowledgeBase } from "@/lib/source";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function createSuggestions() {
  const kb = await getKnowledgeBase();

  const { object } = await generateObject<{ suggestions: string[] }>({
    model: openai("gpt-4o"),
    system:
      "You are a helpful assistant that generates query suggestions based on a database structure.",
    schema: z.object({
      suggestions: z
        .array(z.string())
        .describe(
          "An array of suggested queries based on the database structure"
        ),
    }),
    prompt: `Given the following database structure, generate 5 interesting query suggestions that users might want to ask:
             ${JSON.stringify(kb)}
             Provide suggestions that cover different aspects of the data and are phrased as natural language questions.`,
  });

  return object.suggestions;
}
