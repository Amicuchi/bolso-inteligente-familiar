
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ForecastData } from '@/context/FinanceContext';
import { calculateSavingsRate } from '@/utils/forecastUtils';
import { formatMonth } from '@/utils/forecastUtils';
import HelpTooltip from '@/components/ui/help-tooltip';

interface SavingsRateChartProps {
  forecast: ForecastData[];
}

const SavingsRateChart: React.FC<SavingsRateChartProps> = ({ forecast }) => {
  // Calcula a taxa de poupança para cada mês
  const savingsRates = calculateSavingsRate(forecast);
  
  // Prepara os dados para o gráfico
  const data = forecast.map((month, index) => ({
    name: formatMonth(month.month),
    rate: savingsRates[index]
  }));
  
  // Calcula a média da taxa de poupança
  const averageRate = savingsRates.reduce((sum, rate) => sum + rate, 0) / savingsRates.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p style={{ color: payload[0].color }}>
            Taxa de poupança: {payload[0].value}%
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
          Taxa de Poupança Prevista
          <HelpTooltip content="Percentual previsto da sua renda que será poupada a cada mês." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Taxa média de poupança: <span className="font-medium">{averageRate.toFixed(1)}%</span>
          </p>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 'dataMax + 10']} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                name="Taxa de Poupança" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsRateChart;
