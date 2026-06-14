import * as React from "react";
import { cn } from "@/lib/utils";

function Calendar({ className, selected, onSelect, ...props }) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());
  const [viewDate, setViewDate] = React.useState(new Date(currentDate));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isSelected = (day) => {
    if (!selected || !day) return false;
    const d = new Date(year, month, day);
    return d.toDateString() === new Date(selected).toDateString();
  };

  const isToday = (day) => {
    if (!day) return false;
    const d = new Date(year, month, day);
    return d.toDateString() === new Date().toDateString();
  };

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-accent rounded">←</button>
        <span className="text-sm font-medium">{monthNames[month]} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-accent rounded">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="p-2 text-muted-foreground font-medium">{d}</div>
        ))}
        {days.map((day, i) => (
          <button
            key={i}
            disabled={!day}
            onClick={() => { if (day) { const d = new Date(year, month, day); setCurrentDate(d); onSelect?.(d); }}}
            className={cn(
              "p-2 rounded-md text-sm transition-colors",
              !day && "invisible",
              day && "hover:bg-accent",
              isSelected(day) && "bg-primary text-primary-foreground",
              isToday(day) && !isSelected(day) && "bg-accent"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

export { Calendar };
