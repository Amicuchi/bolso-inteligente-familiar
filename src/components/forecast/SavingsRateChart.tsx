
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ForecastData } from '@/context/types';
import { calculateSavingsRate, formatMonth } from '@/utils/forecastUtils';
import HelpTooltip from '@/components/ui/help-tooltip';

interface SavingsRateChartProps {
  forecast: ForecastData[];
}

const SavingsRateChart: React.FC<SavingsRateChartProps> = ({ forecast }) => {
  const data = forecast.map(month => {
    const savingsRate = calculateSavingsRate(month.income, month.expense);
    return {
      name: formatMonth(month.month),
      taxaDePoupanca: savingsRate
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p style={{ color: '#3b82f6' }}>
            Taxa de poupança: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Taxa de Poupança
          <HelpTooltip content="Percentual da sua renda que você conseguirá poupar por mês." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="taxaDePoupanca" 
                stroke="#3b82f6" 
                dot={{ r: 4 }} 
                strokeWidth={2}
                name="Taxa de Poupança"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsRateChart;
