
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/format';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  periodTotals: {
    income: number;
    expense: number;
    balance: number;
    savings: number;
  };
  period: string;
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ 
  transactions, 
  periodTotals,
  period
}) => {
  const chartData = [
    {
      name: period,
      receitas: periodTotals.income,
      despesas: periodTotals.expense,
      saldo: periodTotals.balance
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer 
            config={{
              receitas: { color: "#22C55E" },
              despesas: { color: "#EF4444" },
              saldo: { color: "#3B82F6" }
            }}
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
              />
              <Tooltip 
                formatter={(value: number) => [
                  formatCurrency(value),
                  value >= 0 ? "Valor" : "Valor Negativo"
                ]}
              />
              <ChartLegend />
              <Bar dataKey="receitas" name="Receitas" fill="var(--color-receitas)" />
              <Bar dataKey="despesas" name="Despesas" fill="var(--color-despesas)" />
              <Bar dataKey="saldo" name="Saldo" fill="var(--color-saldo)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total de Receitas</p>
                <p className="text-2xl font-semibold text-income">{formatCurrency(periodTotals.income)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total de Despesas</p>
                <p className="text-2xl font-semibold text-expense">{formatCurrency(periodTotals.expense)}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Saldo do Período</p>
                <p className={`text-2xl font-semibold ${periodTotals.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(periodTotals.balance)}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total em Poupanças</p>
                <p className="text-2xl font-semibold text-primary">
                  {formatCurrency(periodTotals.savings)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeExpenseChart;
