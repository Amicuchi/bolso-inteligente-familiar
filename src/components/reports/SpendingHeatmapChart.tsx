
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { Transaction } from '@/context/FinanceContext';

interface SpendingHeatmapChartProps {
  transactions: Transaction[];
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS_OF_DAY = Array.from({ length: 24 }, (_, i) => i);

const SpendingHeatmapChart: React.FC<SpendingHeatmapChartProps> = ({ transactions }) => {
  const heatmapData = useMemo(() => {
    // Initialize the heatmap data with zeros
    const data: number[][] = Array.from({ length: 7 }, () => 
      Array.from({ length: 24 }, () => 0)
    );
    
    // Fill the heatmap with transaction data
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date);
        const dayOfWeek = date.getDay();
        const hourOfDay = date.getHours();
        
        data[dayOfWeek][hourOfDay] += transaction.amount;
      }
    });
    
    return data;
  }, [transactions]);

  // Find the maximum value for scaling the color intensity
  const maxValue = useMemo(() => {
    let max = 0;
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        if (heatmapData[day][hour] > max) {
          max = heatmapData[day][hour];
        }
      }
    }
    return max;
  }, [heatmapData]);

  // Function to determine the background color based on the value
  const getBackgroundColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    
    const intensity = Math.min(1, value / maxValue);
    const red = Math.round(239 + (255 - 239) * (1 - intensity));
    const green = Math.round(68 + (255 - 68) * (1 - intensity));
    const blue = Math.round(68 + (255 - 68) * (1 - intensity));
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Calor de Gastos (Dia e Hora)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="flex mb-1">
              <div className="w-12"></div>
              {HOURS_OF_DAY.map(hour => (
                <div key={hour} className="flex-1 text-center text-xs font-medium text-muted-foreground">
                  {hour}h
                </div>
              ))}
            </div>
            
            {DAYS_OF_WEEK.map((day, dayIndex) => (
              <div key={day} className="flex items-center">
                <div className="w-12 text-xs font-medium">{day}</div>
                {HOURS_OF_DAY.map(hour => {
                  const value = heatmapData[dayIndex][hour];
                  return (
                    <div
                      key={hour}
                      className={`flex-1 h-8 m-0.5 rounded ${getBackgroundColor(value)} flex items-center justify-center`}
                      title={`${day} ${hour}h: ${formatCurrency(value)}`}
                    >
                      {value > 0 && (
                        <span className="text-[8px] font-semibold text-white">
                          {value > 999 ? '•••' : formatCurrency(value)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            
            <div className="flex items-center justify-end mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-xs">R$ 0</span>
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <div className="w-4 h-4 bg-red-300 rounded"></div>
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs">{formatCurrency(maxValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingHeatmapChart;
