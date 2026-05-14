/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Content from "./components/Content";
import Analytics from "./components/Analytics";
import Culinary from "./components/Culinary";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NavItem } from "./types";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { user, token, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavItem>("dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "content":
        return <Content />;
      case "analytics":
        return <Analytics />;
      case "culinary":
        return <Culinary />;
      case "settings":
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
            <h2 className="font-display text-4xl font-black text-on-surface opacity-20">Settings Coming Soon</h2>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        
        <main className="mt-16 p-8 lg:p-12 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
