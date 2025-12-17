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
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">Size:</p>
      {sizes.map((size) => (
        <Button
          key={size.id}
          variant={selectedSize === size.id ? "default" : "outline"}
          onClick={() => onSelectSize(size.id)}
          className="p-2"
        >
          {size.diameter}"
        </Button>
      ))}
    </div>
  );
};

export default SizePicker;

