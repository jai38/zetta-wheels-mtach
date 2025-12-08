import { useState, useEffect } from "react";
import { carService, type Car, type CarColorOption } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorPickerProps {
  car: Car;
  onColorChange: (colorId: number) => void;
}

export const ColorPicker = ({ car, onColorChange }: ColorPickerProps) => {
  const [colors, setColors] = useState<CarColorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      if (!car.id) return;
      try {
        setLoading(true);
        const colorsData = await carService.getColorsForCar(car.id);
        setColors(colorsData);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [car.id]);

  const handleValueChange = (value: string) => {
    onColorChange(parseInt(value));
  };

  if (loading) {
    return <div>Loading colors...</div>;
  }
  if (!colors || colors.length === 0) {
    return <div>No colors available</div>;
  }

  return (
    <Select onValueChange={handleValueChange} value={car.color?.id.toString()}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map((option) => (
          <SelectItem key={option.color.id} value={option.color.id.toString()}>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: option.color.colorCode }}
              />
              {option.color.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
