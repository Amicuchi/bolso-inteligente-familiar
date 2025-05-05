
import React, { createContext, useContext } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { useBudgets } from './hooks/useBudgets';
import { useGoals } from './hooks/useGoals';
import { useSavingsBoxes } from './hooks/useSavingsBoxes';
import { generateForecast } from './utils/financeUtils';
import { FinanceContextType } from './types';

// Re-export all types from types.ts for backwards compatibility
export * from './types';

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Create a provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks
  const transactionsHook = useTransactions();
  const budgetsHook = useBudgets();
  const goalsHook = useGoals();
  const savingsBoxesHook = useSavingsBoxes();

  // Generate financial forecast
  const getForecast = (months: number) => {
    const recurringTransactions = transactionsHook.getRecurringTransactions();
    return generateForecast(months, recurringTransactions);
  };

  return (
    <FinanceContext.Provider
      value={{
        ...transactionsHook,
        ...budgetsHook,
        ...goalsHook,
        ...savingsBoxesHook,
        getForecast
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Create a hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
