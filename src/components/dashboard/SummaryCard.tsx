
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance' | 'default';
  percentage?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type, percentage }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'border-l-4 border-l-income';
      case 'expense':
        return 'border-l-4 border-l-expense';
      case 'balance':
        return 'border-l-4 border-l-primary';
      default:
        return '';
    }
  };

  return (
    <Card className={`overflow-hidden ${getCardStyles()}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">{formatCurrency(value)}</p>
          
          {percentage !== undefined && (
            <span className={`ml-2 text-sm flex items-center ${
              percentage > 0 ? 'text-income' : percentage < 0 ? 'text-expense' : 'text-muted-foreground'
            }`}>
              {percentage > 0 ? <ArrowUp className="h-4 w-4" /> : percentage < 0 ? <ArrowDown className="h-4 w-4" /> : null}
              {Math.abs(percentage)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
