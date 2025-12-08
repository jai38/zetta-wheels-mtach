// src/components/ImageViewerModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageViewerModalProps {
  imageUrl: string | null;
  open: boolean;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  imageUrl,
  open,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/90" />
        <DialogContent
          className={cn(
            "fixed inset-0 z-50 w-screen h-screen max-w-none max-h-none p-0 overflow-hidden bg-transparent border-none rounded-none", // Full screen, no padding, no border
            "flex items-center justify-center", // Center the image
            // Explicitly override any conflicting positioning from default DialogContent
            "left-0 top-0 translate-x-0 translate-y-0", // Ensure it truly takes inset-0
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" // Radix animations
          )}
        >
          <img
            src={imageUrl}
            alt="Car Image"
            className="max-w-full max-h-full object-contain"
            style={{ touchAction: 'pan-x pan-y' }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
