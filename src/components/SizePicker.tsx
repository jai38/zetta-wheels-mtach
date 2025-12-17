import { useMemo } from "react";
import { type Alloy, type AlloySize } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SizePickerProps {
  allAlloys: Alloy[];
}

export const SizePicker = ({ allAlloys }: SizePickerProps) => {
  const {
    selectedAlloySize,
    setSelectedAlloySize,
    selectedAlloyDesign,
  } = useCarStore();

  const sizes = useMemo(() => {
    const sizeMap = new Map<number, AlloySize>();
    allAlloys
      .filter(
        (alloy) =>
          !selectedAlloyDesign || alloy.designId === selectedAlloyDesign,
      )
      .forEach((alloy) => {
        if (alloy.size) {
          sizeMap.set(alloy.sizeId, alloy.size);
        }
      });
    return Array.from(sizeMap.values()).sort((a, b) => a.diameter - b.diameter);
  }, [allAlloys, selectedAlloyDesign]);

  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">Size:</p>
      {sizes.map((size) => (
        <Button
          key={size.id}
          variant={selectedAlloySize === size.id ? "default" : "outline"}
          onClick={() => setSelectedAlloySize(size.id)}
          className="p-2"
        >
          {size.diameter}"
        </Button>
      ))}
    </div>
  );
};

export default SizePicker;
