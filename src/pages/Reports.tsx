
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinance } from '@/context/FinanceContext';
import { 
  getCurrentMonth, 
  getFirstDayOfMonth, 
  getLastDayOfMonth, 
  formatMonthShort 
} from '@/utils/format';
import MonthlyTrend from '@/components/dashboard/MonthlyTrend';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import MonthSelector from '@/components/reports/MonthSelector';
import IncomeExpenseChart from '@/components/reports/IncomeExpenseChart';
import SavingsReport from '@/components/reports/SavingsReport';

const ReportsPage = () => {
  const { transactions, budgets, goals, savingsBoxes } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonth());
  
  // Filter transactions for the selected period
  const filteredTransactions = useMemo(() => {
    const firstDay = getFirstDayOfMonth(selectedPeriod);
    const lastDay = getLastDayOfMonth(selectedPeriod);
    return transactions.filter(
      transaction => transaction.date >= firstDay && transaction.date <= lastDay
    );
  }, [transactions, selectedPeriod]);

  // Calculate period totals
  const periodTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    });
    
    return {
      income,
      expense,
      balance: income - expense,
      savings: savingsBoxes.reduce((total, box) => total + box.currentAmount, 0)
    };
  }, [filteredTransactions, savingsBoxes]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Relatórios Financeiros</h1>
          <MonthSelector 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        <Tabs defaultValue="monthly">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="category">Por Categoria</TabsTrigger>
            <TabsTrigger value="savings">Poupanças</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <IncomeExpenseChart 
              transactions={filteredTransactions} 
              periodTotals={periodTotals}
              period={formatMonthShort(selectedPeriod)}
            />
            <MonthlyTrend transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="category" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryDistribution transactions={filteredTransactions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4">
            <SavingsReport 
              savingsBoxes={savingsBoxes} 
              goals={goals}
              periodTotals={periodTotals}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
