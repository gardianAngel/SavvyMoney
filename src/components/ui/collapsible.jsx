import * as React from "react";
import { cn } from "@/lib/utils";

function Collapsible({ open, onOpenChange, defaultOpen, children, className, ...props }) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isOpen = open !== undefined ? open : internalOpen;
  const toggle = () => { const next = !isOpen; setInternalOpen(next); onOpenChange?.(next); };
  return (
    <CollapsibleContext.Provider value={{ open: isOpen, toggle }}>
      <div className={cn("", className)} {...props}>{children}</div>
    </CollapsibleContext.Provider>
  );
}
const CollapsibleContext = React.createContext({});
function CollapsibleTrigger({ className, children, asChild, ...props }) {
  const { toggle } = React.useContext(CollapsibleContext);
  return <button type="button" onClick={toggle} className={cn("", className)} {...props}>{children}</button>;
}
function CollapsibleContent({ className, children, ...props }) {
  const { open } = React.useContext(CollapsibleContext);
  if (!open) return null;
  return <div className={cn("", className)} {...props}>{children}</div>;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
