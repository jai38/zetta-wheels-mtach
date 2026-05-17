import React from "react";
import { type Alloy, type AlloyDesign } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlloyDesignSelectorProps {
  carId: number;
  allAlloys: Alloy[];
  designs: AlloyDesign[];
  onSelectDesign: (designId: number) => void;
}

export const AlloyDesignSelector = ({
  allAlloys,
  designs,
  onSelectDesign,
}: AlloyDesignSelectorProps) => {
  const { selectedAlloyDesign } = useCarStore();

  if (!designs || designs.length === 0) {
    return <div>No designs available for the selected size.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {designs.map((design) => {
        const alloyForDesign =
          allAlloys.find(
            (alloy) => alloy.designId === design.id && alloy.image_url,
          ) || allAlloys.find((alloy) => alloy.designId === design.id);
        const imageUrl = alloyForDesign?.image_url || design.previewImageUrl;

        return (
          <Card
            key={design.id}
            className={cn(
              "cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-2xl border-2 border-transparent",
              selectedAlloyDesign === design.id &&
                "border-[#1d1d1f] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02]",
            )}
            onClick={() => onSelectDesign(design.id)}>
            <CardContent className="p-2 flex flex-col items-center gap-1">
              <img
                src={imageUrl}
                alt={design.name}
                className="w-16 h-16 object-contain"
              />
              <p className="text-xs font-medium text-center line-clamp-1">{design.name}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AlloyDesignSelector;
