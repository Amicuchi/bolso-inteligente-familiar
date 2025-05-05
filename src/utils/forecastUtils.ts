
import { addMonths, format, parseISO } from 'date-fns';
import { Transaction, ForecastData, CategoryType } from '../context/FinanceContext';
import { ptBR } from 'date-fns/locale';

// Formata o mês em formato legível (ex: "Maio 2025")
export const formatMonth = (monthStr: string): string => {
  const date = parseISO(`${monthStr}-01`);
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

// Gera os próximos X meses a partir do mês atual
export const generateFutureMonths = (count: number): string[] => {
  const months: string[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const futureDate = addMonths(currentDate, i);
    months.push(format(futureDate, 'yyyy-MM'));
  }
  
  return months;
};

// Calcula a variação percentual entre dois valores
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
};

// Encontra as principais categorias de despesa em uma previsão
export const getTopExpenseCategories = (forecast: ForecastData[]): CategoryType[] => {
  if (forecast.length === 0) return [];
  
  // Soma as despesas por categoria em todos os meses
  const categorySums: Record<CategoryType, number> = {} as Record<CategoryType, number>;
  
  forecast.forEach(month => {
    Object.entries(month.categories).forEach(([category, amount]) => {
      const cat = category as CategoryType;
      if (!categorySums[cat]) categorySums[cat] = 0;
      categorySums[cat] += amount;
    });
  });
  
  // Ordena as categorias pelo total e retorna as principais
  return Object.entries(categorySums)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category as CategoryType);
};

// Calcula a taxa de poupança prevista (quanto sobrou dividido pela receita)
export const calculateSavingsRate = (forecast: ForecastData[]): number[] => {
  return forecast.map(month => {
    if (month.income === 0) return 0;
    return Math.round((month.balance / month.income) * 100);
  });
};
