
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ForecastChart from '@/components/forecast/ForecastChart';
import RecurringTransactionsList from '@/components/forecast/RecurringTransactionsList';
import SavingsRateChart from '@/components/forecast/SavingsRateChart';
import MonthlyForecastSummary from '@/components/forecast/MonthlyForecastSummary';
import { CalendarClock, PlusCircle } from 'lucide-react';
import HelpTooltip from '@/components/ui/help-tooltip';

const ForecastPage = () => {
  const { getRecurringTransactions, getForecast } = useFinance();
  const [forecastMonths, setForecastMonths] = useState('6');
  
  const recurringTransactions = getRecurringTransactions();
  const forecast = getForecast(parseInt(forecastMonths));

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center">
                <CalendarClock className="mr-2 h-5 w-5" />
                Previsão Financeira
                <HelpTooltip content="Visualize a previsão da sua situação financeira nos próximos meses com base nas suas transações recorrentes." />
              </CardTitle>
              <CardDescription>
                Planeje seu futuro financeiro com base em suas transações recorrentes
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground mr-2">Mostrar previsão para</p>
              <Select
                value={forecastMonths}
                onValueChange={value => setForecastMonths(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {recurringTransactions.length > 0 ? (
              <p className="text-sm text-muted-foreground">
                Sua previsão é baseada em {recurringTransactions.length} transações recorrentes.
              </p>
            ) : (
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="mb-2">Você não tem transações recorrentes cadastradas.</p>
                <Button asChild>
                  <Link to="/transactions">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Transações Recorrentes
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {recurringTransactions.length > 0 && (
          <>
            {/* Gráfico de Previsão */}
            <ForecastChart forecast={forecast} />
            
            {/* Segunda linha - Resumo e Taxa de Poupança */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyForecastSummary forecast={forecast} />
              <SavingsRateChart forecast={forecast} />
            </div>
            
            {/* Terceira linha - Transações Recorrentes */}
            <RecurringTransactionsList transactions={recurringTransactions} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ForecastPage;
