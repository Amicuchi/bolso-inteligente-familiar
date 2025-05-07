
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateForecast } from './utils/financeUtils';
import { toast } from 'sonner';
import type { Transaction, Budget, Goal, SavingsBox, ForecastData } from './types';

// Re-export all types from types.ts for backwards compatibility
export * from './types';

// Create the context type
interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  savingsBoxes: SavingsBox[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addSavingsBox: (box: Omit<SavingsBox, 'id' | 'transactions'>) => Promise<void>;
  updateSavingsBox: (box: SavingsBox) => Promise<void>;
  deleteSavingsBox: (id: string) => Promise<void>;
  addSavingsTransaction: (boxId: string, transaction: Omit<SavingsBox['transactions'][0], 'id'>) => Promise<void>;
  getRecurringTransactions: () => Transaction[];
  getForecast: (months: number) => ForecastData[];
  loading: {
    transactions: boolean;
    budgets: boolean;
    goals: boolean;
    savingsBoxes: boolean;
  }
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Create a provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for storing data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<Record<string, SavingsBox['transactions']>>({});
  
  // Loading states
  const [loading, setLoading] = useState({
    transactions: true,
    budgets: true,
    goals: true,
    savingsBoxes: true,
  });
  
  const { user } = useAuth();

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchBudgets();
      fetchGoals();
      fetchSavingsBoxes();
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setSavingsBoxes([]);
      setSavingsTransactions({});
    }
  }, [user]);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      // Convert database format to app format
      const formattedTransactions = data.map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        amount: Number(item.amount),
        date: item.date,
        category: item.category,
        description: item.description,
        tags: item.tags || [],
        isRecurring: item.is_recurring || false,
        frequency: item.frequency,
      }));
      
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  // Fetch budgets from Supabase
  const fetchBudgets = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, budgets: true }));
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('period', { ascending: false });
        
      if (error) throw error;
      
      // Convert database format to app format
      const formattedBudgets = data.map(item => ({
        id: item.id,
        category: item.category,
        amount: Number(item.amount),
        period: item.period,
      }));
      
      setBudgets(formattedBudgets);
    } catch (error: any) {
      console.error('Erro ao buscar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }));
    }
  };

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, goals: true }));
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('deadline', { ascending: true });
        
      if (error) throw error;
      
      // Convert database format to app format
      const formattedGoals = data.map(item => ({
        id: item.id,
        name: item.name,
        targetAmount: Number(item.target_amount),
        currentAmount: Number(item.current_amount),
        deadline: item.deadline,
        category: item.category,
        type: item.type as 'monthly-saving' | 'accumulated' | 'category-limit',
      }));
      
      setGoals(formattedGoals);
    } catch (error: any) {
      console.error('Erro ao buscar metas:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };

  // Fetch savings boxes and transactions from Supabase
  const fetchSavingsBoxes = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, savingsBoxes: true }));
      
      // Get savings boxes
      const { data: boxesData, error: boxesError } = await supabase
        .from('savings_boxes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (boxesError) throw boxesError;
      
      // Get all transactions for all boxes
      const boxIds = boxesData.map(box => box.id);
      
      if (boxIds.length > 0) {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('savings_transactions')
          .select('*')
          .in('box_id', boxIds)
          .order('date', { ascending: false });
          
        if (transactionsError) throw transactionsError;
        
        // Group transactions by box_id
        const transactionsByBoxId: Record<string, any[]> = {};
        
        transactionsData.forEach(transaction => {
          if (!transactionsByBoxId[transaction.box_id]) {
            transactionsByBoxId[transaction.box_id] = [];
          }
          
          transactionsByBoxId[transaction.box_id].push({
            id: transaction.id,
            amount: Number(transaction.amount),
            date: transaction.date,
            type: transaction.type,
            description: transaction.description,
          });
        });
        
        setSavingsTransactions(transactionsByBoxId);
      }
      
      // Format savings boxes with their transactions
      const formattedBoxes = boxesData.map(box => ({
        id: box.id,
        name: box.name,
        targetAmount: box.target_amount ? Number(box.target_amount) : undefined,
        currentAmount: Number(box.current_amount),
        transactions: (savingsTransactions[box.id] || []),
      }));
      
      setSavingsBoxes(formattedBoxes);
    } catch (error: any) {
      console.error('Erro ao buscar caixinhas:', error);
      toast.error('Erro ao carregar caixinhas de poupança');
    } finally {
      setLoading(prev => ({ ...prev, savingsBoxes: false }));
    }
  };

  // Transaction CRUD operations
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          description: transaction.description,
          tags: transaction.tags || [],
          is_recurring: transaction.isRecurring || false,
          frequency: transaction.frequency,
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      const newTransaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        amount: Number(data.amount),
        date: data.date,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
        isRecurring: data.is_recurring || false,
        frequency: data.frequency,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transação adicionada com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao adicionar transação:', error);
      toast.error('Erro ao adicionar transação');
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          description: transaction.description,
          tags: transaction.tags || [],
          is_recurring: transaction.isRecurring || false,
          frequency: transaction.frequency,
        })
        .eq('id', transaction.id);
        
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação excluída com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      throw error;
    }
  };

  // Budget CRUD operations
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      const newBudget = {
        id: data.id,
        category: data.category,
        amount: Number(data.amount),
        period: data.period,
      };
      
      setBudgets(prev => [newBudget, ...prev]);
      toast.success('Orçamento adicionado com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao adicionar orçamento:', error);
      toast.error('Erro ao adicionar orçamento');
      throw error;
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        })
        .eq('id', budget.id);
        
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBudgets(prev => prev.filter(b => b.id !== id));
      toast.success('Orçamento excluído com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error('Erro ao excluir orçamento');
      throw error;
    }
  };

  // Goal CRUD operations
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
          category: goal.category,
          type: goal.type,
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      const newGoal = {
        id: data.id,
        name: data.name,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        deadline: data.deadline,
        category: data.category,
        type: data.type as 'monthly-saving' | 'accumulated' | 'category-limit',
      };
      
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Meta adicionada com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao adicionar meta:', error);
      toast.error('Erro ao adicionar meta');
      throw error;
    }
  };

  const updateGoal = async (goal: Goal) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
          category: goal.category,
          type: goal.type,
        })
        .eq('id', goal.id);
        
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta excluída com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  };

  // SavingsBox CRUD operations
  const addSavingsBox = async (box: Omit<SavingsBox, 'id' | 'transactions'>) => {
    try {
      const { data, error } = await supabase
        .from('savings_boxes')
        .insert({
          name: box.name,
          target_amount: box.targetAmount,
          current_amount: box.currentAmount || 0,
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      const newBox = {
        id: data.id,
        name: data.name,
        targetAmount: data.target_amount ? Number(data.target_amount) : undefined,
        currentAmount: Number(data.current_amount),
        transactions: [],
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
      const { error } = await supabase
        .from('savings_boxes')
        .update({
          name: box.name,
          target_amount: box.targetAmount,
          current_amount: box.currentAmount,
        })
        .eq('id', box.id);
        
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('savings_boxes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSavingsBoxes(prev => prev.filter(b => b.id !== id));
      toast.success('Caixinha excluída com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao excluir caixinha:', error);
      toast.error('Erro ao excluir caixinha');
      throw error;
    }
  };

  // SavingsBox Transaction operations
  const addSavingsTransaction = async (boxId: string, transaction: Omit<SavingsBox['transactions'][0], 'id'>) => {
    try {
      // First, add the transaction to the database
      const { data, error } = await supabase
        .from('savings_transactions')
        .insert({
          box_id: boxId,
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
          description: transaction.description,
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Update the current amount of the savings box
      const box = savingsBoxes.find(b => b.id === boxId);
      if (!box) throw new Error('Caixinha não encontrada');
      
      const newAmount = transaction.type === 'deposit'
        ? box.currentAmount + transaction.amount
        : box.currentAmount - transaction.amount;
      
      const { error: updateError } = await supabase
        .from('savings_boxes')
        .update({ current_amount: newAmount })
        .eq('id', boxId);
        
      if (updateError) throw updateError;
      
      // Update local state
      const newTransaction = {
        id: data.id,
        amount: Number(data.amount),
        date: data.date,
        type: data.type as 'deposit' | 'withdrawal',
        description: data.description,
      };
      
      // Update the savings box in local state
      setSavingsBoxes(prev => 
        prev.map(b => {
          if (b.id === boxId) {
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
        getForecast,
        loading
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
