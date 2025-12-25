// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-wob.png";

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 h-20 sm:h-28 flex items-center justify-center sm:justify-start sm:px-8">
      <div className="flex items-center justify-center">
        <Link to="/" className="group flex items-center select-none">
          <img
            src={logo}
            alt="Neo Wheels Logo"
            className="h-11 sm:h-16 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
};
