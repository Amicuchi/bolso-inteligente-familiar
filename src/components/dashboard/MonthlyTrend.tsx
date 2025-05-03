
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/context/FinanceContext';

interface MonthlyTrendProps {
  transactions: Transaction[];
}

interface ChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

const MonthlyTrend: React.FC<MonthlyTrendProps> = ({ transactions }) => {
  // Format YYYY-MM to MMM
  const formatMonth = (yearMonth: string): string => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'short' });
  };
  
  const chartData = useMemo(() => {
    // Group transactions by month
    const monthlyData = new Map<string, { income: number; expense: number; balance: number }>();
    
    // Initialize with past 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, { income: 0, expense: 0, balance: 0 });
    }
    
    // Add transaction data
    transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7); // YYYY-MM
      if (!monthlyData.has(monthKey)) return;
      
      const monthData = monthlyData.get(monthKey)!;
      
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expense += transaction.amount;
      }
      monthData.balance = monthData.income - monthData.expense;
    });
    
    // Convert to chart format
    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: formatMonth(month),
        income: data.income,
        expense: data.expense,
        balance: data.balance
      }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('pt-BR', {
                  notation: 'compact',
                  compactDisplay: 'short',
                  currency: 'BRL'
                }).format(value)
              }
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#22C55E" />
            <Bar dataKey="expense" name="Despesas" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrend;
