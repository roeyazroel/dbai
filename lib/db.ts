import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create a connection pool
const connectionPool = postgres(DB_URL, {
  max: 10, // Set the maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
});

const db = drizzle(connectionPool);

export { db };
