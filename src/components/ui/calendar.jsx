import * as React from "react";

import { cn } from "@/lib/utils";

// Minimal calendar wrapper that uses the native date input while
// matching the shadcn Calendar API shape used in this project.
function Calendar({
  selected,
  onSelect,
  className,
  ...props
}) {
  const value = selected instanceof Date ? selected.toISOString().slice(0, 10) : "";

  return (
    <input
      type="date"
      className={cn(
        "h-9 rounded-md border border-input bg-background px-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      value={value}
      onChange={(event) => {
        const next = event.target.value ? new Date(event.target.value) : undefined;
        onSelect?.(next);
      }}
      {...props}
    />
  );
}

export { Calendar };
