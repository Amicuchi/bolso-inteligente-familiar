
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMonthShort } from '@/utils/format';

interface MonthSelectorProps {
  selectedPeriod: string; // formato YYYY-MM
  onPeriodChange: (period: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  const [year, month] = selectedPeriod.split('-').map(Number);

  const handlePreviousMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    onPeriodChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    
    onPeriodChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-[100px] text-center">
        <span className="font-medium">{formatMonthShort(selectedPeriod)} {year}</span>
      </div>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
