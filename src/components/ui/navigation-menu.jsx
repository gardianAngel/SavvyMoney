import * as React from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({ className, children, ...props }) {
  return <nav className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)} {...props}>{children}</nav>;
}
function NavigationMenuList({ className, children, ...props }) {
  return <ul className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)} {...props}>{children}</ul>;
}
function NavigationMenuItem({ className, children, ...props }) {
  return <li className={cn("", className)} {...props}>{children}</li>;
}
function NavigationMenuTrigger({ className, children, ...props }) {
  return <button className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground", className)} {...props}>{children}</button>;
}
function NavigationMenuContent({ className, children, ...props }) {
  return <div className={cn("absolute left-0 top-0 w-full", className)} {...props}>{children}</div>;
}
function NavigationMenuLink({ className, children, ...props }) {
  return <a className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", className)} {...props}>{children}</a>;
}

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink };
