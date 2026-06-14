import * as React from "react";
import { cn } from "@/lib/utils";

function InputOTP({ className, maxLength = 6, value = "", onChange, children, ...props }) {
  return <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>;
}
function InputOTPGroup({ className, children, ...props }) {
  return <div className={cn("flex items-center", className)} {...props}>{children}</div>;
}
function InputOTPSlot({ index, className, ...props }) {
  return (
    <div className={cn("relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", className)} {...props}>
      <span className="text-center">•</span>
    </div>
  );
}
function InputOTPSeparator({ className, ...props }) {
  return <div className={cn("", className)} role="separator" {...props}>-</div>;
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
