import * as React from "react";
import { cn } from "@/lib/utils";

const Toast = React.forwardRef(({ className, variant = "default", children, open, onOpenChange, ...props }, ref) => {
  if (open === false) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive" ? "border-destructive bg-destructive text-destructive-foreground" : "border bg-background text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <button onClick={() => onOpenChange?.(false)} className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100">✕</button>
    </div>
  );
});
Toast.displayName = "Toast";

function ToastTitle({ className, ...props }) {
  return <div className={cn("text-sm font-semibold", className)} {...props} />;
}
function ToastDescription({ className, ...props }) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
}
function ToastAction({ className, children, ...props }) {
  return <button className={cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium", className)} {...props}>{children}</button>;
}
function ToastProvider({ children }) { return <>{children}</>; }
function ToastViewport({ className, ...props }) {
  return <div className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className)} {...props} />;
}
function ToastClose({ className, ...props }) {
  return <button className={cn("absolute right-2 top-2", className)} {...props}>✕</button>;
}

export { Toast, ToastTitle, ToastDescription, ToastAction, ToastProvider, ToastViewport, ToastClose };