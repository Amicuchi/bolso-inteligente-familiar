import React, { createContext, useState, useContext, useEffect } from 'react';
import { categoryInfo } from '../utils/categoryUtils';

// Define types for our financial data
export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'salary' 
  | 'investments' 
  | 'gifts' 
  | 'food' 
  | 'transport' 
  | 'leisure' 
  | 'health' 
  | 'education' 
  | 'housing' 
  | 'utilities' 
  | 'clothing'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: CategoryType;
  description: string;
  tags?: string[];
  isRecurring?: boolean; // Indica se é uma transação recorrente
  frequency?: 'monthly' | 'weekly' | 'yearly'; // Frequência da recorrência
}

export interface Budget {
  id: string;
  category: CategoryType;
  amount: number;
  period: string; // YYYY-MM format
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD format
  category?: CategoryType;
  type: 'monthly-saving' | 'accumulated' | 'category-limit';
}

export interface SavingsBox {
  id: string;
  name: string;
  targetAmount?: number;
  currentAmount: number;
  transactions: {
    id: string;
    amount: number;
    date: string;
    type: 'deposit' | 'withdrawal';
    description: string;
  }[];
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  savingsBoxes: SavingsBox[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addSavingsBox: (box: Omit<SavingsBox, 'id' | 'transactions'>) => void;
  updateSavingsBox: (box: SavingsBox) => void;
  deleteSavingsBox: (id: string) => void;
  addSavingsTransaction: (boxId: string, transaction: Omit<SavingsBox['transactions'][0], 'id'>) => void;
  getRecurringTransactions: () => Transaction[];
  getForecast: (months: number) => ForecastData[];
}

export interface ForecastData {
  month: string; // Formato YYYY-MM
  income: number;
  expense: number;
  balance: number;
  categories: Record<CategoryType, number>;
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock data for initial state
const initialTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    amount: 5000,
    date: '2025-05-01',
    category: 'salary',
    description: 'Salário Mensal',
    tags: ['Fixo', 'Mensal'],
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    id: 't2',
    type: 'expense',
    amount: 1200,
    date: '2025-05-02',
    category: 'housing',
    description: 'Aluguel',
    tags: ['Fixo', 'Moradia'],
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    id: 't3',
    type: 'expense',
    amount: 320,
    date: '2025-05-02',
    category: 'food',
    description: 'Compras do mês',
    tags: ['Mercado'],
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    id: 't4',
    type: 'expense',
    amount: 150,
    date: '2025-05-02',
    category: 'transport',
    description: 'Combustível',
    tags: ['Carro'],
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    id: 't5',
    type: 'expense',
    amount: 80,
    date: '2025-05-03',
    category: 'leisure',
    description: 'Cinema',
    tags: ['Lazer']
  }
];

const initialBudgets: Budget[] = [
  {
    id: 'b1',
    category: 'food',
    amount: 500,
    period: '2025-05'
  },
  {
    id: 'b2',
    category: 'transport',
    amount: 300,
    period: '2025-05'
  },
  {
    id: 'b3',
    category: 'leisure',
    amount: 200,
    period: '2025-05'
  }
];

const initialGoals: Goal[] = [
  {
    id: 'g1',
    name: 'Fundo de emergência',
    targetAmount: 10000,
    currentAmount: 2000,
    deadline: '2025-12-31',
    type: 'accumulated'
  },
  {
    id: 'g2',
    name: 'Economizar por mês',
    targetAmount: 500,
    currentAmount: 0,
    deadline: '2025-05-31',
    type: 'monthly-saving'
  }
];

const initialSavingsBoxes: SavingsBox[] = [
  {
    id: 'sb1',
    name: 'Reserva de emergência',
    targetAmount: 10000,
    currentAmount: 2000,
    transactions: [
      {
        id: 'sbt1',
        amount: 2000,
        date: '2025-05-01',
        type: 'deposit',
        description: 'Depósito inicial'
      }
    ]
  },
  {
    id: 'sb2',
    name: 'Viagem de férias',
    targetAmount: 5000,
    currentAmount: 1500,
    transactions: [
      {
        id: 'sbt2',
        amount: 1500,
        date: '2025-05-01',
        type: 'deposit',
        description: 'Depósito inicial'
      }
    ]
  }
];

// Create a provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : initialBudgets;
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });
  
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>(() => {
    const saved = localStorage.getItem('savingsBoxes');
    return saved ? JSON.parse(saved) : initialSavingsBoxes;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('savingsBoxes', JSON.stringify(savingsBoxes));
  }, [savingsBoxes]);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: generateId() };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (goal: Goal) => {
    setGoals(goals.map(g => g.id === goal.id ? goal : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Savings box functions
  const addSavingsBox = (box: Omit<SavingsBox, 'id' | 'transactions'>) => {
    const newBox = { ...box, id: generateId(), transactions: [] };
    setSavingsBoxes([...savingsBoxes, newBox]);
  };

  const updateSavingsBox = (box: SavingsBox) => {
    setSavingsBoxes(savingsBoxes.map(b => b.id === box.id ? box : b));
  };

  const deleteSavingsBox = (id: string) => {
    setSavingsBoxes(savingsBoxes.filter(b => b.id !== id));
  };

  const addSavingsTransaction = (
    boxId: string, 
    transaction: Omit<SavingsBox['transactions'][0], 'id'>
  ) => {
    const boxIndex = savingsBoxes.findIndex(b => b.id === boxId);
    if (boxIndex === -1) return;
    
    const box = savingsBoxes[boxIndex];
    const newTransaction = { ...transaction, id: generateId() };
    const newAmount = transaction.type === 'deposit' 
      ? box.currentAmount + transaction.amount 
      : box.currentAmount - transaction.amount;
    
    const updatedBox = {
      ...box,
      transactions: [...box.transactions, newTransaction],
      currentAmount: newAmount
    };
    
    const newBoxes = [...savingsBoxes];
    newBoxes[boxIndex] = updatedBox;
    setSavingsBoxes(newBoxes);
  };

  // Get recurring transactions
  const getRecurringTransactions = () => {
    return transactions.filter(transaction => transaction.isRecurring);
  };

  // Generate financial forecast
  const getForecast = (months: number): ForecastData[] => {
    const currentDate = new Date();
    const forecast: ForecastData[] = [];
    const recurringTransactions = getRecurringTransactions();
    
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

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        savingsBoxes,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        addSavingsBox,
        updateSavingsBox,
        deleteSavingsBox,
        addSavingsTransaction,
        getRecurringTransactions,
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
