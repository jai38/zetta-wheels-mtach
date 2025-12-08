import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Car } from '@/lib/api';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const navigate = useNavigate();

  // Build car title from variant and model data
  const carTitle = car.variant?.model?.make
    ? `${car.variant.model.make.name} ${car.variant.model.name} ${car.variant.name}`
    : 'Car';

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
          src={car.carImage || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={carTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 font-serif text-xl text-card-foreground group-hover:text-primary transition-smooth">
          {carTitle}
        </h3>
        
        <div className="flex items-baseline justify-between">
          <div>
            {car.color && (
              <p className="text-sm text-muted-foreground mb-1">{car.color.name}</p>
            )}
            {car.variant?.defaultAlloySize && (
              <p className="text-sm text-muted-foreground">{car.variant.defaultAlloySize}" wheels</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
