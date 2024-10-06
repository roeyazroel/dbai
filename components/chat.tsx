/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
  Query,
} from "@/lib/conversations";
import { useChat } from "ai/react";
import { Loader2, Plus, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { MessageComponent } from "./MessageComponent";
import { Suggestions } from "./Suggestions";

export default function Chat() {
  const { toast } = useToast();
  const pathParams = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const router = useRouter();
  const {
    conversations,
    refreshConversations,
    suggestions,
    isSuggestionsLoading,
  } = useConversation();
  const [isLoading, setIsLoading] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
          id: msg.messages.id.toString(),
          content: msg.messages.content,
          role: msg.messages.role as "user" | "assistant",
        }))
      );
      setConversationMessages(
        conversationMessages.map((msg) => ({
          id: Number(msg.messages.id),
          content: msg.messages.content,
          role: msg.messages.role as "user" | "assistant",
          conversationId: Number(msg.messages.conversationId),
          createdAt: msg.messages.createdAt,
          queries: msg.queries ? [msg.queries] : [],
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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e);
      adjustTextareaHeight(e.target);
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
        handleSubmit(e as never);
      }
    },
    [handleSubmit]
  );

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
        adjustTextareaHeight(textarea);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const toggleSuggestions = () => {
    // This function can be left empty or removed if not needed elsewhere
  };

  if (isLoading) {
    return <Loader />;
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
    <div className="flex flex-col h-full rounded-lg">
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        {conversationMessages.length === 0 ? (
          <MessageComponent
            key={0}
            message={{
              id: 0,
              content: "Hello, How can I help you?",
              role: "assistant",
              conversationId: 0,
              createdAt: new Date(),
            }}
          />
        ) : (
          conversationMessages.map((message) => (
            <MessageComponent
              key={message.id}
              message={{
                id: Number(message.id),
                content: message.content,
                role: message.role,
                conversationId: currentConversationId as number,
                createdAt: message.createdAt as Date,
              }}
              queries={message.queries as Query[]}
            />
          ))
        )}
        {isChatLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="p-4 border-t dark:border-gray-700"
      >
        <div className="flex items-end space-x-2">
          <Textarea
            className="flex-grow dark:bg-gray-700 dark:text-white min-h-[2.5rem] max-h-[10rem] resize-none"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
            rows={1}
            disabled={isChatLoading}
          />
          {!isSuggestionsLoading && (
            <Suggestions
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              toggleSuggestions={toggleSuggestions}
            />
          )}
          <Button
            type="submit"
            size="icon"
            className="mb-[1px]"
            disabled={isChatLoading}
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
            toggleSuggestions={toggleSuggestions}
            isInline={true}
          />
        )}
    </div>
  );
}

export const LoadingMessage = () => (
  <div className="flex justify-start">
    <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  </div>
);

export const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="animate-spin duration-10000 rounded-full size-4 border-t-2 border-b-2 border-gray-900" />
    <p className="text-gray-500">Loading...</p>
  </div>
);
