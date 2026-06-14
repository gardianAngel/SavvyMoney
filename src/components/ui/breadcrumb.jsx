import * as React from "react";
import { cn } from "@/lib/utils";

function Breadcrumb({ className, children, ...props }) {
  return <nav aria-label="breadcrumb" className={cn("", className)} {...props}><ol className="flex items-center gap-1.5 text-sm text-muted-foreground">{children}</ol></nav>;
}
function BreadcrumbList({ className, children, ...props }) {
  return <ol className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className)} {...props}>{children}</ol>;
}
function BreadcrumbItem({ className, ...props }) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}
function BreadcrumbLink({ className, ...props }) {
  return <a className={cn("transition-colors hover:text-foreground", className)} {...props} />;
}
function BreadcrumbPage({ className, ...props }) {
  return <span className={cn("font-normal text-foreground", className)} role="link" aria-current="page" {...props} />;
}
function BreadcrumbSeparator({ className, children, ...props }) {
  return <li className={cn("[&>svg]:size-3.5", className)} role="presentation" aria-hidden="true" {...props}>{children || "/"}</li>;
}
function BreadcrumbEllipsis({ className, ...props }) {
  return <span className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>⋯</span>;
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
