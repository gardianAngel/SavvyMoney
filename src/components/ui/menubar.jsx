import * as React from "react";
import { cn } from "@/lib/utils";

function Menubar({ className, children, ...props }) {
  return <div className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)} {...props}>{children}</div>;
}
function MenubarMenu({ children }) { return <div className="relative">{children}</div>; }
function MenubarTrigger({ className, children, ...props }) {
  return <button className={cn("flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground", className)} {...props}>{children}</button>;
}
function MenubarContent({ className, children, ...props }) {
  return <div className={cn("absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props}>{children}</div>;
}
function MenubarItem({ className, children, ...props }) {
  return <div className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", className)} {...props}>{children}</div>;
}
function MenubarSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
}

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator };
