import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { DependentSelect } from '@/components/DependentSelect';
import { SearchInput } from '@/components/SearchInput';
import { InfiniteGrid } from '@/components/InfiniteGrid';
import { Filters } from '@/components/Filters';
import { Button } from '@/components/ui/button';
import { useCarStore } from '@/stores/useCarStore';
import { getMakes, getModelsByMake, getCars } from '@/lib/mockData';

const Index = () => {
  const {
    selectedMake,
    selectedModel,
    searchQuery,
    setSelectedMake,
    setSelectedModel,
    setSearchQuery,
  } = useCarStore();

  const [page, setPage] = useState(1);
  const [allCars, setAllCars] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const makes = getMakes();
  const models = selectedMake ? getModelsByMake(selectedMake) : [];

  // Load cars based on filters
  useEffect(() => {
    setIsLoading(true);
    const result = getCars({
      makeId: selectedMake || undefined,
      modelId: selectedModel || undefined,
      query: searchQuery || undefined,
      page,
    });

    if (page === 1) {
      setAllCars(result.items);
    } else {
      setAllCars((prev) => [...prev, ...result.items]);
    }

    setHasMore(page < result.totalPages);
    setIsLoading(false);
  }, [selectedMake, selectedModel, searchQuery, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedMake, selectedModel, searchQuery]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border bg-gradient-to-b from-secondary/50 to-background px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Configure Your Dream Car
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-lg text-muted-foreground sm:text-xl"
          >
            Personalize every detail with our real-time wheel visualizer
          </motion.p>

          {/* Search & Filters Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DependentSelect
                options={makes}
                value={selectedMake}
                onChange={setSelectedMake}
                placeholder="Select Make"
              />
              <DependentSelect
                options={models}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder="Select Model"
                disabled={!selectedMake}
              />
              <Button
                onClick={() => setFiltersOpen(true)}
                variant="outline"
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by model, specs..."
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden w-80 shrink-0 lg:block">
              <div className="sticky top-8">
                <Filters isOpen={true} onClose={() => {}} isMobile={false} />
              </div>
            </aside>

            {/* Car Grid */}
            <main className="min-w-0 flex-1">
              <InfiniteGrid
                cars={allCars}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
              />
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filters Sheet */}
      <Filters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} isMobile={true} />
    </div>
  );
};

export default Index;
