import * as React from "react";
import { cn } from "@/lib/utils";

function Carousel({ className, children, ...props }) {
  return <div className={cn("relative", className)} {...props}>{children}</div>;
}
function CarouselContent({ className, children, ...props }) {
  return <div className={cn("flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4", className)} {...props}>{children}</div>;
}
function CarouselItem({ className, children, ...props }) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full snap-center", className)} {...props}>{children}</div>;
}
function CarouselPrevious({ className, ...props }) {
  return <button className={cn("absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border shadow-sm flex items-center justify-center", className)} {...props}>←</button>;
}
function CarouselNext({ className, ...props }) {
  return <button className={cn("absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border shadow-sm flex items-center justify-center", className)} {...props}>→</button>;
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
