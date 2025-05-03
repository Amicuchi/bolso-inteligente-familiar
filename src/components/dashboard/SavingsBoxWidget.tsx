
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavingsBox } from '@/context/FinanceContext';
import { formatCurrency, calculatePercentage } from '@/utils/format';
import { Progress } from '@/components/ui/progress';
import { PiggyBank } from 'lucide-react';

interface SavingsBoxWidgetProps {
  savingsBoxes: SavingsBox[];
}

const SavingsBoxWidget: React.FC<SavingsBoxWidgetProps> = ({ savingsBoxes }) => {
  const totalSavings = savingsBoxes.reduce(
    (total, box) => total + box.currentAmount,
    0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Caixinhas de Investimento</CardTitle>
        <PiggyBank className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          {formatCurrency(totalSavings)}
        </div>

        {savingsBoxes.length > 0 ? (
          <div className="space-y-4">
            {savingsBoxes.map((box) => {
              const percentage = box.targetAmount 
                ? calculatePercentage(box.currentAmount, box.targetAmount)
                : 100;
              
              return (
                <div key={box.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{box.name}</span>
                    <span>{formatCurrency(box.currentAmount)}</span>
                  </div>
                  {box.targetAmount && (
                    <Progress value={percentage} className="h-1" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-muted-foreground">Sem caixinhas de investimento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsBoxWidget;
