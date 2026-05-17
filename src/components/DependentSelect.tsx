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
        <Listbox.Button className="relative w-full cursor-pointer bg-[#f5f5f7] py-4 pl-5 pr-10 text-left rounded-2xl transition-all duration-300 hover:bg-[#e8e8ed] focus:ring-4 focus:ring-black/5 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
          <span className={`block truncate text-[17px] font-medium ${selected ? 'text-[#1d1d1f]' : 'text-[#86868b]'}`}>
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto bg-white/80 backdrop-blur-xl border border-white/20 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:outline-none rounded-2xl">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-4 pr-4 transition-colors ${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  }`
                }
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-bold text-gray-900' : 'font-normal'}`}>
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