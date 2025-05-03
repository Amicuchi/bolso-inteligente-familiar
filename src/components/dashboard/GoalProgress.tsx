
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/context/FinanceContext';
import { formatCurrency, calculatePercentage, formatDate } from '@/utils/format';

interface GoalProgressProps {
  goals: Goal[];
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goals }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas Financeiras</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      até {formatDate(goal.deadline)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-muted-foreground">Sem metas definidas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
