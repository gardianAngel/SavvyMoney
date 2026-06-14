import * as React from "react";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext({});

function ToggleGroup({ type = "single", value, onValueChange, defaultValue, className, children, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || (type === "multiple" ? [] : ""));
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = onValueChange || setInternalValue;

  const toggle = (itemValue) => {
    if (type === "multiple") {
      const arr = Array.isArray(currentValue) ? currentValue : [];
      handleChange(arr.includes(itemValue) ? arr.filter(v => v !== itemValue) : [...arr, itemValue]);
    } else {
      handleChange(currentValue === itemValue ? "" : itemValue);
    }
  };

  return (
    <ToggleGroupContext.Provider value={{ value: currentValue, toggle, type }}>
      <div className={cn("flex items-center justify-center gap-1", className)} role="group" {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({ className, value, children, ...props }) {
  const ctx = React.useContext(ToggleGroupContext);
  const isPressed = ctx.type === "multiple"
    ? Array.isArray(ctx.value) && ctx.value.includes(value)
    : ctx.value === value;

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={() => ctx.toggle(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-3",
        isPressed && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
