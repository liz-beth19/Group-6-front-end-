import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function CustomCalendar({ selected, onSelect, className = '' }: CustomCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(today);
    if (onSelect) {
      onSelect(today);
    }
  };

  const days = generateCalendarDays();

  return (
    <div className={`p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Today indicator */}
      <div className="text-center mb-3 text-sm text-muted-foreground">
        Today is: <span className="font-bold text-red-600">{today.toLocaleDateString()}</span>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-10" />;
          }

          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isCurrentMonth = isSameMonth(date);

          return (
            <button
              key={index}
              onClick={() => onSelect && onSelect(date)}
              className={`
                h-10 w-10 text-sm rounded-md transition-colors
                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                ${isTodayDate 
                  ? 'bg-red-500 text-white font-bold border-2 border-red-700' 
                  : isSelectedDate 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Go to Today
        </Button>
      </div>
    </div>
  );
}
