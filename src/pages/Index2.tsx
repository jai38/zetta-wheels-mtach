import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DependentSelect } from "@/components/DependentSelect";
import { useCarStore } from "@/stores/useCarStore";
import { carService, type Make, type CarModel } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/zetta-logo-black.png";
import { FeaturedSlider } from "@/components/FeaturedSlider";

const Index2 = () => {
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
      const result = await carService.getCars({
        makeId: selectedMake || undefined,
        modelId: modelId,
        limit: 100,
        isActive: true,
      });

      if (result.cars.length > 0) {
        const defaultCar =
          result.cars.find((c) => c.isDefault) || result.cars[0];
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
    <div className="min-h-screen w-full bg-[#fbfbfd] flex flex-col pt-8 sm:pt-12 pb-20">
      
      {/* Top Section: Logo & Titles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mb-10"
      >
        <img 
          src={logo} 
          alt="Zetta Alloys" 
          className="h-20 sm:h-28 mb-6 object-contain"
        />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1d1d1f] mb-2 tracking-tight uppercase">
          Wheel Match
        </h1>
        <p className="text-[#86868b] text-lg sm:text-xl font-light">
          Visualize Premium Zetta Alloys on Your Car.
        </p>
      </motion.div>

      {/* Middle Section: Selectors */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 border border-red-100 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex-1">
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
              placeholder="Select Make"
            />
          </div>
          <div className="flex-1">
            <DependentSelect
              options={models.map((m) => ({
                id: m.id.toString(),
                name: m.name,
              }))}
              value={selectedModel?.toString() || ""}
              onChange={(val) =>
                handleModelChange(val ? parseInt(val) : null)
              }
              placeholder="Select Model"
              disabled={!selectedMake}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Section: Featured Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <FeaturedSlider />
      </motion.div>
      
    </div>
  );
};

export default Index2;
