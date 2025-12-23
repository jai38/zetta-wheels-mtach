import { useMemo, useEffect } from "react";
import { type Alloy, type AlloyDesign } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlloyDesignSelectorProps {
  carId: number;
  allAlloys: Alloy[];
}

export const AlloyDesignSelector = ({
  allAlloys,
}: AlloyDesignSelectorProps) => {
  const { selectedAlloyDesign, setSelectedAlloyDesign } = useCarStore();

  const designs = useMemo(() => {
    const designMap = new Map<number, AlloyDesign>();
    allAlloys.forEach((alloy) => {
      if (alloy.design) {
        designMap.set(alloy.designId, alloy.design);
      }
    });
    return Array.from(designMap.values());
  }, [allAlloys]);

  useEffect(() => {
    if (!selectedAlloyDesign && designs.length > 0) {
      setSelectedAlloyDesign(designs[0].id);
    }
  }, [selectedAlloyDesign, designs, setSelectedAlloyDesign]);

  if (!designs || designs.length === 0) {
    return <div>No designs available</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {(designs || []).map((design) => {
        const alloyForDesign = allAlloys.find(
          (alloy) => alloy.designId === design.id,
        );
        const imageUrl = alloyForDesign?.image_url || design.previewImageUrl;

        return (
          <Card
            key={design.id}
            className={cn(
              "cursor-pointer transition-transform transform hover:scale-105",
              selectedAlloyDesign === design.id &&
                "border-primary ring-2 ring-primary",
            )}
            onClick={() => setSelectedAlloyDesign(design.id)}>
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
