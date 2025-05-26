
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CalendarRange } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface RawAttendanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  quickFilter: string;
  setQuickFilter: (filter: string) => void;
  onQuickFilter: (filterType: string) => void;
  onMonthSelect: (date: Date) => void;
  onClearFilters: () => void;
  filteredRecordsCount: number;
}

const RawAttendanceFilters: React.FC<RawAttendanceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  quickFilter,
  setQuickFilter,
  onQuickFilter,
  onMonthSelect,
  onClearFilters,
  filteredRecordsCount,
}) => {
  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Select date range";
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    if (dateRange.from) {
      return `From ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    if (dateRange.to) {
      return `To ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Row */}
      <div className="flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by employee ID, name, department, or device..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Date Range Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Quick Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={quickFilter === "this-week" ? "default" : "outline"}
            size="sm"
            onClick={() => onQuickFilter("this-week")}
            className={cn(
              quickFilter === "this-week" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
            )}
          >
            This Week
          </Button>
          <Button
            variant={quickFilter === "this-month" ? "default" : "outline"}
            size="sm"
            onClick={() => onQuickFilter("this-month")}
            className={cn(
              quickFilter === "this-month" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
            )}
          >
            This Month
          </Button>
          <Button
            variant={quickFilter === "this-year" ? "default" : "outline"}
            size="sm"
            onClick={() => onQuickFilter("this-year")}
            className={cn(
              quickFilter === "this-year" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
            )}
          >
            This Year
          </Button>
        </div>

        {/* Custom Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "gap-2",
                quickFilter === "custom" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
              )}
            >
              <CalendarRange className="h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range) {
                  setDateRange({ from: range.from, to: range.to });
                  setQuickFilter("custom");
                }
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Month Picker for Historical Data */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "gap-2",
                quickFilter === "custom-month" && "bg-gray-800 text-white font-bold hover:bg-gray-700"
              )}
            >
              <Calendar className="h-4 w-4" />
              Pick Month
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              onSelect={(date) => {
                if (date) {
                  onMonthSelect(date);
                }
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {(dateRange.from || dateRange.to) && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filter Display */}
      {(dateRange.from || dateRange.to) && (
        <div className="text-sm text-gray-600">
          Showing records for: {formatDateRange()} ({filteredRecordsCount} records)
        </div>
      )}
    </div>
  );
};

export default RawAttendanceFilters;
