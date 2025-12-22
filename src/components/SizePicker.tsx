import { type AlloySize } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface SizePickerProps {
  sizes: AlloySize[];
  selectedSize: number | null;
  onSelectSize: (sizeId: number) => void;
}

export const SizePicker = ({
  sizes,
  selectedSize,
  onSelectSize,
}: SizePickerProps) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-base font-semibold text-muted-foreground mr-1">Size:</p>
      {sizes.map((size) => (
        <Button
          key={size.id}
          variant={selectedSize === size.id ? "default" : "outline"}
          onClick={() => onSelectSize(size.id)}
          className={`h-10 min-w-[3.5rem] text-lg font-bold transition-all ${
            selectedSize === size.id 
              ? "bg-primary text-primary-foreground shadow-md scale-105" 
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {size.diameter}"
        </Button>
      ))}
    </div>
  );
};

export default SizePicker;

