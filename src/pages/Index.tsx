import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DependentSelect } from "@/components/DependentSelect";
import { useCarStore } from "@/stores/useCarStore";
import { carService, type Make, type CarModel } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/zetta-logo-black.png";

// Zetta Alloys product images from zettaalloys.com
const heroImages = [
  {
    src: "https://zettaalloys.com/images/Upload/product/CA---911-11_73564.jpg",
    name: "CA-911",
    finish: "Black Machined",
  },
  {
    src: "https://zettaalloys.com/images/Upload/product/K-9-1_79035.webp",
    name: "K-9",
    finish: "Chrome Black Machined",
  },
  {
    src: "https://zettaalloys.com/images/Upload/product/DVL-CBM-1_26165.jpg",
    name: "DVL-666",
    finish: "Chrome Black Machined",
  },
  {
    src: "https://zettaalloys.com/images/Upload/product/CA---911-12_21539.jpg",
    name: "CA-911",
    finish: "Hyper Silver",
  },
  {
    src: "https://zettaalloys.com/images/Upload/product/k_9_b1_88262.webp",
    name: "K-9",
    finish: "Black",
  },
];

const SLIDE_INTERVAL = 4000; // 4 seconds per slide

const Index = () => {
  const { selectedMake, selectedModel, setSelectedMake, setSelectedModel } =
    useCarStore();

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

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

  const goToSlide = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#fbfbfd] overflow-x-hidden flex flex-col">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen max-w-[1400px] mx-auto w-full">
        
        {/* Left side - Content */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-6 sm:px-12 lg:px-20 pt-20 sm:pt-24 lg:pt-0 pb-8 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Logo */}
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src={logo} 
              alt="Zetta Alloys" 
              className="h-30 sm:h-40 object-contain"
            />

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-semibold text-[#1d1d1f] mb-4 tracking-tight leading-[1.05]">
              Wheel Match.
            </h1>
            <p className="text-[#86868b] text-xl sm:text-2xl font-normal mb-12 max-w-md tracking-normal">
              Visualize premium alloy wheels on your car.
            </p>

            {error && (
              <div className="mb-6 p-3 text-red-600 bg-red-50 border border-red-100 rounded text-sm w-full">
                {error}
              </div>
            )}

            <div className="w-full flex flex-col gap-4 relative z-50">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
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

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-[#86868b] text-xs font-medium mt-8 tracking-widest uppercase">
              Precision Engineered • Premium Quality
            </motion.p>
          </motion.div>
        </div>

        {/* Right side - Auto-scrolling Product Image Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="flex-1 flex flex-col items-center justify-center relative lg:pr-12 pb-12 lg:pb-0">
          
          {/* Subtle circular glow behind wheel */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[60%] h-[60%] rounded-full bg-gradient-to-br from-gray-100 to-gray-50 blur-3xl opacity-80" />
          </div>

          {/* Carousel Container */}
          <div className="relative z-10 w-[65%] sm:w-[55%] lg:w-[80%] max-w-[500px] aspect-square flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex].src}
                alt={`${heroImages[currentImageIndex].name} ${heroImages[currentImageIndex].finish}`}
                initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 8 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </AnimatePresence>
          </div>

          {/* Product name label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`label-${currentImageIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 mt-4 text-center">
              <span className="text-sm font-semibold text-black tracking-wide uppercase">
                {heroImages[currentImageIndex].name}
              </span>
              <span className="text-sm text-gray-400 ml-2">
                {heroImages[currentImageIndex].finish}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="relative z-10 flex items-center gap-2 mt-4">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentImageIndex
                    ? "w-2.5 h-2.5 bg-[#1d1d1f]"
                    : "w-2 h-2 bg-[#d2d2d7] hover:bg-[#86868b]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clean bottom space instead of accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-8" />
    </div>
  );
};
export default Index;
