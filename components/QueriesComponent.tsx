import { Query } from "@/lib/conversations";
import { Code2Icon, CopyIcon } from "lucide-react"; // Import CopyIcon
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Button } from "./ui/button";
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
        <Button
          variant={"ghost"}
          size="icon"
          className="size-6 hover:scale-110"
          style={{
            animation: "pulse 1s ease-in-out 3",
          }}
        >
          <Code2Icon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto max-w-[50vw]">
        <DialogTitle>Executed Queries</DialogTitle>
        {queries?.map((query, index) => (
          <div key={index} className="relative mb-4">
            {" "}
            {/* Make this div relative */}
            <SyntaxHighlighter language="sql">
              {query.content}
            </SyntaxHighlighter>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(query.content)}
              className="absolute bottom-2 right-2" // Position the button
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default QueriesComponent;
