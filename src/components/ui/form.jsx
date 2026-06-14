import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Form components - simplified without react-hook-form dependency
const FormContext = React.createContext({});

function Form({ children, ...props }) {
  return <form {...props}>{children}</form>;
}

function FormField({ name, render, control }) {
  return render({ field: { name, value: "", onChange: () => {} } });
}

function FormItem({ className, children, ...props }) {
  return <div className={cn("space-y-2", className)} {...props}>{children}</div>;
}

function FormLabel({ className, children, ...props }) {
  return <Label className={cn("", className)} {...props}>{children}</Label>;
}

function FormControl({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function FormDescription({ className, children, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</p>;
}

function FormMessage({ className, children, ...props }) {
  if (!children) return null;
  return <p className={cn("text-sm font-medium text-destructive", className)} {...props}>{children}</p>;
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
