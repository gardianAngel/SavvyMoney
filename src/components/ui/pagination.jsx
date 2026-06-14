import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Pagination({ className, ...props }) {
  return <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />;
}
function PaginationContent({ className, ...props }) {
  return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}
function PaginationItem({ className, ...props }) {
  return <li className={cn("", className)} {...props} />;
}
function PaginationLink({ className, isActive, size = "icon", ...props }) {
  return <a className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 w-10 hover:bg-accent", isActive && "border bg-background", className)} {...props} />;
}
function PaginationPrevious({ className, ...props }) {
  return <PaginationLink className={cn("gap-1 pl-2.5 w-auto", className)} {...props}>← Previous</PaginationLink>;
}
function PaginationNext({ className, ...props }) {
  return <PaginationLink className={cn("gap-1 pr-2.5 w-auto", className)} {...props}>Next →</PaginationLink>;
}
function PaginationEllipsis({ className, ...props }) {
  return <span className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>⋯</span>;
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis };
