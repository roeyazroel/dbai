/* eslint-disable react/no-unescaped-entities */
"use client";

import DatabaseTable from "@/components/DatabaseTable";
import {
  generateDatabaseDescription,
  getDatabaseStructureFromFile,
} from "@/lib/source";
import { Database, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

type Column = {
  name: string;
  type: string;
  description: string;
};

type Table = {
  name: string;
  columns: Column[];
};

export default function TableStorePage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function fetchTables() {
    try {
      setLoading(true);
      // Fetch tables and columns from the file
      const result = await getDatabaseStructureFromFile();
      // Process the result into the required structure
      const tablesMap = new Map<string, Table>();
      if (Array.isArray(result)) {
        result.forEach((row) => {
          const tableName = row.table_name;
          const column: Column = {
            name: row.column_name,
            type: row.data_type,
            description: row.description || "",
          };

          if (!tablesMap.has(tableName)) {
            tablesMap.set(tableName, { name: tableName, columns: [] });
          }
          tablesMap.get(tableName)!.columns.push(column);
        });

        setTables(Array.from(tablesMap.values()));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Failed to load database schema. Please try again later.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTables();
  }, []);

  const handleGenerateDescriptions = async () => {
    setGenerating(true);
    try {
      await generateDatabaseDescription();
      await fetchTables(); // Fetch the updated data
    } catch (err) {
      console.error("Error generating descriptions:", err);
      setError("Failed to generate descriptions. Please try again later.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading database schema...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="h-full">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-100">
              Manage Your Database Tables
            </h2>
          </div>
          <button
            onClick={handleGenerateDescriptions}
            disabled={generating}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            {generating ? "Generating..." : "Generate Descriptions"}
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Here you can manage your database tables and edit column descriptions.
          Click on the edit icon to modify a column's description or use the
          "Generate Descriptions" button to automatically generate descriptions
          for all columns.
        </p>
      </div>
      {tables.map((table) => (
        <DatabaseTable
          key={table.name}
          name={table.name}
          columns={table.columns}
        />
      ))}
    </div>
  );
}
