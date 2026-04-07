import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

const YearDatePicker = ({ label, value, onChange, placeholder }) => {
  const [date, setDate] = React.useState();

  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
      return;
    }
    const year = Number(value);
    if (!Number.isNaN(year)) {
      setDate(new Date(year, 0, 1));
    }
  }, [value]);

  const handleSelect = (next) => {
    setDate(next);
    const year = next instanceof Date ? String(next.getFullYear()) : "";
    onChange?.(year);
  };

  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-between text-left font-normal"
            data-empty={!date}
          >
            {date ? (
              <span>{date.getFullYear()}</span>
            ) : (
              <span className="text-muted-foreground text-xs">
                {placeholder || "Pick year"}
              </span>
            )}
            <ChevronDownIcon className="ml-2 size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Calendar mode="single" selected={date} onSelect={handleSelect} defaultMonth={date} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default YearDatePicker;
