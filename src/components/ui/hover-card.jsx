import * as React from "react";
import { cn } from "@/lib/utils";

function HoverCard({ children }) {
  const [open, setOpen] = React.useState(false);
  return <HoverCardContext.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></HoverCardContext.Provider>;
}
const HoverCardContext = React.createContext({});
function HoverCardTrigger({ className, children, ...props }) {
  const { setOpen } = React.useContext(HoverCardContext);
  return <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className={cn("inline-block", className)} {...props}>{children}</div>;
}
function HoverCardContent({ className, children, ...props }) {
  const { open } = React.useContext(HoverCardContext);
  if (!open) return null;
  return <div className={cn("absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)} {...props}>{children}</div>;
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
