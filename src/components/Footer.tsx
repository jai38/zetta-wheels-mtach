// src/components/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[--header-footer-background] text-[--header-footer-foreground] p-4 shadow-md mt-auto">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} NeoWheels. All rights reserved.
      </div>
    </footer>
  );
};
