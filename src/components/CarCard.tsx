import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Car } from '@/lib/mockData';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/cars/${car.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-soft transition-smooth hover:shadow-elevated"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={car.thumbnailPath}
          alt={car.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 font-serif text-xl text-card-foreground group-hover:text-primary transition-smooth">
          {car.title}
        </h3>
        
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-primary">
            ${car.price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">{car.specs.power}</p>
        </div>
      </div>
    </motion.div>
  );
};
