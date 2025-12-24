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
          className={`h-10 min-w-[3.5rem] text-lg font-bold transition-all ${
            selectedDiameter === size.diameter
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}>
          {size.diameter}"
        </Button>
      ))}
    </div>
  );
};

export default SizePicker;

