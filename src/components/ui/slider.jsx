import * as React from "react";
import { cn } from "@/lib/utils";

function Slider({ className, value, onValueChange, defaultValue = [0], min = 0, max = 100, step = 1, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const current = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    const val = [Number(e.target.value)];
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current[0]}
      onChange={handleChange}
      className={cn("w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary", className)}
      {...props}
    />
  );
}

export { Slider };
