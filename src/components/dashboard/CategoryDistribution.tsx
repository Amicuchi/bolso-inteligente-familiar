
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
      color: getCategoryColor(category).replace('bg-', ''),
      category
    }));
  }, [transactions]);
  
  // Helper to convert Tailwind color classes to hex colors for the chart
  const getTailwindColor = (color: string): string => {
    switch (color) {
      case 'red-400': return '#F87171';
      case 'red-500': return '#EF4444';
      case 'orange-500': return '#F97316';
      case 'yellow-500': return '#EAB308';
      case 'green-500': return '#22C55E';
      case 'blue-400': return '#60A5FA';
      case 'blue-500': return '#3B82F6';
      case 'indigo-500': return '#6366F1';
      case 'purple-400': return '#C084FC';
      case 'purple-500': return '#A855F7';
      case 'pink-500': return '#EC4899';
      case 'gray-400': return '#9CA3AF';
      case 'gray-500': return '#6B7280';
      default: return '#6B7280';
    }
  };

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
                    fill={getTailwindColor(entry.color)} 
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
