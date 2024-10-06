import {
  addMessage,
  addQuery,
  getConversationMessages,
  Message,
} from "@/lib/conversations";
import { executeQuery, getKnowledgeBase } from "@/lib/source";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, generateObject, streamText, tool } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // if (!user) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  // extract orgId from request query params
  const { searchParams } = req.nextUrl;
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return new Response("Bad Request", { status: 400 });
  }

  const { messages } = await req.json();

  // Fetch existing messages for the conversation
  const existingMessages = await getConversationMessages(
    parseInt(conversationId)
  );

  const newMessage = messages[messages.length - 1];
  // check if message is not empty
  let message: Message;
  if (newMessage.content && newMessage.content !== "") {
    message = await addMessage(
      parseInt(conversationId),
      newMessage.content,
      newMessage.role ?? "user"
    );
  } else {
    // get the last message from the existing messages
    message = (await getConversationMessages(parseInt(conversationId)))[
      existingMessages.length - 1
    ].messages;
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: [
      ...convertToCoreMessages(
        existingMessages.map((m) => ({
          role: m.messages.role as "user" | "assistant" | "system",
          content: m.messages.content,
        }))
      ),
      ...convertToCoreMessages(messages),
    ],
    system: `You are a database query assistant. Your primary functions are:
    1. Get the database structure using the getDatabaseStructure tool.
    2. Generate a SQL query based on the user's request and the database structure using the generateQuery tool.
    3. Execute the generated query using the executeQuery tool.
    4. Return the query results to the user in a clear and formatted manner.
    Only answer questions that can be addressed using the provided database schema.
    If a question cannot be answered using the database schema, politely inform the user that the query is not possible with the current database structure.
    Do not provide any information or answers that are not directly based on the database schema or the query results.
    Use mermaid to format the database schema (only if it is a supported format, such as pie, bar, line, etc.).
    You must be strict with the mermaid format, it must be started with "\`\`\`mermaid" and ended with "\`\`\`".
    For bar chart, line chart - you can use the xychart-beta format.
    For pie chart, you can use the pie chart format.
    For timeline, you can use the timeline format.
    For journey, you can use the journey format.
    For quadrant, you can use the quadrant format.
    For gantt, you can use the gantt format.


    Examples of mermaid format:

    // XY chart example
    \`\`\`mermaid
    xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000] # make sure to use the mermaid format correctly, without new lines
    \`\`\`

    \`\`\`mermaid
    xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000] # make sure to use the mermaid format correctly, without new lines
    \`\`\`

    // Pie chart example
    \`\`\`mermaid
    pie
    title  "number of users"
    "data 1": 10
    "data 2": 20
    "data 3": 30
    \`\`\`

    // Timeline example
    \`\`\`mermaid
    timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter
    \`\`\`

    // Journey chart example
    \`\`\`mermaid
    journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
    \`\`\`

    // Quadrant chart example
    \`\`\`mermaid
    quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
    \`\`\`

    // Gantt chart example
    \`\`\`mermaid
    gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
        A task          :a1, 2014-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2014-01-12, 12d
        another task    :24d
    \`\`\`
    `,
    tools: {
      getDatabaseStructure: tool({
        description: `Get the structure of the database.`,
        parameters: z.object({}),
        execute: async () => {
          return await getKnowledgeBase();
        },
      }),
      generateQuery: tool({
        description: `Generate a SQL query based on the user's request and the database structure.`,
        parameters: z.object({
          userRequest: z.string().describe("The user's request"),
          databaseStructure: z.any().describe("The structure of the database"),
        }),
        execute: async ({ userRequest, databaseStructure }) => {
          const { object } = await generateObject<{
            query: string;
          }>({
            model: openai("gpt-4o"),
            system:
              "You are a SQL query generator. Generate a SQL query based on the user's request and the provided database structure.",
            schema: z.object({
              query: z.string().describe("The generated SQL query"),
            }),
            prompt: `User request: "${userRequest}"
                     Database structure: ${JSON.stringify(databaseStructure)}
                     Generate an appropriate SQL query:`,
          });
          return object.query;
        },
      }),
      executeQuery: tool({
        description: `Execute the generated SQL query and return the results,
        Please make sure to use the mermaid format correctly, it must be started with "\`\`\`mermaid" and ended with "\`\`\`".
        Only one mermaid chart is allowed per response.`,
        parameters: z.object({
          query: z.string().describe("The SQL query to execute"),
        }),
        execute: async ({ query }) => {
          try {
            try {
              await addQuery(message.id, query);
            } catch (error: unknown) {
              console.error(error);
            }

            const results = await executeQuery(query);
            return JSON.stringify(results);
          } catch (error: unknown) {
            if (error instanceof Error) {
              return `Error executing query: ${error.message}`;
            } else {
              return `Error executing query: Unknown error`;
            }
          }
        },
      }),
    },
    async onFinish({ text }) {
      if (text && text !== "") {
        await addMessage(parseInt(conversationId), text, "assistant");
      }
    },
  });

  return result.toDataStreamResponse();
}
