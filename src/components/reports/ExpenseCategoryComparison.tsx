import React from 'react';
import { Transaction } from '@/context/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryName } from '@/utils/categoryUtils';

// Update the props interface to match how it's being used
export interface ExpenseCategoryComparisonProps {
  expensesCurrentPeriod: Transaction[];
  expensesPreviousPeriod: Transaction[];
  currentPeriodLabel: string;
  previousPeriodLabel: string;
}

const ExpenseCategoryComparison: React.FC<ExpenseCategoryComparisonProps> = ({
  expensesCurrentPeriod,
  expensesPreviousPeriod,
  currentPeriodLabel,
  previousPeriodLabel
}) => {
  // Aggregate expenses by category for the current period
  const aggregateExpenses = (expenses: Transaction[]) => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      if (expense.type === 'expense') {
        const categoryName = getCategoryName(expense.category);
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount;
      }
    });
    return categoryTotals;
  };

  const currentPeriodCategoryTotals = aggregateExpenses(expensesCurrentPeriod);
  const previousPeriodCategoryTotals = aggregateExpenses(expensesPreviousPeriod);

  // Prepare data for the Recharts component
  const data = Object.keys(currentPeriodCategoryTotals).map(category => ({
    category,
    [currentPeriodLabel]: currentPeriodCategoryTotals[category],
    [previousPeriodLabel]: previousPeriodCategoryTotals[category] || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={currentPeriodLabel} fill="#8884d8" />
            <Bar dataKey={previousPeriodLabel} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoryComparison;
