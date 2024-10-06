"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import fs from "fs";
import path from "path";
import { QueryTypes, Sequelize } from "sequelize";
import { z } from "zod";
const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_TYPE == "postgres" ? "postgres" : "mysql",
  pool: {
    max: 5,
    idle: 10000,
    acquire: 30000,
  },
});

interface TableRow {
  table_name: string;
  column_name: string;
  description?: string;
  data_type: string;
}

export async function executeQuery(query: string): Promise<TableRow[]> {
  const result = await sequelize.query<TableRow>(query, {
    type: QueryTypes.SELECT,
  });
  return result;
}

export async function getDatabaseStructure(): Promise<TableRow[]> {
  if (!process.env.DB_NAME) {
    throw new Error("DB_NAME is not set");
  }

  const isPostgres = process.env.DB_TYPE === "postgres";

  const query = `
    SELECT
      t.table_name as table_name,
      c.column_name as column_name,
      c.data_type as data_type
    FROM
      information_schema.tables t
    JOIN
      information_schema.columns c ON t.table_name = c.table_name
    WHERE
      t.table_schema = :schema AND
      c.table_schema = :schema AND
      t.table_type = 'BASE TABLE'
    ORDER BY
      t.table_name, c.ordinal_position
  `;

  const result = await sequelize.query<TableRow>(query, {
    type: QueryTypes.SELECT,
    replacements: {
      schema: isPostgres
        ? Sequelize.literal("current_schema()")
        : process.env.DB_NAME,
    },
  });

  await saveToFile(result);

  return result;
}

// save to file
export async function saveToFile(data: TableRow[]) {
  const filePath = path.join(process.cwd(), "database_structure.json");
  let combinedData: TableRow[] = [];

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    const existingData: TableRow[] = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
    combinedData = mergeUniqueRows(existingData, data);
  } else {
    combinedData = data;
  }

  fs.writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
}

export async function getDatabaseStructureFromFile(): Promise<TableRow[]> {
  const filePath = path.join(process.cwd(), "database_structure.json");
  // check if file exists and is not empty
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data;
  }
  // if file does not exist, generate the database structure
  const data = await getDatabaseStructure();
  return data;
}

export async function updateDatabaseStructure(data: TableRow[]) {
  const filePath = path.join(process.cwd(), "database_structure.json");
  let existingData: TableRow[] = [];

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const updatedData = mergeUniqueRows(existingData, data);
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
}

function mergeUniqueRows(
  existing: TableRow[],
  newData: TableRow[]
): TableRow[] {
  const uniqueMap = new Map<string, TableRow>();

  // Add existing data to the map
  for (const row of existing) {
    const key = `${row.table_name}:${row.column_name}`;
    uniqueMap.set(key, row);
  }

  // Update or add new data
  for (const row of newData) {
    const key = `${row.table_name}:${row.column_name}`;
    if (uniqueMap.has(key)) {
      // Merge the existing and new data, preferring new data for updates
      uniqueMap.set(key, { ...uniqueMap.get(key)!, ...row });
    } else {
      uniqueMap.set(key, row);
    }
  }

  return Array.from(uniqueMap.values());
}

export async function generateDatabaseDescription() {
  const data = await getDatabaseStructureFromFile();

  const prompt = `
  You are a database description generator. You are given the following database structure:
  ${JSON.stringify(data, null, 2)}
  Generate an informative description for each column in the database based on the table name, column name and other columns in the same table or other tables.
  `;

  const response = await generateObject({
    model: openai("gpt-4o"),
    prompt: prompt,
    schema: z.object({
      descriptions: z.array(
        z.object({
          description: z.string(),
          table_name: z.string(),
          column_name: z.string(),
        })
      ),
    }),
  });

  console.log(response.object);

  // update the database structure with the new description
  const updatedData = data.map((item) => {
    const description = response.object.descriptions.find(
      (desc) =>
        desc.table_name === item.table_name &&
        desc.column_name === item.column_name
    )?.description;
    return {
      ...item,
      description,
    };
  });
  updateDatabaseStructure(updatedData);
}

export async function getKnowledgeBase() {
  const data = await getDatabaseStructure();
  return data;
}
