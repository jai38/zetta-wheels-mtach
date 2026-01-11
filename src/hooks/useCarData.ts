import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { carService, alloyService, type Car, type Alloy } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { useToast } from "@/hooks/use-toast";

export const useCarData = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentCarId, resetSelections } = useCarStore();
  const [car, setCar] = useState<Car | null>(null);
  const [allAlloys, setAllAlloys] = useState<Alloy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        setError("No car ID provided.");
        return;
      }

      // Reset state and store selections on ID change
      resetSelections();
      setCar(null);
      setAllAlloys([]);
      setLoading(true);
      setError(null);

      try {
        const carId = parseInt(id, 10);
        if (isNaN(carId)) {
          throw new Error("Invalid car ID format.");
        }

        console.log("Fetching details for car ID:", carId);
        const carData = await carService.getCarById(carId);
        console.log("Fetched car data:", carData);

        if (!isMounted) return;

        // Handle Default Car Redirect
        if (!carData.isDefault) {
          const defaultCarsResult = await carService.getCars({
            modelId: carData.modelId,
            isActive: true,
            limit: 100, // Fetch more to ensure we find the true default
          });

          // Find the actual default car client-side
          const defaultCar = defaultCarsResult.cars.find(c => c.isDefault);

          if (
            defaultCar &&
            defaultCar.id !== carData.id
          ) {
            console.log("Redirecting to default car:", defaultCar.id);
            navigate(`/cars/${defaultCar.id}`, { replace: true });
            return; // Stop execution, effect will re-run with new ID
          }
        }

        const alloysData = await alloyService.getAlloys({
          carId: carData.id,
          isActive: true,
          limit: 1000,
        });

        // Filter alloys that have an image_url
        const alloysWithImages = alloysData.alloys.filter(alloy => alloy.image_url && alloy.image_url.trim() !== "");

        console.log("Fetched alloys count:", alloysData.alloys.length, "Filtered (with images):", alloysWithImages.length);

        if (!isMounted) return;

        if (alloysWithImages.length === 0) {
          const msg = "No alloys available for this car.";
          setError(msg);
          toast({
            variant: "destructive",
            title: "No Alloys Found",
            description: "We couldn't find any alloys matching this car.",
          });
          // Even though we found the car, without alloys the page is invalid per requirements
          return;
        }

        // Only set data if everything is valid
        setCurrentCarId(carData.id);
        setCar(carData);
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
          setCar(newCar);
          setCurrentCarId(newCar.id);
          // Note: We intentionally do NOT reset allAlloys here as they are model-specific
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
    [car?.modelId, setCurrentCarId, toast],
  );

  return { car, allAlloys, loading, error, fetchCarByColor };
};