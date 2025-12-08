
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeroGalleryProps {
  images: string[];
}

export const HeroGallery = ({ images }: HeroGalleryProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <Dialog>
      <Carousel>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <DialogTrigger asChild>
                <div className="aspect-video rounded-lg overflow-hidden cursor-pointer">
                  <img src={image} alt={`Car image ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              </DialogTrigger>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <DialogContent className="max-w-4xl">
        <img src={images[0]} alt="Car image" className="w-full h-full object-contain" />
      </DialogContent>
    </Dialog>
  );
};
