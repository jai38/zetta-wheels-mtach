import { type Alloy, type AlloyFinish } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlloyFinishSelectorProps {
  finishes: AlloyFinish[];
  selectedFinish: number | null;
  onSelectFinish: (finishId: number) => void;
  allAlloys: Alloy[]; // Keep this to find the image for the finish
}

export const AlloyFinishSelector = ({
  finishes,
  selectedFinish,
  onSelectFinish,
  allAlloys,
}: AlloyFinishSelectorProps) => {
  const { selectedAlloyDesign } = useCarStore(); // Still need this to find the correct alloy image

  if (!selectedAlloyDesign) {
    return <div>Please select a design first.</div>;
  }

  if (finishes.length === 0) {
    return <div>No finishes available for this selection.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {finishes.map((finish) => {
        // Find an alloy that has this specific design and finish to get an image
        const alloyForFinish = allAlloys.find(
          (alloy) =>
            alloy.designId === selectedAlloyDesign &&
            alloy.finishId === finish.id,
        );
        const imageUrl = alloyForFinish?.image_url;

        return (
          <Card
            key={finish.id}
            className={cn(
              "cursor-pointer transition-transform transform hover:scale-105",
              selectedFinish === finish.id &&
                "border-primary ring-2 ring-primary",
            )}
            onClick={() => onSelectFinish(finish.id)}>
            <CardContent className="p-2 flex flex-col items-center gap-1">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={finish.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full"
                  style={{ backgroundColor: finish.colorCode }}></div>
              )}
              <p className="text-xs font-medium text-center line-clamp-1">{finish.name}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AlloyFinishSelector;
