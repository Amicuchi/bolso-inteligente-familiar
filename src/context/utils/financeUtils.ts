
import { CategoryType, ForecastData, Transaction } from '../types';
import { categoryInfo } from '@/utils/categoryUtils';

// Generate a unique ID
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate financial forecast
export const generateForecast = (months: number, recurringTransactions: Transaction[]): ForecastData[] => {
  const currentDate = new Date();
  const forecast: ForecastData[] = [];
  
  // Inicializa categorias com valor zero
  const initCategories = () => {
    const categories: Record<CategoryType, number> = {} as Record<CategoryType, number>;
    Object.keys(categoryInfo).forEach(category => {
      categories[category as CategoryType] = 0;
    });
    return categories;
  };

  // Para cada mês futuro
  for (let i = 0; i < months; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    
    const monthStr = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
    
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    const monthlyCategories = initCategories();
    
    // Adiciona transações recorrentes para este mês de previsão
    recurringTransactions.forEach(transaction => {
      if (transaction.frequency === 'monthly') {
        // Para transações mensais, adicionamos uma vez por mês de previsão
        if (transaction.type === 'income') {
          monthlyIncome += transaction.amount;
        } else {
          monthlyExpense += transaction.amount;
        }
        
        // Adiciona ao total da categoria
        monthlyCategories[transaction.category] += transaction.amount;
      } else if (transaction.frequency === 'yearly') {
        // Para transações anuais, verificamos se o mês coincide
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === forecastDate.getMonth()) {
          if (transaction.type === 'income') {
            monthlyIncome += transaction.amount;
          } else {
            monthlyExpense += transaction.amount;
          }
          
          // Adiciona ao total da categoria
          monthlyCategories[transaction.category] += transaction.amount;
        }
      }
      // Poderíamos adicionar lógica para frequência semanal se necessário
    });
    
    forecast.push({
      month: monthStr,
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense,
      categories: monthlyCategories
    });
  }
  
  return forecast;
};
