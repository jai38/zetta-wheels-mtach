import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useCarStore } from '@/stores/useCarStore';
import { Button } from './ui/button';

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const colorOptions = [
  { id: 'black', name: 'Black' },
  { id: 'white', name: 'White' },
  { id: 'silver', name: 'Silver' },
  { id: 'blue', name: 'Blue' },
  { id: 'red', name: 'Red' },
  { id: 'gray', name: 'Gray' },
];

const sizeOptions = [
  { id: '19"', name: '19"' },
  { id: '20"', name: '20"' },
  { id: '21"', name: '21"' },
];

const finishOptions = [
  { id: 'gloss', name: 'Gloss' },
  { id: 'matte', name: 'Matte' },
  { id: 'polished', name: 'Polished' },
  { id: 'carbon', name: 'Carbon Fiber' },
];

export const Filters = ({ isOpen, onClose, isMobile = false }: FiltersProps) => {
  const {
    selectedColor,
    selectedAlloySize,
    selectedFinish,
    setSelectedColor,
    setSelectedAlloySize,
    setSelectedFinish,
    resetFilters,
  } = useCarStore();

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-serif text-2xl">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary transition-smooth"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Color</h3>
        <div className="space-y-2">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(selectedColor === color.id ? null : color.id)}
              className={`w-full rounded-xl px-4 py-2 text-left transition-smooth ${
                selectedColor === color.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Alloy Size Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Alloy Size</h3>
        <div className="space-y-2">
          {sizeOptions.map((size) => (
            <button
              key={size.id}
              onClick={() =>
                setSelectedAlloySize(selectedAlloySize === size.id ? null : size.id)
              }
              className={`w-full rounded-xl px-4 py-2 text-left transition-smooth ${
                selectedAlloySize === size.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Finish Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Finish</h3>
        <div className="space-y-2">
          {finishOptions.map((finish) => (
            <button
              key={finish.id}
              onClick={() =>
                setSelectedFinish(selectedFinish === finish.id ? null : finish.id)
              }
              className={`w-full rounded-xl px-4 py-2 text-left transition-smooth ${
                selectedFinish === finish.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {finish.name}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {
          resetFilters();
          if (isMobile) onClose();
        }}
        variant="outline"
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );

  if (!isMobile) {
    return <div className="rounded-2xl bg-card p-6 shadow-soft">{content}</div>;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-3xl bg-card p-6 shadow-premium transition-all">
                {content}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
