import * as React from "react";
import { cn } from "@/lib/utils";

// Context menu - right-click menu
const ContextMenuContext = React.createContext({});

function ContextMenu({ children }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  return <ContextMenuContext.Provider value={{ open, setOpen, pos, setPos }}>{children}</ContextMenuContext.Provider>;
}

function ContextMenuTrigger({ className, children, ...props }) {
  const { setOpen, setPos } = React.useContext(ContextMenuContext);
  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }); setOpen(true); }}
      className={cn("", className)} {...props}
    >{children}</div>
  );
}

function ContextMenuContent({ className, children, ...props }) {
  const { open, setOpen, pos } = React.useContext(ContextMenuContext);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div ref={ref} style={{ position: "fixed", left: pos.x, top: pos.y }} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props}>
      {children}
    </div>
  );
}

function ContextMenuItem({ className, children, onClick, ...props }) {
  const { setOpen } = React.useContext(ContextMenuContext);
  return <div onClick={(e) => { onClick?.(e); setOpen(false); }} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", className)} {...props}>{children}</div>;
}

function ContextMenuSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator };
