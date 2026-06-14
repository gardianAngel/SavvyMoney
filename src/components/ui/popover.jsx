import * as React from "react";
import { cn } from "@/lib/utils";

function Popover({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

const PopoverContext = React.createContext({});

function PopoverTrigger({ className, children, asChild, ...props }) {
  const { open, setOpen } = React.useContext(PopoverContext);
  return (
    <button type="button" onClick={() => setOpen(!open)} className={cn("", className)} {...props}>
      {children}
    </button>
  );
}

function PopoverContent({ className, children, align = "center", ...props }) {
  const { open, setOpen } = React.useContext(PopoverContext);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Popover, PopoverTrigger, PopoverContent };
