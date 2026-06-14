import * as React from "react";
// Chart component - placeholder for recharts integration
export function ChartContainer({ className, children, config, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}
export function ChartTooltip({ children, ...props }) {
  return <>{children}</>;
}
export function ChartTooltipContent({ ...props }) {
  return null;
}
export function ChartLegend({ children, ...props }) {
  return <>{children}</>;
}
export function ChartLegendContent({ ...props }) {
  return null;
}
