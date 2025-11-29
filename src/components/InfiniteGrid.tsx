import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CarCard } from './CarCard';
import type { Car } from '@/lib/mockData';

interface InfiniteGridProps {
  cars: Car[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export const InfiniteGrid = ({ cars, hasMore, onLoadMore, isLoading }: InfiniteGridProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, onLoadMore, isLoading]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-card shadow-soft"
            >
              <div className="aspect-[4/3] bg-muted" />
              <div className="space-y-3 p-6">
                <div className="h-6 w-3/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {!hasMore && cars.length > 0 && (
        <p className="text-center text-muted-foreground">No more vehicles to load</p>
      )}
    </div>
  );
};
