import * as React from "react";
import { cn } from "@/lib/utils";

function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

const DropdownContext = React.createContext({});

function DropdownMenuTrigger({ className, children, asChild, ...props }) {
  const { open, setOpen } = React.useContext(DropdownContext);
  return (
    <button type="button" onClick={() => setOpen(!open)} className={cn("", className)} {...props}>
      {children}
    </button>
  );
}

function DropdownMenuContent({ className, children, align = "end", ...props }) {
  const { open, setOpen } = React.useContext(DropdownContext);
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
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        align === "start" ? "left-0" : "right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ className, children, onClick, ...props }) {
  const { setOpen } = React.useContext(DropdownContext);
  return (
    <div
      onClick={(e) => { onClick?.(e); setOpen(false); }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
}

function DropdownMenuLabel({ className, ...props }) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />;
}

function DropdownMenuCheckboxItem({ className, children, checked, onCheckedChange, ...props }) {
  const { setOpen } = React.useContext(DropdownContext);
  return (
    <div
      onClick={() => { onCheckedChange?.(!checked); setOpen(false); }}
      className={cn("relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && "✓"}
      </span>
      {children}
    </div>
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem };
