
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

export interface ForecastData {
  month: string; // Formato YYYY-MM
  income: number;
  expense: number;
  balance: number;
  categories: Record<CategoryType, number>;
}

// Finance Context Type
export interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  savingsBoxes: SavingsBox[];
  isLoading: boolean;
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
