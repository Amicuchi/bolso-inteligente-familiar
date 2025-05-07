
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastData } from '@/context/types';
import { formatCurrency } from '@/utils/format';
import { formatMonth } from '@/utils/forecastUtils';
import HelpTooltip from '@/components/ui/help-tooltip';

interface MonthlyForecastSummaryProps {
  forecast: ForecastData[];
}

const MonthlyForecastSummary: React.FC<MonthlyForecastSummaryProps> = ({ forecast }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Resumo da Previsão
          <HelpTooltip content="Resumo mensal de receitas, despesas e saldo previsto para os próximos meses." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forecast.map((month, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{formatMonth(month.month)}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Receitas</p>
                  <p className="font-medium text-income">{formatCurrency(month.income)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Despesas</p>
                  <p className="font-medium text-expense">{formatCurrency(month.expense)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className={`font-medium ${month.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                    {formatCurrency(month.balance)}
                  </p>
                </div>
              </div>
              
              {month.balance < 0 && (
                <div className="mt-2 text-xs text-rose-500 bg-rose-50 p-2 rounded">
                  Alerta: Previsão de saldo negativo neste mês!
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyForecastSummary;
