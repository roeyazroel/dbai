import { Query } from "@/lib/conversations";
import { Code2Icon, CopyIcon } from "lucide-react"; // Import CopyIcon
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { format } from "sql-formatter";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"; // Import dialog components

interface QueriesComponentProps {
  queries: Query[] | null;
}

const QueriesComponent: React.FC<QueriesComponentProps> = ({ queries }) => {
  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert("Copied to clipboard!"); // Optional: Show a success message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="size-6 hover:scale-110 transition-transform duration-200"
          style={{
            animation: "pulse 1s ease-in-out 3",
          }}
        >
          <Code2Icon className="size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto max-w-[50vw] bg-card">
        <DialogTitle className="text-lg font-semibold mb-4">
          Executed Queries
        </DialogTitle>
        {queries?.map((query, index) => (
          <div key={index} className="relative mb-4 rounded-md overflow-hidden">
            <SyntaxHighlighter language="sql" >
              {format(query.content)}
            </SyntaxHighlighter>
            <div
              onClick={() => copyToClipboard(query.content)}
              className="absolute bottom-2 right-2 cursor-pointer hover:text-primary transition-colors duration-200"
            >
              <CopyIcon className="size-4" />
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default QueriesComponent;
