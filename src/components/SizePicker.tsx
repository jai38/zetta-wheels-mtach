import { type AlloySize } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface SizePickerProps {
  sizes: AlloySize[];
  selectedDiameter: number | null;
  onSelectSize: (sizeId: number) => void;
  minDiameter?: number;
}

export const SizePicker = ({
  sizes,
  selectedDiameter,
  onSelectSize,
  minDiameter = 0,
}: SizePickerProps) => {
  const visibleSizes = sizes.filter((size) => size.diameter >= minDiameter);

  if (!visibleSizes || visibleSizes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-base font-semibold text-muted-foreground mr-1">
        Size:
      </p>
      {visibleSizes.map((size) => (
        <Button
          key={size.id}
          variant={selectedDiameter === size.diameter ? "default" : "outline"}
          onClick={() => onSelectSize(size.id)}
          className={`h-11 min-w-[4rem] rounded-full text-lg font-medium transition-all duration-300 ${
            selectedDiameter === size.diameter
              ? "bg-[#1d1d1f] text-white shadow-[0_8px_20px_rgb(0,0,0,0.2)] hover:bg-[#333336]"
              : "bg-[#f5f5f7] text-[#1d1d1f] border border-transparent hover:bg-[#e8e8ed]"
          }`}>
          {size.diameter}"
        </Button>
      ))}
    </div>
  );
};

export default SizePicker;

