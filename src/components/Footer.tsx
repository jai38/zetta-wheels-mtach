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
          ? "relative lg:absolute bottom-0 bg-transparent pointer-events-none"
          : "relative bg-black border-t border-white/10 mt-auto pointer-events-auto",
      )}>
      <div
        className={cn(
          "flex flex-col-reverse lg:flex-row justify-between items-center text-xs sm:text-sm text-white/60 gap-4 lg:gap-0",
          isHomePage && "pointer-events-auto",
        )}>
        <div className="mb-2 lg:mb-0 text-center lg:text-left">
          <div className="text-[10px]">
            &copy; {new Date().getFullYear()} Zetta Wheels. All rights reserved.
          </div>
          <div className="text-[10px]">Designed & Developed by SISANC</div>
        </div>
        <div className="flex gap-6">
          <Link
            to="https://www.zettaalloys.com/disclaimer"
            target="_blank"
            className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <Link
            to="https://www.zettaalloys.com/contact"
            target="_blank"
            className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
