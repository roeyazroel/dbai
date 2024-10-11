import { Message } from "@/lib/conversations";
import { motion } from "framer-motion";
import { Bot, Check, Copy, User } from "lucide-react";
import mermaid from "mermaid";
import { useRouter } from "next/navigation";
import { createElement, forwardRef, memo, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import QueriesComponent from "./QueriesComponent";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

const MemoizedMessage = memo(({ message }: { message: Message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const isUser = message.role === "user";

  const renderMermaidDiagram = async (children: React.ReactNode) => {
    const { svg } = await mermaid.render(
      `mermaid-${message.id}`,
      String(children).trim()
    );
    return svg;
  };

  const components = {
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (href) {
            router.push(href);
          }
        }}
      >
        {children}
      </a>
    ),
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      if (match && match[1] === "mermaid") {
        return (
          <div id="mermaid" className="mermaid">
            {createElement("div", {
              dangerouslySetInnerHTML: {
                __html: "",
              },
              ref: async (node: HTMLDivElement) => {
                if (node) {
                  const svg = await renderMermaidDiagram(children);
                  node.innerHTML = svg;
                }
              },
            })}
          </div>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    table: ({ children, ...props }: any) => (
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
    tr: ({ children, ...props }: any) => (
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
    td: ({ children, ...props }: any) => (
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
    th: ({ children, ...props }: any) => (
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
  };

  const memoizedContent = useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components as any}
      >
        {message.content}
      </ReactMarkdown>
    ),
    [message.content]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <Avatar className="bg-secondary text-secondary-foreground mr-2">
          <AvatarFallback>
            <Bot size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      <Card
        className={`max-w-[80%] ${
          isUser ? "bg-primary" : "bg-secondary"
        } shadow-sm relative`}
      >
        <CardContent className="p-3">
          <div
            className={`${
              isUser ? "text-primary-foreground" : "text-secondary-foreground"
            }`}
          >
            {memoizedContent}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 items-center">
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="p-1 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {isCopied ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Check size={16} className="text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    whileTap={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Copy size={16} />
                  </motion.div>
                )}
              </motion.div>
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </CardFooter>
      </Card>
      <div className="flex flex-col items-center ml-2">
        {isUser && (
          <Avatar className="bg-secondary text-secondary-foreground mb-2">
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        )}
        {message.queries && message.queries.length > 0 && (
          <QueriesComponent queries={message.queries} />
        )}
      </div>
    </div>
  );
});

MemoizedMessage.displayName = "MemoizedMessage";

export const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: Message[];
    lastMessageRef?: React.RefObject<HTMLDivElement>;
  }
>(({ messages, lastMessageRef }, ref) => {
  return (
    <div ref={ref} className="space-y-4">
      {messages.map((message, index) => (
        <MemoizedMessage key={`${message.id}-${index}`} message={message} />
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
});

MessageList.displayName = "MessageList";
