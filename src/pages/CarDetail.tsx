import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCarById, getAlloysByCar, type Alloy } from '@/lib/mockData';
import { useCarStore } from '@/stores/useCarStore';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedAlloy, selectedCarColor, setSelectedAlloy, setSelectedCarColor } =
    useCarStore();

  const [car, setCar] = useState<ReturnType<typeof getCarById>>();
  const [alloys, setAlloys] = useState<Alloy[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCar = getCarById(id);
      setCar(foundCar);
      if (foundCar) {
        const carAlloys = getAlloysByCar(id);
        setAlloys(carAlloys);
        // Set defaults
        if (!selectedCarColor && foundCar.colors.length > 0) {
          setSelectedCarColor(foundCar.colors[0].id);
        }
        if (!selectedAlloy && carAlloys.length > 0) {
          setSelectedAlloy(carAlloys[0].id);
        }
      }
    }
  }, [id]);

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Car not found</p>
      </div>
    );
  }

  const currentColor = car.colors.find((c) => c.id === selectedCarColor) || car.colors[0];
  const currentAlloy = alloys.find((a) => a.id === selectedAlloy);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Catalog
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Image Viewer */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-3xl bg-card shadow-premium"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedCarColor}-${selectedAlloy}`}
                    src={car.baseImagePath}
                    alt={car.title}
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onLoad={() => setImageLoaded(true)}
                  />
                </AnimatePresence>
                
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Color Selector */}
              <div className="border-t border-border p-6">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-border"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  {currentColor.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {car.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setImageLoaded(false);
                        setSelectedCarColor(color.id);
                      }}
                      className={`group relative h-12 w-12 rounded-full border-2 transition-smooth ${
                        selectedCarColor === color.id
                          ? 'border-primary scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="h-full w-full rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Alloy Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-card p-6 shadow-soft"
            >
              <h3 className="mb-4 font-serif text-xl">Select Alloy Wheels</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {alloys.map((alloy) => (
                  <button
                    key={alloy.id}
                    onClick={() => {
                      setImageLoaded(false);
                      setSelectedAlloy(alloy.id);
                    }}
                    className={`group shrink-0 overflow-hidden rounded-2xl border-2 transition-smooth ${
                      selectedAlloy === alloy.id
                        ? 'border-primary scale-105'
                        : 'border-border hover:border-primary/50 hover:scale-105'
                    }`}
                  >
                    <div className="aspect-square w-24 bg-muted p-2">
                      <img
                        src={alloy.imagePath}
                        alt={alloy.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="bg-secondary/50 p-2 text-left">
                      <p className="text-xs font-medium">{alloy.size}</p>
                      <p className="text-xs text-muted-foreground">{alloy.finish}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="mb-2 font-serif text-4xl font-bold">{car.title}</h1>
              <p className="text-3xl font-semibold text-primary">
                ${car.price.toLocaleString()}
              </p>
            </div>

            {/* Specs */}
            <div className="rounded-2xl bg-card p-6 shadow-soft">
              <h3 className="mb-4 font-serif text-xl">Specifications</h3>
              <dl className="space-y-3">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Engine</dt>
                  <dd className="font-medium">{car.specs.engine}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Power</dt>
                  <dd className="font-medium">{car.specs.power}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Transmission</dt>
                  <dd className="font-medium">{car.specs.transmission}</dd>
                </div>
              </dl>
            </div>

            {/* Current Configuration */}
            {currentAlloy && (
              <div className="rounded-2xl bg-secondary p-6">
                <h3 className="mb-4 font-serif text-xl">Current Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wheels:</span>
                    <span className="font-medium">{currentAlloy.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional:</span>
                    <span className="font-medium text-primary">
                      +${currentAlloy.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between border-t border-border pt-4 text-base">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-primary">
                      ${(car.price + currentAlloy.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              <Button className="w-full py-6 text-lg">Request Test Drive</Button>
              <Button variant="outline" className="w-full py-6 text-lg">
                Download Brochure
              </Button>
            </div>

            {/* Info Box */}
            <div className="flex gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
              <Info className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                Prices shown are manufacturer's suggested retail price. Contact your local dealer
                for final pricing and availability.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
