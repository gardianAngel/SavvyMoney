import * as React from "react";
import { cn } from "@/lib/utils";

function RadioGroup({ className, value, onValueChange, defaultValue, children, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = onValueChange || setInternalValue;

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div className={cn("grid gap-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

const RadioGroupContext = React.createContext({});

function RadioGroupItem({ className, value, ...props }) {
  const ctx = React.useContext(RadioGroupContext);
  const isChecked = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      onClick={() => ctx.onValueChange?.(value)}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {isChecked && (
        <span className="flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        </span>
      )}
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
