// components/LayoutClient.js
"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { AuthProvider } from "@/components/AuthProvider";

export default function LayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col min-h-screen">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 pt-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-6 px-4">
          <div className="container mx-auto text-center">
            <p>© 2025 Thala For A Reason. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
