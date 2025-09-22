import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

export type SimpleCalendarProps = React.ComponentProps<typeof DayPicker>;

function SimpleCalendar({
  className,
  ...props
}: SimpleCalendarProps) {
  return (
    <DayPicker
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: "h-9 w-9 p-0 font-normal",
        day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white",
        day_today: "bg-orange-500 text-white font-bold ring-2 ring-orange-300",
        day_outside: "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

export { SimpleCalendar };
