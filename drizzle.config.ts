import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/sql.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DBAI_DB_HOST ?? "127.0.0.1",
    user: process.env.DBAI_DB_USER,
    password: process.env.DBAI_DB_PASSWORD,
    database: process.env.DBAI_DB_NAME ?? "dbai",
  },
});
