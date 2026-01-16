// src/components/Footer.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer
      className={cn(
        "w-full py-6 px-6 sm:px-12 z-40 transition-all duration-300",
        isHomePage
          ? "absolute bottom-0 bg-transparent pointer-events-none"
          : "relative bg-black border-t border-white/10 mt-auto pointer-events-auto",
      )}>
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-white/60",
          isHomePage && "pointer-events-auto",
        )}>
        <div className="mb-2 sm:mb-0">
          <div>
            &copy; {new Date().getFullYear()} Neo Wheels. All rights reserved.
          </div>
          <div>Designed & Developed by SISANC</div>
        </div>
        <div className="flex gap-6">
          <Link
            to="https://www.neowheels.com/disclaimer"
            target="_blank"
            className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <Link
            to="https://www.neowheels.com/contact"
            target="_blank"
            className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
