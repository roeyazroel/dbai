/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConversation } from "@/contexts/ConversationContext";
import { useToast } from "@/hooks/use-toast";
import {
  Conversation,
  createConversation,
  getConversation,
  getConversationMessages,
  Message,
} from "@/lib/conversations";
import { useChat } from "ai/react";
import { Plus, Send } from "lucide-react";
import mermaid from "mermaid";
import { useParams, useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageComponent";
import { Suggestions } from "./Suggestions";

export default function Chat() {
  const { toast } = useToast();
  const pathParams = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const router = useRouter();
  const { refreshConversations, suggestions, isSuggestionsLoading } =
    useConversation();
  const [isLoading, setIsLoading] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
    setMessages,
    setInput,
  } = useChat({
    maxToolRoundtrips: 10,
    onToolCall({ toolCall }) {
      console.log("Tool called:", toolCall.toolName);
    },
    api: `/api/chat?orgId=${pathParams.id}&conversationId=${currentConversationId}`,
    onError: (error) => {
      toast({
        title: `Oops! Something went wrong.`,
        description: error.message,
        variant: "destructive",
      });
    },
    onFinish: () => {
      scrollToBottom();
      loadConversationMessages(currentConversationId as number);
    },
  });

  useEffect(() => {
    if (pathParams.id) {
      setIsLoading(true);
      const conversationId = Number(pathParams.id);
      setCurrentConversationId(conversationId);
      loadConversationMessages(conversationId);
    } else {
      setIsLoading(false);
    }
  }, [pathParams]);

  const loadConversationMessages = async (conversationId: number) => {
    try {
      const conversationResult = await getConversation(conversationId);

      if (
        !conversationResult ||
        (Array.isArray(conversationResult) && conversationResult.length === 0)
      ) {
        setIsLoading(false);
        return;
      }

      const conversation = Array.isArray(conversationResult)
        ? conversationResult[0]
        : conversationResult;
      setCurrentConversation(conversation);

      const conversationMessages = await getConversationMessages(
        conversationId
      );

      setMessages(
        conversationMessages.map((msg) => ({
          id: msg.id.toString(),
          content: msg.content,
          role: msg.role as "user" | "assistant",
        }))
      );
      setConversationMessages(
        conversationMessages.map((msg) => ({
          id: Number(msg.id),
          content: msg.content,
          role: msg.role as "user" | "assistant",
          conversationId: Number(msg.conversationId),
          createdAt: msg.createdAt,
          queries: msg.queries
            ? Array.isArray(msg.queries)
              ? msg.queries
              : [msg.queries]
            : [],
        }))
      );
    } catch (error) {
      console.error("Error loading conversation messages:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // Add a small delay
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, scrollToBottom]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e);
      adjustTextareaHeight(e.target as HTMLTextAreaElement);
    },
    [handleInputChange]
  );

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        adjustTextareaHeight(e.target as HTMLTextAreaElement);
        sendMessage(input);
      }
    },
    [input]
  );

  const sendMessage = async (message: string) => {
    setConversationMessages([
      ...conversationMessages,
      {
        id: conversationMessages.length + 1,
        content: message,
        role: "user",
        conversationId: currentConversationId as number,
        createdAt: new Date(),
      },
    ]);
    handleSubmit(message as never);
  };

  const handleCreateNewConversation = async () => {
    const newConversation = await createConversation("New Conversation");
    await refreshConversations();
    router.push(`/chat/${newConversation.id}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (chatContainerRef.current) {
      const textarea = chatContainerRef.current.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold mb-4">
          No conversation selected
        </h2>
        <p className="text-gray-600 mb-6">
          Create a new conversation to get started
        </p>
        <Button onClick={handleCreateNewConversation}>
          <Plus className="h-4 w-4 mr-2" /> New Conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-lg bg-card shadow-sm">
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        {conversationMessages.length === 0 ? (
          <MessageList
            messages={[
              {
                id: 0,
                content: "Hello, How can I help you?",
                role: "assistant",
                conversationId: 0,
                createdAt: new Date(),
              },
            ]}
          />
        ) : (
          <MessageList
            messages={conversationMessages}
            lastMessageRef={lastMessageRef}
          />
        )}
        {isChatLoading && <LoadingMessage />}
      </div>
      <form onSubmit={handleFormSubmit} className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Textarea
            ref={textareaRef}
            className="flex-grow bg-secondary text-secondary-foreground min-h-[2.5rem] max-h-[10rem] resize-none rounded-lg"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
            rows={1}
            disabled={isChatLoading}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "0px";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          {!isSuggestionsLoading && (
            <Suggestions
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              // toggleSuggestions prop has been removed
            />
          )}
          <Button
            type="submit"
            size="icon"
            className="mb-[1px] bg-primary text-primary-foreground rounded-full"
            disabled={isChatLoading || input.length === 0}
            onClick={() => {
              sendMessage(input);
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
      {messages.length === 0 &&
        suggestions.length > 0 &&
        !isSuggestionsLoading && (
          <Suggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            isInline={true}
          />
        )}
    </div>
  );
}

export const LoadingMessage = () => (
  <div className="flex justify-start">
    <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  </div>
);
