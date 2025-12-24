// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-wob.png";

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 p-6 sm:p-12">
      <div className="flex items-center">
        <Link to="/" className="group flex items-center select-none">
          <img 
            src={logo} 
            alt="Neo Wheels Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
};