import * as React from "react";
import { cn } from "@/lib/utils";

const toggleVariants = {
  variant: {
    default: "bg-transparent",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5",
  },
};

function Toggle({ className, variant = "default", size = "default", pressed, onPressedChange, defaultPressed, children, ...props }) {
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed || false);
  const isPressed = pressed !== undefined ? pressed : internalPressed;
  const toggle = () => {
    const next = !isPressed;
    setInternalPressed(next);
    onPressedChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isPressed && "bg-accent text-accent-foreground",
        toggleVariants.variant[variant],
        toggleVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Toggle, toggleVariants };
