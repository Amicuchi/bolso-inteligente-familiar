
import React, { useMemo, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import MonthlyTrend from '@/components/dashboard/MonthlyTrend';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import GoalProgress from '@/components/dashboard/GoalProgress';
import SavingsBoxWidget from '@/components/dashboard/SavingsBoxWidget';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { useFinance } from '@/context/FinanceContext';
import { getCurrentMonth, isDateInMonth } from '@/utils/format';

const Dashboard = () => {
  const { transactions, budgets, goals, savingsBoxes } = useFinance();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  
  // Filter transactions for the current month
  const monthlyTransactions = useMemo(() => 
    transactions.filter(t => isDateInMonth(t.date, currentMonth)), 
    [transactions, currentMonth]
  );

  // Calculate summary statistics
  const summary = useMemo(() => {
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = monthlyIncome - monthlyExpense;
    
    // Calculate percentage changes from previous month
    const prevMonth = new Date(currentMonth).getMonth() === 0 
      ? `${new Date(currentMonth).getFullYear() - 1}-12` 
      : `${new Date(currentMonth).getFullYear()}-${String(new Date(currentMonth).getMonth()).padStart(2, '0')}`;
    
    const prevMonthTransactions = transactions.filter(t => isDateInMonth(t.date, prevMonth));
    const prevMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const prevMonthExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const prevBalance = prevMonthIncome - prevMonthExpense;
    
    const incomeChange = prevMonthIncome === 0 
      ? 100 
      : Math.round(((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100);
    
    const expenseChange = prevMonthExpense === 0 
      ? 100 
      : Math.round(((monthlyExpense - prevMonthExpense) / prevMonthExpense) * 100);
    
    const balanceChange = prevBalance === 0 
      ? 100 
      : Math.round(((balance - prevBalance) / Math.abs(prevBalance)) * 100);

    return {
      income: monthlyIncome,
      expense: monthlyExpense,
      balance,
      incomeChange,
      expenseChange,
      balanceChange
    };
  }, [monthlyTransactions, transactions, currentMonth]);

  return (
    <MainLayout>
      {/* First row: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard 
          title="Receitas do Mês" 
          value={summary.income} 
          type="income" 
          percentage={summary.incomeChange}
        />
        <SummaryCard 
          title="Despesas do Mês" 
          value={summary.expense} 
          type="expense" 
          percentage={summary.expenseChange}
        />
        <SummaryCard 
          title="Saldo do Mês" 
          value={summary.balance} 
          type="balance" 
          percentage={summary.balanceChange}
        />
      </div>
      
      {/* Second row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CategoryDistribution transactions={monthlyTransactions} />
        <MonthlyTrend transactions={transactions} />
      </div>
      
      {/* Third row: Budgets and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BudgetProgress 
          budgets={budgets.filter(b => b.period === currentMonth)} 
          transactions={transactions}
        />
        <GoalProgress goals={goals} />
      </div>
      
      {/* Fourth row: Savings Boxes */}
      <div className="mb-6">
        <SavingsBoxWidget savingsBoxes={savingsBoxes} />
      </div>
      
      {/* Fifth row: Recent Transactions */}
      <div>
        <RecentTransactions transactions={transactions} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
