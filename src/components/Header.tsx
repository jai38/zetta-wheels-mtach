// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <header className="bg-[--header-footer-background] text-[--header-footer-foreground] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Neo Wheel Match
        </Link>
      </div>
    </header>
  );
};
