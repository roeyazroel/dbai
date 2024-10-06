"use client";

import { Conversation, getConversations } from "@/lib/conversations";
import { createSuggestions } from "@/actions/createSuggestions";
import React, { createContext, useCallback, useState, useEffect, useContext } from "react";

interface ConversationContextType {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  suggestions: string[];
  isSuggestionsLoading: boolean;
}

export const ConversationContext = createContext<ConversationContextType>({
  conversations: [],
  refreshConversations: async () => {},
  suggestions: [],
  isSuggestionsLoading: true,
});

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);

  const refreshConversations = useCallback(async () => {
    const fetchedConversations = await getConversations();
    setConversations(fetchedConversations);
  }, []);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const loadedSuggestions = await createSuggestions();
        setSuggestions(loadedSuggestions);
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }
    loadSuggestions();
  }, []);

  return (
    <ConversationContext.Provider
      value={{ conversations, refreshConversations, suggestions, isSuggestionsLoading }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => useContext(ConversationContext);
