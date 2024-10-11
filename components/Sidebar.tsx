"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConversationContext } from "@/contexts/ConversationContext";
import {
  createConversation,
  deleteConversation,
  renameConversation,
} from "@/lib/conversations";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Database,
  Edit2,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const navItems = [
  { href: "/", icon: MessageSquare, label: "Chat" },
  { href: "/table-store", icon: Database, label: "Table Store" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { conversations, refreshConversations } =
    useContext(ConversationContext);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleCreateConversation = async () => {
    const newConversation = await createConversation("New Conversation");
    refreshConversations(); // Refresh conversations instead of updating state directly
    router.push(`/chat/${newConversation.id}`);
  };

  const handleRenameConversation = async (id: number) => {
    if (newTitle.trim()) {
      await renameConversation(id, newTitle);
      refreshConversations(); // Refresh conversations instead of updating state directly
      setEditingId(null);
      setNewTitle("");
    }
  };

  const handleDeleteConversation = async (id: number) => {
    await deleteConversation(id);
    await refreshConversations();

    // If the deleted conversation was the active one, redirect to the home page
    if (pathname === `/chat/${id}`) {
      router.push("/");
    }
  };

  const handleConversationClick = (id: number) => {
    router.push(`/chat/${id}`);
  };

  return (
    <nav className="w-64 bg-gradient-to-r from-primary/20 to-secondary/20 text-card-foreground shadow-lg flex flex-col h-full">
      <div className="p-6 justify-center items-center w-full">
        <h1 className="text-4xl font-extrabold text-primary text-center relative">
          <span className="absolute top-0 left-0 w-full h-full filter blur-sm"></span>
          {["D", "B", "A", "I"].map((char, index) => (
            <span key={index} className="inline-block relative z-10">
              {char}
            </span>
          ))}
        </h1>
      </div>
      <ul className="mt-6 flex-grow overflow-y-auto">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="relative block">
              <motion.div
                className={`flex items-center px-6 py-3 ${
                  pathname === item.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-card-foreground hover:bg-secondary/50"
                } rounded-md mx-2 transition-colors`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
                {/* <ChevronRight className="h-4 w-4 ml-auto" /> */}
              </motion.div>
            </Link>
          </li>
        ))}
        <li className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-card-foreground">
              Conversations
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="p-1 size-6 text-muted-foreground hover:text-card-foreground"
              onClick={handleCreateConversation}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-secondary/50 rounded-md p-2 transition-colors"
                onClick={() => handleConversationClick(conv.id)}
              >
                <div className="flex-grow">
                  {editingId === conv.id ? (
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRenameConversation(conv.id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleRenameConversation(conv.id)
                      }
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate text-card-foreground">
                      {conv.title}
                    </span>
                  )}
                </div>
                <div className="flex flex-row space-x-1 ml-2 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="p-1 size-6 text-muted-foreground hover:text-card-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(conv.id);
                      setNewTitle(conv.title);
                    }}
                  >
                    <Edit2 className="size-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="p-1 size-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
