import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { carService, alloyService, type Car, type Alloy, type CarColorOption } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { useToast } from "@/hooks/use-toast";

export const useCarData = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentCarId, resetSelections } = useCarStore();
  const [car, setCar] = useState<Car | null>(null);
  const [allAlloys, setAllAlloys] = useState<Alloy[]>([]);
  const [colors, setColors] = useState<CarColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevModelIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        setError("No car ID provided.");
        return;
      }

      try {
        const carId = parseInt(id, 10);
        if (isNaN(carId)) {
          throw new Error("Invalid car ID format.");
        }

        // Only show full loading spinner if we don't have a car loaded yet
        if (prevModelIdRef.current === null) {
          setLoading(true);
        }
        setError(null);

        console.log("Fetching details for car ID:", carId);
        const carData = await carService.getCarById(carId);
        console.log("Fetched car data:", carData);

        if (!isMounted) return;

        const isSameModel = prevModelIdRef.current !== null && prevModelIdRef.current === carData.modelId;

        // Fetch colors for this car/model
        const colorsData = await carService.getColorsForCar(carData.id);

        if (!isMounted) return;

        let alloysWithImages = allAlloys;
        if (!isSameModel) {
          const alloysData = await alloyService.getAlloys({
            carId: carData.id,
            isActive: true,
            limit: 1000,
          });

          // Filter alloys that have an image_url
          alloysWithImages = alloysData.alloys.filter(alloy => alloy.image_url && alloy.image_url.trim() !== "");

          console.log("Fetched alloys count:", alloysData.alloys.length, "Filtered (with images):", alloysWithImages.length);

          if (alloysWithImages.length === 0) {
            throw new Error("No alloys available for this car.");
          }
          
          resetSelections();
        }

        // Set state all at once
        prevModelIdRef.current = carData.modelId;
        setCurrentCarId(carData.id);
        setCar(carData);
        setColors(colorsData);
        setAllAlloys(alloysWithImages);

      } catch (err: unknown) {
        if (!isMounted) return;
        console.error("Failed to fetch car details:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load car details.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate, setCurrentCarId, resetSelections, toast]);

  const fetchCarByColor = useCallback(
    async (colorId: number) => {
      if (!car?.modelId) return;

      try {
        const carsData = await carService.getCars({
          modelId: car.modelId,
          colorId: colorId,
          limit: 1,
          isActive: true,
        });

        if (carsData.cars.length > 0) {
          const newCar = carsData.cars[0];
          navigate(`/cars/${newCar.id}`);
        }
      } catch (err) {
        console.error("Failed to fetch car by color:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update car color.",
        });
      }
    },
    [car?.modelId, navigate, toast],
  );

  return { car, allAlloys, colors, loading, error, fetchCarByColor };
};