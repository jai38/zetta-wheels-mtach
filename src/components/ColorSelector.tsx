import React from "react";
import { cn } from "@/lib/utils";
import type { CarColorOption } from "@/lib/api";

interface ColorSelectorProps {
  colors: CarColorOption[];
  currentColorId: number;
  onSelectColor: (colorId: number) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  currentColorId,
  onSelectColor,
}) => {
  if (!colors || colors.length === 0) return null;

  const currentOption = colors.find((c) => c.color.id === currentColorId);
  const currentColorName = currentOption?.color.name || "";

  return (
    <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
      {/* Selected Color Name Label */}
      <span className="text-sm tracking-wide text-gray-500">
        Paint: <span className="text-[#1d1d1f] font-semibold">{currentColorName}</span>
      </span>

      {/* Circular Swatches Container */}
      <div className="flex items-center gap-3">
        {colors.map((option) => {
          const isActive = option.color.id === currentColorId;
          return (
            <button
              key={option.color.id}
              onClick={() => onSelectColor(option.color.id)}
              className="relative flex items-center justify-center rounded-full transition-all focus:outline-none"
              style={{ width: "36px", height: "36px" }}
              aria-label={`Select ${option.color.name}`}
            >
              {/* Outer Ring showing active/hover state */}
              <span
                className={cn(
                  "absolute inset-0 rounded-full border-2 transition-all duration-300 ease-out",
                  isActive
                    ? "border-black scale-100 opacity-100"
                    : "border-transparent scale-75 opacity-0 hover:border-gray-300 hover:scale-100 hover:opacity-100"
                )}
              />
              {/* Inner Color Swatch */}
              <span
                className="h-[26px] w-[26px] rounded-full border border-black/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: option.color.colorCode }}
                title={option.color.name}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
