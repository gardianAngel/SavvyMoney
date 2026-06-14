import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipContext = React.createContext({});

function TooltipProvider({ children }) {
  return <>{children}</>;
}

function Tooltip({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ className, children, asChild, ...props }) {
  const { setOpen } = React.useContext(TooltipContext);
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TooltipContent({ className, children, side = "top", ...props }) {
  const { open } = React.useContext(TooltipContext);
  if (!open) return null;

  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[side];

  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        positionClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
