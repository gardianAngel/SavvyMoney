import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const SidebarContext = React.createContext({ open: true, setOpen: () => {}, isMobile: false });

export function useSidebar() {
  return React.useContext(SidebarContext);
}

export function SidebarProvider({ defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return <SidebarContext.Provider value={{ open, setOpen, isMobile, toggleSidebar: () => setOpen(!open) }}>{children}</SidebarContext.Provider>;
}

export function Sidebar({ className, children, side = "left", ...props }) {
  const { open, isMobile, setOpen } = useSidebar();
  if (isMobile) {
    return <Sheet open={open} onOpenChange={setOpen}><SheetContent side={side} className="w-[260px] p-0">{children}</SheetContent></Sheet>;
  }
  return (
    <div className={cn("flex h-full w-[260px] flex-col border-r bg-background transition-all duration-300", !open && "w-0 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarHeader({ className, ...props }) { return <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />; }
export function SidebarContent({ className, ...props }) { return <div className={cn("flex flex-1 flex-col gap-2 overflow-auto p-4", className)} {...props} />; }
export function SidebarFooter({ className, ...props }) { return <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />; }
export function SidebarGroup({ className, ...props }) { return <div className={cn("flex flex-col gap-1", className)} {...props} />; }
export function SidebarGroupLabel({ className, ...props }) { return <div className={cn("px-2 text-xs font-medium text-muted-foreground", className)} {...props} />; }
export function SidebarGroupContent({ className, ...props }) { return <div className={cn("", className)} {...props} />; }
export function SidebarMenu({ className, ...props }) { return <ul className={cn("flex flex-col gap-1", className)} {...props} />; }
export function SidebarMenuItem({ className, ...props }) { return <li className={cn("", className)} {...props} />; }
export function SidebarMenuButton({ className, isActive, children, ...props }) {
  return <button className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent", isActive && "bg-accent text-accent-foreground", className)} {...props}>{children}</button>;
}
export function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("", className)} {...props}>☰</Button>;
}
