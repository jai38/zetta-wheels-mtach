// src/components/Layout.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isHomePage && <Header />}
      <main 
        className={cn(
          "flex-grow w-full",
          !isHomePage && "pt-20 sm:pt-28" // Add padding for header on non-home pages
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};