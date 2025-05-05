
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance, Transaction, CategoryType } from '@/context/FinanceContext';
import { getCategoryColor, getCategoryName } from '@/utils/categoryUtils';
import { formatCurrency } from '@/utils/format';

interface ExpenseCategoryComparisonProps {
  transactions: Transaction[];
  period: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  category: CategoryType;
}

const ExpenseCategoryComparison: React.FC<ExpenseCategoryComparisonProps> = ({ 
  transactions,
  period 
}) => {
  // Calculate data for the pie chart
  const categoryData = useMemo(() => {
    // Filter transactions to only include expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryGroups: Record<string, number> = {};
    expenses.forEach(expense => {
      const category = expense.category;
      if (!categoryGroups[category]) {
        categoryGroups[category] = 0;
      }
      categoryGroups[category] += expense.amount;
    });
    
    // Convert to array format for chart
    const data: CategoryData[] = Object.keys(categoryGroups).map(category => ({
      name: getCategoryName(category as CategoryType),
      value: categoryGroups[category],
      color: getCategoryColor(category as CategoryType),
      category: category as CategoryType,
    }));
    
    // Sort by value (highest first)
    return data.sort((a, b) => b.value - a.value);
  }, [transactions]);
  
  // Calculate total expenses
  const totalExpenses = useMemo(() => 
    categoryData.reduce((sum, category) => sum + category.value, 0), 
    [categoryData]
  );
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação de Categorias de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        {totalExpenses > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">
              Não há despesas registradas para este período.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoryComparison;
