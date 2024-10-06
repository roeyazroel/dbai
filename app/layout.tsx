import "./globals.css";

import Sidebar from "@/components/Sidebar";

import { ConversationProvider } from "@/contexts/ConversationContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chat with SQL Database",
  description: "Chat with your database using AI",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <ConversationProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </ConversationProvider>
      </body>
    </html>
  );
}
