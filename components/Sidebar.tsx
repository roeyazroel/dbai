"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationContext } from "@/contexts/ConversationContext";
import {
  createConversation,
  deleteConversation,
  renameConversation,
} from "@/lib/conversations";
import { cn } from "@/lib/utils";
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
    <nav className="w-64 bg-gradient-to-br from-primary/10 via-secondary/10 to-background text-card-foreground shadow-lg flex flex-col h-full">
      <div className="p-6 justify-center items-center w-full">
        <h1 className="text-4xl font-extrabold text-primary text-center relative">
          <span className="absolute top-0 left-0 w-full h-full bg-primary/5 filter blur-md rounded-full"></span>
          {["D", "B", "A", "I"].map((char, index) => (
            <motion.span
              key={index}
              className="inline-block relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
      </div>
      <ScrollArea className="flex-grow">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block">
                <motion.div
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Conversations
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
              onClick={handleCreateConversation}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                  pathname === `/chat/${conv.id}`
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleConversationClick(conv.id)}
              >
                <div className="flex-grow truncate">
                  {editingId === conv.id ? (
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRenameConversation(conv.id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleRenameConversation(conv.id)
                      }
                      className="h-7 px-2 py-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{conv.title}</span>
                  )}
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-card-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(conv.id);
                      setNewTitle(conv.title);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
}
