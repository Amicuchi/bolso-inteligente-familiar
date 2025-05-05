
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { Transaction, CategoryType } from '@/context/FinanceContext';
import { getCategoryName } from '@/utils/categoryUtils';

interface ExpenseCategoryComparisonProps {
  currentPeriodTransactions: Transaction[];
  previousPeriodTransactions: Transaction[];
  currentPeriodLabel: string;
  previousPeriodLabel: string;
}

const ExpenseCategoryComparison: React.FC<ExpenseCategoryComparisonProps> = ({
  currentPeriodTransactions,
  previousPeriodTransactions,
  currentPeriodLabel,
  previousPeriodLabel
}) => {
  const comparisonData = useMemo(() => {
    // Get categories from both periods
    const allCategories = new Set<CategoryType>();
    
    currentPeriodTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        allCategories.add(transaction.category);
      }
    });
    
    previousPeriodTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        allCategories.add(transaction.category);
      }
    });
    
    // Calculate totals for each category in both periods
    const result = Array.from(allCategories).map(category => {
      const currentTotal = currentPeriodTransactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const previousTotal = previousPeriodTransactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const percentChange = previousTotal > 0 
        ? ((currentTotal - previousTotal) / previousTotal) * 100 
        : currentTotal > 0 ? 100 : 0;
        
      return {
        category,
        categoryName: getCategoryName(category),
        [currentPeriodLabel]: currentTotal,
        [previousPeriodLabel]: previousTotal,
        percentChange: Math.round(percentChange)
      };
    });
    
    // Sort by current period value
    return result.sort((a, b) => b[currentPeriodLabel] - a[currentPeriodLabel]).slice(0, 8);
  }, [currentPeriodTransactions, previousPeriodTransactions, currentPeriodLabel, previousPeriodLabel]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de Categorias de Despesas</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer
          config={{
            [currentPeriodLabel]: { color: "#EF4444" },
            [previousPeriodLabel]: { color: "#94A3B8" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
              />
              <YAxis 
                type="category" 
                dataKey="categoryName" 
                width={90}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Valor"]}
                labelFormatter={(label) => `Categoria: ${label}`}
              />
              <ChartLegend />
              <Bar dataKey={previousPeriodLabel} name={previousPeriodLabel} fill="var(--color-previousPeriodLabel)" />
              <Bar dataKey={currentPeriodLabel} name={currentPeriodLabel} fill="var(--color-currentPeriodLabel)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoryComparison;
