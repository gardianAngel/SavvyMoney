import * as React from "react";
import { cn } from "@/lib/utils";

// Drawer - bottom sheet component
const DrawerContext = React.createContext({});

function Drawer({ open, onOpenChange, children }) {
  return <DrawerContext.Provider value={{ open, onOpenChange }}>{children}</DrawerContext.Provider>;
}

function DrawerTrigger({ className, children, ...props }) {
  const { onOpenChange } = React.useContext(DrawerContext);
  return <button type="button" onClick={() => onOpenChange?.(true)} className={cn("", className)} {...props}>{children}</button>;
}

function DrawerContent({ className, children, ...props }) {
  const { open, onOpenChange } = React.useContext(DrawerContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background", className)} {...props}>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </div>
    </div>
  );
}

function DrawerHeader({ className, ...props }) { return <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />; }
function DrawerFooter({ className, ...props }) { return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />; }
function DrawerTitle({ className, ...props }) { return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />; }
function DrawerDescription({ className, ...props }) { return <p className={cn("text-sm text-muted-foreground", className)} {...props} />; }
function DrawerClose({ className, children, ...props }) {
  const { onOpenChange } = React.useContext(DrawerContext);
  return <button onClick={() => onOpenChange?.(false)} className={cn("", className)} {...props}>{children}</button>;
}

export { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose };
