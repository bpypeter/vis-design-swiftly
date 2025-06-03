
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onDateFilter: (startDate: Date | null, endDate: Date | null) => void;
  onClearFilters: () => void;
  placeholder?: string;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
  statusOptions?: { value: string; label: string }[];
}

const SearchFilter = ({
  onSearch,
  onStatusFilter,
  onDateFilter,
  onClearFilters,
  placeholder = "Căutare...",
  showStatusFilter = false,
  showDateFilter = false,
  statusOptions = []
}: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onStatusFilter(value);
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onDateFilter(start, end);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setStartDate(null);
    setEndDate(null);
    onClearFilters();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search">Căutare</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {showStatusFilter && (
          <div>
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Toate statusurile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate statusurile</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showDateFilter && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Data început</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd MMM yyyy", { locale: ro }) : "Selectează"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => handleDateChange(date || null, endDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Data sfârșit</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd MMM yyyy", { locale: ro }) : "Selectează"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(date) => handleDateChange(startDate, date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={clearAllFilters} variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            Șterge filtrele
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
