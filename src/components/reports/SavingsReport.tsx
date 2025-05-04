
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SavingsBox, Goal } from '@/context/FinanceContext';
import { formatCurrency, calculatePercentage } from '@/utils/format';
import { Progress } from '@/components/ui/progress';

interface SavingsReportProps {
  savingsBoxes: SavingsBox[];
  goals: Goal[];
  periodTotals: {
    income: number;
    expense: number;
    balance: number;
    savings: number;
  };
}

const SavingsReport: React.FC<SavingsReportProps> = ({ savingsBoxes, goals, periodTotals }) => {
  // Prepare data for pie chart
  const savingsPieData = savingsBoxes.map((box, index) => ({
    name: box.name,
    value: box.currentAmount,
    fill: getColorByIndex(index)
  }));

  // Helper function for dynamic colors
  function getColorByIndex(index: number): string {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];
    return colors[index % colors.length];
  }

  // Calculate progress towards goals
  const goalsWithProgress = goals
    .filter(goal => goal.type === 'accumulated')
    .map(goal => ({
      ...goal,
      percentage: calculatePercentage(goal.currentAmount, goal.targetAmount)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Poupanças</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {savingsPieData.length > 0 ? (
            <ChartContainer
              config={
                savingsPieData.reduce((config, item, index) => {
                  config[item.name] = { color: item.fill };
                  return config;
                }, {} as any)
              }
            >
              <PieChart>
                <Pie
                  data={savingsPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {savingsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Valor Poupado"
                  ]}
                />
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Sem poupanças para exibir</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          {goalsWithProgress.length > 0 ? (
            <div className="space-y-4">
              {goalsWithProgress.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">
                      Meta: {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[100px]">
              <p className="text-muted-foreground">Sem metas para exibir</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total poupado vs Receita mensal</p>
              <p className="font-medium">
                {periodTotals.income > 0 ? `${Math.round((periodTotals.savings / periodTotals.income) * 100)}%` : '0%'} 
                {' '}<span className="text-sm text-muted-foreground">da receita total</span>
              </p>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(periodTotals.savings)} de {formatCurrency(periodTotals.income)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsReport;
