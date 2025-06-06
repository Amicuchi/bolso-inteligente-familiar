
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { getCategoryName, getCategoryColor } from '@/utils/categoryUtils';
import { Transaction, CategoryType } from '@/context/FinanceContext';

interface CategoryDistributionProps {
  transactions: Transaction[];
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
  category: CategoryType;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category and sum
    const categoryMap = new Map<CategoryType, number>();
    expenseTransactions.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + transaction.amount);
    });
    
    // Convert to chart data
    return Array.from(categoryMap.entries()).map(([category, value]) => ({
      name: getCategoryName(category),
      value,
      color: getCategoryColor(category),
      category
    }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Sem dados para exibir</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
