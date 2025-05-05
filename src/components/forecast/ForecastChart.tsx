
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastData } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/format';
import { formatMonth } from '@/utils/forecastUtils';
import HelpTooltip from '@/components/ui/help-tooltip';

interface ForecastChartProps {
  forecast: ForecastData[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecast }) => {
  const data = forecast.map(month => ({
    name: formatMonth(month.month),
    receitas: month.income,
    despesas: month.expense,
    saldo: month.balance
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          Previsão Financeira
          <HelpTooltip content="Gráfico de previsão financeira baseado em suas transações recorrentes." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', '')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="receitas" name="Receitas" fill="#22c55e" />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
              <Bar dataKey="saldo" name="Saldo" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
