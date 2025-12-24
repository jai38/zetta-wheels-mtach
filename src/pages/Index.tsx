import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DependentSelect } from "@/components/DependentSelect";
import { useCarStore } from "@/stores/useCarStore";
import { carService, type Make, type CarModel } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import carBg from "@/assets/sport_car.png";

const Index = () => {
  const { selectedMake, selectedModel, setSelectedMake, setSelectedModel } =
    useCarStore();

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load makes on mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const result = await carService.getMakes({
          limit: 100,
          isActive: true,
        });
        setMakes(result.items);
      } catch (err) {
        console.error("Failed to fetch makes:", err);
        setError("Failed to load car makes");
      }
    };
    fetchMakes();
  }, []);

  // Load models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        return;
      }
      try {
        const result = await carService.getModels({
          makeId: selectedMake,
          limit: 100,
          isActive: true,
        });
        setModels(result.items);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };
    fetchModels();
  }, [selectedMake]);

  const handleModelChange = async (modelId: number | null) => {
    setSelectedModel(modelId);

    if (!modelId) return;

    try {
      // First try to get the default car for this model
      let result = await carService.getCars({
        makeId: selectedMake || undefined,
        modelId: modelId,
        limit: 1,
        isActive: true,
        isDefault: true,
      });

      // If no default car found, fall back to any active car
      if (result.cars.length === 0) {
        result = await carService.getCars({
          makeId: selectedMake || undefined,
          modelId: modelId,
          limit: 1,
          isActive: true,
        });
      }

      if (result.cars.length > 0) {
        navigate(`/cars/${result.cars[0].id}`);
      } else {
        console.warn("No car found for the selected model.");
        setError("Could not find a matching car for the selected model.");
      }
    } catch (err) {
      console.error("Failed to fetch car for navigation:", err);
      setError("An error occurred while fetching car details.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center">
      {/* Main Content Container - Flex grow to push car to bottom if necessary, or just absolute */}
      <div className="flex-grow flex flex-col items-center justify-center w-full z-30 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl px-6 flex flex-col items-center text-center sm:-mt-20">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 tracking-tight">
            Wheel Match
          </h1>
          <p className="text-white/60 text-lg sm:text-xl font-light mb-12">
            Find the Perfect Alloy Wheels for Your Car
          </p>

          {error && (
            <div className="mb-6 p-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded text-sm">
              {error}
            </div>
          )}

          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="w-full">
                <DependentSelect
                  options={makes.map((m) => ({
                    id: m.id.toString(),
                    name: m.name,
                  }))}
                  value={selectedMake?.toString() || ""}
                  onChange={(val) => {
                    const makeId = val ? parseInt(val) : null;
                    setSelectedMake(makeId);
                    setSelectedModel(null);
                  }}
                  placeholder="Select Your Car Make"
                />
              </div>

              <div className="w-full">
                <DependentSelect
                  options={models.map((m) => ({
                    id: m.id.toString(),
                    name: m.name,
                  }))}
                  value={selectedModel?.toString() || ""}
                  onChange={(val) =>
                    handleModelChange(val ? parseInt(val) : null)
                  }
                  placeholder="Select Your Car Model"
                  disabled={!selectedMake}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Car Image with Floor - Grounded to Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        className="absolute bottom-0 right-0 z-10 w-full sm:w-[85%] lg:w-[75%] 2xl:w-[65%] pointer-events-none flex justify-end items-end">
        <div className="relative w-full">
          <img
            src={carBg}
            alt="Sports Car"
            className="w-full h-auto object-contain block"
          />
          {/* Subtle gradient to blend the left side of the car/floor image into the black background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent sm:w-1/3 h-full"></div>
        </div>
      </motion.div>
    </div>
  );
};
export default Index;
