import * as React from "react";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({ className, direction = "horizontal", children, ...props }) {
  return <div className={cn("flex h-full w-full", direction === "horizontal" ? "flex-row" : "flex-col", className)} {...props}>{children}</div>;
}
function ResizablePanel({ className, defaultSize, children, ...props }) {
  return <div className={cn("flex-1 overflow-auto", className)} style={defaultSize ? { flexBasis: `${defaultSize}%` } : {}} {...props}>{children}</div>;
}
function ResizableHandle({ className, withHandle, ...props }) {
  return (
    <div className={cn("relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 hover:bg-primary/20", className)} {...props}>
      {withHandle && <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">⋮</div>}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
