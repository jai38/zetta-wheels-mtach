import { useState, useEffect } from "react";
import { carService, type Color, type CarColorOption } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorPickerProps {
  carId: number;
}

export const ColorPicker = ({ carId }: ColorPickerProps) => {
  const { selectedCarColor, setSelectedCarColor, setCurrentCarId } = useCarStore();
  const [colors, setColors] = useState<CarColorOption[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {

      const fetchColors = async () => {

        if (!carId) return;

        try {

          const colorsData = await carService.getColorsForCar(carId);

          setColors(colorsData);

          if (!selectedCarColor && colorsData?.length > 0) {

            const initialColorOption = colorsData[0];

            setSelectedCarColor(initialColorOption.color.id);

            if (initialColorOption.carIds.length > 0) {

              setCurrentCarId(initialColorOption.carIds[0]);

            }

          }

        } catch (error) {

          console.error("Failed to fetch colors:", error);

        } finally {

          setLoading(false);

        }

      };

  

      fetchColors();

    }, [carId, selectedCarColor, setSelectedCarColor, setCurrentCarId]);

  const handleValueChange = (value: string) => {
    const selectedColorId = parseInt(value);
    setSelectedCarColor(selectedColorId);

    const selectedOption = colors.find(
      (option) => option.color.id === selectedColorId,
    );

    if (selectedOption && selectedOption.carIds.length > 0) {
      setCurrentCarId(selectedOption.carIds[0]);
    } else {
      // Handle case where no carId is found for the selected color
      setCurrentCarId(null);
    }
  };

  if (loading) {
    return <div>Loading colors...</div>;
  }
  if (!colors || colors.length === 0) {
    return <div>No colors available</div>;
  }

  return (
    <Select
      onValueChange={handleValueChange}
      value={selectedCarColor?.toString()}>
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
