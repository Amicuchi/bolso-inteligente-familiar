
import { addMonths, format, parseISO } from 'date-fns';
import { Transaction, ForecastData, CategoryType } from '../context/types';

function initializeMonth(date: Date): ForecastData {
  const categories: Record<CategoryType, number> = {
    salary: 0,
    investments: 0,
    gifts: 0,
    food: 0,
    transport: 0,
    leisure: 0,
    health: 0,
    education: 0,
    housing: 0,
    utilities: 0,
    clothing: 0,
    other: 0
  };

  return {
    month: format(date, 'yyyy-MM'),
    income: 0,
    expense: 0,
    balance: 0,
    categories
  };
}

export const generateForecast = (months: number, recurringTransactions: Transaction[]): ForecastData[] => {
  const forecast: ForecastData[] = [];
  const startDate = new Date();
  
  // Initialize the forecast for the requested number of months
  for (let i = 0; i < months; i++) {
    const monthDate = addMonths(startDate, i);
    forecast.push(initializeMonth(monthDate));
  }
  
  // Process recurring transactions
  recurringTransactions.forEach(transaction => {
    const { type, amount, category, frequency = 'monthly' } = transaction;
    
    forecast.forEach((month, index) => {
      // Apply transaction based on frequency
      let shouldApply = false;
      
      switch (frequency) {
        case 'monthly':
          shouldApply = true;
          break;
        case 'weekly':
          // Apply weekly transactions 4 times per month
          for (let i = 0; i < 4; i++) {
            applyTransaction(month, type, amount, category);
          }
          shouldApply = false; // Already applied
          break;
        case 'yearly':
          // Apply yearly transactions only in the same month as the start date
          const transactionDate = parseISO(transaction.date);
          const forecastDate = addMonths(startDate, index);
          shouldApply = transactionDate.getMonth() === forecastDate.getMonth();
          break;
      }
      
      if (shouldApply) {
        applyTransaction(month, type, amount, category);
      }
    });
  });
  
  // Calculate balance for each month
  forecast.forEach((month, index) => {
    month.balance = month.income - month.expense;
    
    // Carry over balance from previous month
    if (index > 0) {
      month.balance += forecast[index - 1].balance;
    }
  });
  
  return forecast;
};

function applyTransaction(month: ForecastData, type: TransactionType, amount: number, category: CategoryType) {
  if (type === 'income') {
    month.income += amount;
    month.categories[category] += amount;
  } else {
    month.expense += amount;
    month.categories[category] += amount;
  }
}
