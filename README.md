# Database AI Assistant

An AI-powered assistant for interacting with and managing databases, built with Next.js and the Vercel AI SDK.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
   - [Environment Setup](#environment-setup)
   - [Using Docker](#using-docker)
   - [Running the Application](#running-the-application)
3. [How It Works](#how-it-works)
   - [Key Components](#key-components)
   - [Detailed Workflow](#detailed-workflow)
4. [AI Tools and Flow](#ai-tools-and-flow)
   - [Available Tools](#available-tools)
   - [Tool Usage Flow](#tool-usage-flow)
   - [Example Flow](#example-flow)
5. [Technical Details](#technical-details)
   - [Database Integration](#database-integration)
   - [AI Integration](#ai-integration)
6. [Database Structure Caching](#database-structure-caching)
7. [Conversation Management](#conversation-management)
8. [Learn More](#learn-more)
9. [Contributing](#contributing)

## Features

- AI-powered chat interface for database queries and management
- Database structure visualization and editing
- Automatic generation of column descriptions
- Support for multiple database types (PostgreSQL, MySQL)
- Docker setup for easy development and deployment
- Conversation management for persistent interactions

## Getting Started

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your database credentials and OpenAI API key in `.env.local`

### Using Docker

1. Ensure Docker and Docker Compose are installed
2. Run: `docker-compose up -d`

This starts PostgreSQL, MySQL, and DBGate (database management tool) containers.

### Running the Application

#### Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

#### run drizzle migration

```bash
npx drizzle-kit push
```

#### Run the application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Key Components

1. **Chat Interface** (`components/chat.tsx`): User interaction point
2. **AI Processing** (`app/api/chat/route.ts`): Handles message processing using Vercel AI SDK
3. **Target Database Integration** (`lib/source.ts`): Connects to and queries the target database
4. **Conversation Database Management** (`lib/db.ts`): Manages storage and retrieval of conversations
5. **Query Generation**: AI generates SQL queries based on user input
6. **Query Execution**: Executes generated queries against the target database
7. **Visualization**: Generates data visualizations using Mermaid.js
8. **Suggestions** (`actions/createSuggestions.ts`): Generates query suggestions
9. **Conversation Management** (`contexts/ConversationContext.tsx`): Manages chat history

### Detailed Workflow

1. **User Input**: The user enters a question or request in the chat interface.
2. **AI Processing**: The input is sent to `app/api/chat/route.ts`, where the Vercel AI SDK processes it.
3. **Target Database Structure Retrieval**: The AI retrieves the current target database structure using the `getDatabaseStructure` tool from `lib/source.ts`.
4. **Query Generation**: Based on the user's request and the database structure, the AI generates an appropriate SQL query using the `generateQuery` tool.
5. **Query Execution**: The generated query is executed against the target database using the `executeQuery` tool from `lib/source.ts`.
6. **Result Formatting**: The AI formats the query results, potentially generating visualizations using Mermaid.js syntax.
7. **Response**: The formatted response is sent back to the user and displayed in the chat interface.
8. **Conversation Storage**: The interaction is stored in the conversation database using functions from `lib/db.ts` for future reference.

This process allows users to interact with their target database using natural language, with the AI handling the complexities of SQL query generation and data interpretation.

### AI Integration

- Uses Vercel AI SDK with OpenAI's GPT models
- Set OpenAI API key in environment variables

## AI Tools and Flow

The Database AI Assistant uses a set of custom tools to interact with the database and generate responses. These tools are defined in `app/api/chat/route.ts` and are used by the AI model to perform specific tasks.

### Available Tools

1. **getDatabaseStructure**

   - Description: Retrieves the structure of the target database.
   - Usage: Called at the beginning of a conversation to understand the database schema.

2. **generateQuery**

   - Description: Generates a SQL query based on the user's request and the database structure.
   - Parameters:
     - `userRequest`: The user's natural language query
     - `databaseStructure`: The structure of the database
   - Usage: Translates user requests into SQL queries.

3. **executeQuery**
   - Description: Executes the generated SQL query on the target database.
   - Parameters:
     - `query`: The SQL query to execute
   - Usage: Runs the query and returns the results.

### Tool Usage Flow

1. When a user sends a message, the AI first calls `getDatabaseStructure` to understand the current database schema.

2. Based on the user's request and the database structure, the AI uses `generateQuery` to create an appropriate SQL query.

3. The generated query is then executed using the `executeQuery` tool.

4. The AI processes the results and formulates a response, which may include data visualizations using Mermaid.js syntax.

5. The response is sent back to the user and displayed in the chat interface.

### Example Flow

User: "Show me the top 5 bestselling books"

1. AI calls `getDatabaseStructure` to understand the database schema.
2. AI uses `generateQuery` to create a SQL query like:
   ```sql
   SELECT books.title, SUM(order_items.quantity) as total_sold
   FROM books
   JOIN order_items ON books.book_id = order_items.book_id
   GROUP BY books.book_id
   ORDER BY total_sold DESC
   LIMIT 5
   ```
3. AI executes this query using `executeQuery`.
4. AI processes the results and generates a response, possibly including a bar chart visualization.
5. The formatted response is sent back to the user.

This tool-based approach allows the AI to interact with the database in a structured and controlled manner, ensuring accurate and relevant responses to user queries.

## Technical Details

### Database Integration

- **Target Database**:

  - Supports PostgreSQL and MySQL
  - Managed by Sequelize in `lib/source.ts`
  - Used for querying and retrieving structure of the user's database
  - Configure target database credentials in `.env.local`

- **Conversation Database**:
  - Uses PostgreSQL
  - Managed by Drizzle ORM in `lib/db.ts`
  - Stores conversation history and user interactions
  - Configure conversation database credentials in `.env.local`

## Database Structure Caching

### database_structure.json

The `database_structure.json` file plays a crucial role in caching and managing the structure of the target database. Here's an overview of its purpose and functionality:

1. **Purpose**:

   - Caches the structure of the target database to reduce the number of direct database queries.
   - Provides a quick reference for the AI to understand the database schema without repeatedly querying the actual database.
   - Allows for offline analysis of the database structure.

2. **Content**:

   - Contains a JSON representation of the database schema, including tables, columns, data types, and descriptions.
   - Example structure:
     ```json
     [
       {
         "table_name": "books",
         "column_name": "book_id",
         "data_type": "int",
         "description": "Unique identifier for each book"
       },
       {
         "table_name": "books",
         "column_name": "title",
         "data_type": "varchar",
         "description": "The title of the book"
       }
       // ... more columns and tables
     ]
     ```

3. **Generation and Updates**:

   - Initially created by the `getDatabaseStructure` function in `lib/source.ts`.
   - Updated whenever there are changes to the database schema or when descriptions are modified.
   - The `saveToFile` and `updateDatabaseStructure` functions in `lib/source.ts` manage writing and updating this file.

4. **Usage in the Application**:

   - The AI assistant uses this file to quickly understand the database structure without querying the database each time.
   - Helps in generating more accurate SQL queries and providing context for user questions.
   - Used by the `createSuggestions` function to generate relevant query suggestions.

5. **Benefits**:

   - Improves performance by reducing database queries for schema information.
   - Allows the application to work with the database structure even when the database is offline.
   - Facilitates easy sharing and version control of the database structure.

6. **Maintenance**:
   - It's important to keep this file up-to-date with any changes in the actual database schema.
   - The file can be manually edited to add or modify column descriptions, which are then used by the AI to provide more context-aware responses.

By utilizing `database_structure.json`, the Database AI Assistant can provide quick and efficient responses based on the latest understanding of the database structure, enhancing both performance and accuracy of the AI-generated queries and explanations.

## Conversation Management

### Overview

The conversation management system in the Database AI Assistant allows for persistent interactions between users and the AI. It stores chat history, manages context, and enables users to continue conversations across sessions.

### Detailed Explanation

1. **Storage**: Conversations are stored in the conversation database using PostgreSQL, managed by Drizzle ORM (`lib/db.ts`).

2. **Context**: The `ConversationContext` (`contexts/ConversationContext.tsx`) manages the current conversation state, including messages and metadata.

3. **Persistence**: Chat history is saved after each interaction, allowing users to resume conversations later.

4. **Retrieval**: Previous conversations can be loaded and continued, maintaining context and history.

5. **Integration**: The chat component (`components/chat.tsx`) integrates with the conversation management system to display and update chat history.

This system ensures a seamless and continuous interaction experience for users, enhancing the AI's ability to provide context-aware responses and maintain conversation flow across multiple sessions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sequelize](https://sequelize.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Docker](https://docs.docker.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
