import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

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
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-secondary py-3 pl-4 pr-10 text-left transition-smooth hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50">
          <span className="block truncate text-foreground">
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-popover py-2 shadow-elevated focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-smooth ${
                    active ? 'bg-accent/10 text-accent-foreground' : 'text-popover-foreground'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
