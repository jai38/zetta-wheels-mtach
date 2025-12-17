import { useMemo, useEffect } from "react";
import { type Alloy, type AlloyFinish, type AlloySize } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlloyFinishSelectorProps {
  carId: number;
  allAlloys: Alloy[];
}

export const AlloyFinishSelector = ({
  allAlloys,
}: AlloyFinishSelectorProps) => {
  const {
    selectedAlloyDesign,
    selectedAlloyFinish,
    setSelectedAlloyFinish,
    selectedAlloySize,
    setSelectedAlloySize,
  } = useCarStore();

  const finishes = useMemo(() => {
    if (!selectedAlloyDesign) return [];
    const finishMap = new Map<number, AlloyFinish>();
    allAlloys
      .filter((alloy) => alloy.designId === selectedAlloyDesign)
      .forEach((alloy) => {
        if (alloy.finish) {
          finishMap.set(alloy.finishId, alloy.finish);
        }
      });
    return Array.from(finishMap.values());
  }, [allAlloys, selectedAlloyDesign]);

  const sizes = useMemo(() => {
    if (!selectedAlloyDesign) return [];
    const sizeMap = new Map<number, AlloySize>();
    allAlloys
      .filter((alloy) => alloy.designId === selectedAlloyDesign)
      .forEach((alloy) => {
        if (alloy.size) {
          sizeMap.set(alloy.sizeId, alloy.size);
        }
      });
    return Array.from(sizeMap.values()).sort((a, b) => a.diameter - b.diameter);
  }, [allAlloys, selectedAlloyDesign]);

  useEffect(() => {
    const isValidFinishSelected = finishes.some(
      (f) => f.id === selectedAlloyFinish,
    );
    if (
      (!selectedAlloyFinish || !isValidFinishSelected) &&
      finishes.length > 0
    ) {
      setSelectedAlloyFinish(finishes[0].id);
    }
  }, [selectedAlloyFinish, finishes, setSelectedAlloyFinish]);

  useEffect(() => {
    const isValidSizeSelected = sizes.some((s) => s.id === selectedAlloySize);
    if ((!selectedAlloySize || !isValidSizeSelected) && sizes.length > 0) {
      setSelectedAlloySize(sizes[0].id);
    }
  }, [selectedAlloySize, sizes, setSelectedAlloySize]);

  if (!selectedAlloyDesign) {
    return <div>Please select a design first.</div>;
  }

  if (finishes.length === 0) {
    return <div>No finishes available for this design.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {(finishes || []).map((finish) => {
        const alloyForFinish = allAlloys.find(
          (alloy) =>
            alloy.designId === selectedAlloyDesign &&
            alloy.finishId === finish.id,
        );
        const imageUrl = alloyForFinish?.alloyImages?.[0];

        return (
          <Card
            key={finish.id}
            className={cn(
              "cursor-pointer transition-transform transform hover:scale-105",
              selectedAlloyFinish === finish.id &&
                "border-primary ring-2 ring-primary",
            )}
            onClick={() => setSelectedAlloyFinish(finish.id)}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={finish.name}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full"
                  style={{ backgroundColor: finish.colorCode }}></div>
              )}
              <p className="text-sm font-medium">{finish.name}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AlloyFinishSelector;
