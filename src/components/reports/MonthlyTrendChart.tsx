
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatMonthShort } from '@/utils/format';
import { Transaction } from '@/context/FinanceContext';

interface MonthlyTrendChartProps {
  monthlyData: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  const formattedData = monthlyData.map(item => ({
    ...item,
    month: formatMonthShort(item.month)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Receitas e Despesas</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer
          config={{
            receitas: { color: "#22C55E" },
            despesas: { color: "#EF4444" },
            saldo: { color: "#3B82F6" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Valor"]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <ChartLegend />
              <Line
                type="monotone"
                dataKey="income"
                name="Receitas"
                stroke="var(--color-receitas)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Despesas"
                stroke="var(--color-despesas)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Saldo"
                stroke="var(--color-saldo)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;
