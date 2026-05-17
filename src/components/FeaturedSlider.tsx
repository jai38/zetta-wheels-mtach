import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCarStore } from "@/stores/useCarStore";

import img1 from "@/assets/featured/seltos.png";
import img2 from "@/assets/featured/creta.png";
import img3 from "@/assets/featured/swift.png";
import img4 from "@/assets/featured/baleno.png";
import img5 from "@/assets/featured/verna.png";

const featuredItems = [
  {
    id: 1,
    image: img1,
    carName: "Kia Seltos",
    alloyName: "CA-911 Hyper Black",
    carId: 424,
    designId: 1,
    finishId: 4,
  },
  {
    id: 2,
    image: img2,
    carName: "Hyundai Creta",
    alloyName: "K-9 Black Machined",
    carId: 421,
    designId: 7,
    finishId: 7,
  },
  {
    id: 3,
    image: img3,
    carName: "Maruti Suzuki Swift",
    alloyName: "NH-1 Silver Machined",
    carId: 320,
    designId: 8,
    finishId: 8,
  },
  {
    id: 4,
    image: img4,
    carName: "Maruti Suzuki Baleno",
    alloyName: "SOS-100 Glossy Bronze",
    carId: 428,
    designId: 9,
    finishId: 9,
  },
  {
    id: 5,
    image: img5,
    carName: "Hyundai Verna",
    alloyName: "SXY-69 Satin Black Undercut Red",
    carId: 359,
    designId: 10,
    finishId: 10,
  },
];

// Duplicate items to create a seamless infinite scroll loop
const doubleItems = [...featuredItems, ...featuredItems];

export const FeaturedSlider = () => {
  const navigate = useNavigate();
  const { setSelectedAlloyDesign, setSelectedAlloyFinish } = useCarStore();

  const handleSlideClick = (item: typeof featuredItems[0]) => {
    setSelectedAlloyDesign(item.designId);
    setSelectedAlloyFinish(item.finishId);
    navigate(`/cars/${item.carId}`);
  };

  return (
    <div className="w-full max-w-[100vw] overflow-hidden py-12 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight text-center">
          Zetta on Cars
        </h2>
        <p className="text-[#86868b] mt-2 text-center max-w-2xl mx-auto">
          A few highlight images of Zetta Alloys on cars. <br />See how they transform the vehicle's appearance.
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        {/* Fading edges for a premium cinematic look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#fbfbfd] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#fbfbfd] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 sm:gap-6 min-w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
        >
          {doubleItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[300px] sm:w-[360px] md:w-[420px] lg:w-[480px] flex-shrink-0 flex flex-col gap-5 cursor-pointer group"
              onClick={() => handleSlideClick(item)}
            >
              <div className="relative overflow-hidden rounded-[32px] aspect-square bg-[#f5f5f7] flex items-center justify-center transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                <img
                  src={item.image}
                  alt={item.carName}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-2 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
                  {item.carName}
                </h3>
                <p className="text-[#86868b] text-sm sm:text-base font-medium mt-1">
                  {item.alloyName}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

