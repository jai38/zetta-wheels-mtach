import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DependentSelect } from "@/components/DependentSelect";
import { useCarStore } from "@/stores/useCarStore";
import { carService, type Make, type CarModel } from "@/lib/api";
import { useNavigate } from "react-router-dom";

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

    if (modelId) {
      try {
        const result = await carService.getCars({
          makeId: selectedMake || undefined,
          modelId: modelId,
          limit: 1,
          isActive: true,
        });

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
    }
  };
  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border bg-gradient-to-b from-secondary/50 to-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Configure Your Dream Car
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-lg text-muted-foreground sm:text-xl">
            Personalize every detail with our real-time wheel visualizer
          </motion.p>

          {/* Search & Filters Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};
export default Index;
