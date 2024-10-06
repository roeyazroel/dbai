import { Message, Query } from "@/lib/conversations";
import { Bot, User } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import QueriesComponent from "./QueriesComponent"; // Import the new component
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardFooter } from "./ui/card";

export const MessageComponent = memo(
  ({ message, queries }: { message: Message; queries?: Query[] }) => {
    const isUser = message.role === "user";
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const renderMermaidDiagrams = async () => {
        if (mermaidRef.current) {
          const mermaid = (await import("mermaid")).default;
          mermaid.initialize({ startOnLoad: true, theme: "dark" });

          const diagrams = mermaidRef.current.querySelectorAll(".mermaid");
          diagrams.forEach(async (diagram, index) => {
            try {
              const id = `mermaid-${index}`;
              const { svg } = await mermaid.render(
                id,
                diagram.textContent || ""
              );
              diagram.innerHTML = svg;
            } catch (error) {
              console.error("Error rendering Mermaid diagram:", error);
            }
          });
        }
      };

      renderMermaidDiagrams();
    }, [message]);

    if (message.content === "") {
      return null;
    }

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        {!isUser && (
          <Avatar className="mr-2 bg-primary text-primary-foreground">
            <AvatarFallback>
              <Bot size={20} />
            </AvatarFallback>
          </Avatar>
        )}
        <Card className={`max-w-[80%] ${isUser ? "bg-blue-500" : ""}`}>
          <CardContent className="p-3">
            <div
              ref={mermaidRef}
              className={`${
                isUser ? "text-white" : "text-black dark:text-white"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (match && match[1] === "mermaid") {
                      return (
                        <div className="mermaid">{String(children).trim()}</div>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ children, ...props }) => (
                    <table
                      style={{
                        backgroundColor: "transparent",
                        color: "inherit",
                        width: "100%",
                      }}
                      {...props}
                    >
                      {children}
                    </table>
                  ),
                  tr: ({ children, ...props }) => (
                    <tr
                      style={{
                        backgroundColor: "transparent",
                        color: "inherit",
                      }}
                      {...props}
                    >
                      {children}
                    </tr>
                  ),
                  td: ({ children, ...props }) => (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "8px",
                        backgroundColor: "transparent",
                        color: "inherit",
                      }}
                      {...props}
                    >
                      {children}
                    </td>
                  ),
                  th: ({ children, ...props }) => (
                    <th
                      style={{
                        border: "1px solid",
                        padding: "8px",
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        color: "inherit",
                      }}
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 items-center">
            <p className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col items-center ml-2 ">
          {isUser && (
            <Avatar className="bg-secondary text-secondary-foreground mb-2">
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          )}
          {/* Move QueriesComponent below the Avatar */}
          {queries && queries.length > 0 && (
            <QueriesComponent queries={queries} />
          )}
        </div>
      </div>
    );
  }
);

MessageComponent.displayName = "MessageComponent";
