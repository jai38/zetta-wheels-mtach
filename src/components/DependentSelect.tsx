import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface DependentSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  disabled?: boolean;
}

export const DependentSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: DependentSelectProps) => {
  const selected = options.find((opt) => opt.id === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative w-full">
        <Listbox.Button className="relative w-full cursor-pointer bg-black/50 border border-white/20 py-4 pl-4 pr-10 text-left transition-colors hover:border-white/40 focus:border-white/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-w-[280px]">
          <span className={`block truncate text-base font-medium ${selected ? 'text-white' : 'text-white/70'}`}>
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDown className="h-4 w-4 text-white/70" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto bg-black border border-white/20 py-1 shadow-lg focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-4 pr-4 transition-colors ${
                    active ? 'bg-white/10 text-white' : 'text-white/80'
                  }`
                }
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-bold text-white' : 'font-normal'}`}>
                    {option.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};