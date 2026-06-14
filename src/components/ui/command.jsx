import * as React from "react";
import { cn } from "@/lib/utils";

// Command/combobox - simplified implementation
function Command({ className, children, ...props }) {
  return <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)} {...props}>{children}</div>;
}
function CommandInput({ className, ...props }) {
  return (
    <div className="flex items-center border-b px-3">
      <input className={cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
    </div>
  );
}
function CommandList({ className, children, ...props }) {
  return <div className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props}>{children}</div>;
}
function CommandEmpty({ className, children, ...props }) {
  return <div className={cn("py-6 text-center text-sm", className)} {...props}>{children || "No results found."}</div>;
}
function CommandGroup({ className, children, heading, ...props }) {
  return (
    <div className={cn("overflow-hidden p-1 text-foreground", className)} {...props}>
      {heading && <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>}
      {children}
    </div>
  );
}
function CommandItem({ className, children, onSelect, ...props }) {
  return (
    <div
      onClick={() => onSelect?.()}
      className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
function CommandSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 h-px bg-border", className)} {...props} />;
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator };
