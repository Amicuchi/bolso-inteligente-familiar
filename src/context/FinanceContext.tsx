
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { 
  FinanceContextType, 
  Transaction, 
  Budget, 
  Goal, 
  SavingsBox,
  CategoryType,
  TransactionType,
  ForecastData
} from './types';
import { toast } from 'sonner';
import { generateForecast } from '@/utils/forecastUtils';

// Mock initial data
const initialTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    amount: 5000,
    date: '2025-01-01',
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
    date: '2025-01-02',
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
    date: '2025-01-02',
    category: 'food',
    description: 'Compras do mês',
    tags: ['Mercado'],
    isRecurring: true,
    frequency: 'monthly'
  }
];

const initialBudgets: Budget[] = [
  {
    id: 'b1',
    category: 'food',
    amount: 500,
    period: '2025-01'
  },
  {
    id: 'b2',
    category: 'transport',
    amount: 300,
    period: '2025-01'
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
        date: '2025-01-01',
        type: 'deposit',
        description: 'Depósito inicial'
      }
    ]
  }
];

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load mock data when user logs in
  useEffect(() => {
    if (user) {
      setTransactions(initialTransactions);
      setBudgets(initialBudgets);
      setGoals(initialGoals);
      setSavingsBoxes(initialSavingsBoxes);
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setSavingsBoxes([]);
    }
  }, [user]);

  // Transaction CRUD operations (mock)
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const newTransaction = {
        ...transaction,
        id: uuidv4()
      };

      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transação adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      toast.error('Falha ao adicionar transação');
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
      toast.success('Transação atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação excluída com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      throw error;
    }
  };

  // Budget CRUD operations (mock)
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!user) return;

    try {
      const newBudget = {
        ...budget,
        id: uuidv4()
      };

      setBudgets(prev => [newBudget, ...prev]);
      toast.success('Orçamento adicionado com sucesso');
    } catch (error: any) {
      console.error('Error adding budget:', error.message);
      toast.error('Falha ao adicionar orçamento');
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      setBudgets(prev => 
        prev.map(b => b.id === budget.id ? budget : b)
      );
      toast.success('Orçamento atualizado com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar orçamento:', error);
      toast.error('Erro ao atualizar orçamento');
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      setBudgets(prev => prev.filter(b => b.id !== id));
      toast.success('Orçamento excluído com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error('Erro ao excluir orçamento');
      throw error;
    }
  };

  // Goal CRUD operations (mock)
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!user) return;

    try {
      const newGoal = {
        ...goal,
        id: uuidv4()
      };

      setGoals(prev => [newGoal, ...prev]);
      toast.success('Meta adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding goal:', error.message);
      toast.error('Falha ao adicionar meta');
    }
  };

  const updateGoal = async (goal: Goal) => {
    try {
      setGoals(prev => 
        prev.map(g => g.id === goal.id ? goal : g)
      );
      toast.success('Meta atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar meta:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta excluída com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  };

  // SavingsBox CRUD operations (mock)
  const addSavingsBox = async (box: Omit<SavingsBox, 'id' | 'transactions'>) => {
    if (!user) return;
    
    try {
      const newBox = {
        ...box,
        id: uuidv4(),
        transactions: []
      };
      
      setSavingsBoxes(prev => [newBox, ...prev]);
      toast.success('Caixinha criada com sucesso');
    } catch (error: any) {
      console.error('Erro ao criar caixinha:', error);
      toast.error('Erro ao criar caixinha');
      throw error;
    }
  };

  const updateSavingsBox = async (box: SavingsBox) => {
    try {
      setSavingsBoxes(prev => 
        prev.map(b => b.id === box.id ? box : b)
      );
      toast.success('Caixinha atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar caixinha:', error);
      toast.error('Erro ao atualizar caixinha');
      throw error;
    }
  };

  const deleteSavingsBox = async (id: string) => {
    try {
      setSavingsBoxes(prev => prev.filter(b => b.id !== id));
      toast.success('Caixinha excluída com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir caixinha:', error);
      toast.error('Erro ao excluir caixinha');
      throw error;
    }
  };

  const addSavingsTransaction = async (boxId: string, transaction: Omit<SavingsBox['transactions'][0], 'id'>) => {
    try {
      const newTransaction = {
        ...transaction,
        id: uuidv4()
      };
      
      setSavingsBoxes(prev => 
        prev.map(b => {
          if (b.id === boxId) {
            const newAmount = transaction.type === 'deposit'
              ? b.currentAmount + transaction.amount
              : b.currentAmount - transaction.amount;
            
            return {
              ...b,
              currentAmount: newAmount,
              transactions: [newTransaction, ...(b.transactions || [])],
            };
          }
          return b;
        })
      );
      
      toast.success('Transação registrada com sucesso');
    } catch (error: any) {
      console.error('Erro ao registrar transação:', error);
      toast.error('Erro ao registrar transação');
      throw error;
    }
  };

  // Get recurring transactions
  const getRecurringTransactions = () => {
    return transactions.filter(transaction => transaction.isRecurring);
  };

  // Generate financial forecast
  const getForecast = (months: number) => {
    const recurringTransactions = getRecurringTransactions();
    return generateForecast(months, recurringTransactions);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      goals,
      savingsBoxes,
      isLoading,
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
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

// Create a hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};

export type { Transaction, Budget, Goal, SavingsBox, CategoryType, TransactionType, ForecastData };
