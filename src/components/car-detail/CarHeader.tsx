import React from "react";

interface CarHeaderProps {
  carTitle: string;
}

export const CarHeader: React.FC<CarHeaderProps> = ({ carTitle }) => (
  <div className="flex flex-row justify-between items-center mt-0 mb-0 sm:mt-0 sm:mb-0 gap-2">
    <h1 className="text-xl sm:text-4xl font-bold text-black truncate flex-1">
      {carTitle}
    </h1>
  </div>
);
