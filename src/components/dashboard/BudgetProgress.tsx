
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget, Transaction } from '@/context/FinanceContext';
import { formatCurrency, isDateInMonth } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';

interface BudgetProgressProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets, transactions }) => {
  const calculateSpentAmount = (budget: Budget) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category && 
        isDateInMonth(t.date, budget.period)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculatePercentage = (spent: number, budget: number) => {
    return Math.min(Math.round((spent / budget) * 100), 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-expense';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = calculateSpentAmount(budget);
              const percentage = calculatePercentage(spent, budget.amount);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{getCategoryName(budget.category)}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    indicatorClassName={getProgressColor(percentage)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-muted-foreground">Sem orçamentos definidos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
