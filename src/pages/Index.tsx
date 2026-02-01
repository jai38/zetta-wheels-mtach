import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DependentSelect } from "@/components/DependentSelect";
import { useCarStore } from "@/stores/useCarStore";
import { carService, type Make, type CarModel } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import carBg from "@/assets/home-page-car.png";
import mobileCarBg from "@/assets/mobile-neowheelmatch.png";
import logo from "@/assets/zetta-logo-black.png";

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
      // Get all active cars for this model to find the correct default one
      // We fetch more items (limit: 100) and filter client-side to ensure reliability
      // as sometimes the backend filter might return the first added car despite parameters.
      const result = await carService.getCars({
        makeId: selectedMake || undefined,
        modelId: modelId,
        limit: 100,
        isActive: true,
      });

      if (result.cars.length > 0) {
        // Find the default car
        const defaultCar = result.cars.find((c) => c.isDefault) || result.cars[0];
        navigate(`/cars/${defaultCar.id}`);
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
    <div className="relative min-h-screen lg:h-screen w-full bg-white overflow-x-hidden lg:overflow-hidden flex flex-col items-center">
      {/* Main Content Container */}
      <div className="flex-grow flex flex-col items-center w-full z-40 pt-8 sm:pt-12 pb-12 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl px-6 flex flex-col items-center text-center">
          
          {/* Logo */}
          <img 
            src={logo} 
            alt="Zetta Wheels" 
            className="h-20 sm:h-28 mb-6 object-contain"
          />

          <h1 className="text-4xl sm:text-6xl font-bold text-black mb-2 tracking-tight uppercase">
            Wheel Match
          </h1>
          <p className="text-black/60 text-lg sm:text-xl font-light mb-8">
            Find the Perfect Alloy Wheels for Your Car
          </p>

          {error && (
            <div className="mb-4 p-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded text-sm">
              {error}
            </div>
          )}

          <div className="w-full max-w-2xl flex flex-col gap-6 relative z-50">
            <div className="flex flex-col md:flex-row gap-4 w-full">
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

      {/* Car Image - Flows naturally on mobile, absolute on desktop to prevent overlap */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        className="relative lg:absolute lg:bottom-0 right-0 z-10 pointer-events-none flex justify-end items-end w-full mt-auto lg:mt-0">
        <div className="relative w-full flex justify-end items-end">
          <picture className="w-full">
            <source media="(max-width: 640px)" srcSet={mobileCarBg} />
            <img
              src={carBg}
              alt="Sports Car"
              className="w-full h-auto max-h-[50vh] landscape:max-h-none landscape:h-[100vh] lg:w-[80vw] lg:h-[70vh] object-contain object-right-bottom block ml-auto"
            />
          </picture>
          {/* Gradients for smoother integration - only visible when absolute on desktop or as overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-full lg:w-1/2 h-full"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
};
export default Index;
