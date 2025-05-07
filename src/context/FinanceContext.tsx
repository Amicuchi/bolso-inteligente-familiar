import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { 
  FinanceContextType, 
  Transaction, 
  Budget, 
  Goal, 
  SavingsBox,
  CategoryType,
  TransactionType
} from './types';
import { toast } from 'sonner';

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase when user changes
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
    }
  }, [user]);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      if (data) {
        // Convert Supabase data format to our app format
        const formattedData: Transaction[] = data.map(item => ({
          id: item.id,
          type: item.type as TransactionType,
          amount: item.amount,
          date: item.date,
          category: item.category as CategoryType,
          description: item.description,
          tags: item.tags || [],
          isRecurring: item.is_recurring || false,
          frequency: item.frequency || undefined,
        }));
        
        setTransactions(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
      toast.error('Falha ao buscar transações');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch budgets from Supabase
  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      if (data) {
        // Convert Supabase data format to our app format
        const formattedData: Budget[] = data.map(item => ({
          id: item.id,
          category: item.category as CategoryType,
          amount: item.amount,
          period: item.period,
        }));
        
        setBudgets(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching budgets:', error.message);
      toast.error('Falha ao buscar orçamentos');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      if (data) {
        // Convert Supabase data format to our app format
        const formattedData: Goal[] = data.map(item => ({
          id: item.id,
          name: item.name,
          targetAmount: item.target_amount,
          currentAmount: item.current_amount,
          deadline: item.deadline,
          category: item.category as CategoryType | undefined,
          type: item.type as 'monthly-saving' | 'accumulated' | 'category-limit',
        }));
        
        setGoals(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error.message);
      toast.error('Falha ao buscar metas');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch savings boxes from Supabase
  const fetchSavingsBoxes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('savings_boxes')
        .select(`
          *,
          savings_transactions(*)
        `)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      if (data) {
        // Convert Supabase data format to our app format
        const formattedData: SavingsBox[] = data.map(item => ({
          id: item.id,
          name: item.name,
          targetAmount: item.target_amount,
          currentAmount: item.current_amount,
          transactions: item.savings_transactions ? item.savings_transactions.map((trans: any) => ({
            id: trans.id,
            amount: trans.amount,
            date: trans.date,
            type: trans.type as 'deposit' | 'withdrawal',
            description: trans.description,
          })) : [],
        }));
        
        setSavingsBoxes(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching savings boxes:', error.message);
      toast.error('Falha ao buscar caixas de poupança');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      // Format data for Supabase
      const newTransaction = {
        user_id: user.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
        tags: transaction.tags || [],
        isRecurring: transaction.isRecurring || false,
        frequency: transaction.frequency || null,
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Add the new transaction to state
        setTransactions(prev => [...prev, {
          id: data.id,
          type: data.type as TransactionType,
          amount: data.amount,
          date: data.date,
          category: data.category as CategoryType,
          description: data.description,
          tags: data.tags || [],
          isRecurring: data.is_recurring || false,
          frequency: data.frequency || undefined,
        }]);
      }
      
      toast.success('Transação adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      toast.error('Falha ao adicionar transação');
    }
  };

  // Add a new budget
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!user) return;

    try {
      // Format data for Supabase
      const newBudget = {
        user_id: user.id,
        category: budget.category,
        amount: budget.amount,
        period: budget.period
      };

      const { data, error } = await supabase
        .from('budgets')
        .insert([newBudget])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Add the new budget to state
        setBudgets(prev => [...prev, {
          id: data.id,
          category: data.category as CategoryType,
          amount: data.amount,
          period: data.period
        }]);
      }
      
      toast.success('Orçamento adicionado com sucesso');
    } catch (error: any) {
      console.error('Error adding budget:', error.message);
      toast.error('Falha ao adicionar orçamento');
    }
  };

  // Add a new goal
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!user) return;

    try {
      // Format data for Supabase
      const newGoal = {
        user_id: user.id,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        deadline: goal.deadline,
        category: goal.category || null,
        type: goal.type
      };

      const { data, error } = await supabase
        .from('goals')
        .insert([newGoal])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Add the new goal to state
        setGoals(prev => [...prev, {
          id: data.id,
          name: data.name,
          targetAmount: data.target_amount,
          currentAmount: data.current_amount,
          deadline: data.deadline,
          category: data.category as CategoryType | undefined,
          type: data.type as 'monthly-saving' | 'accumulated' | 'category-limit'
        }]);
      }
      
      toast.success('Meta adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding goal:', error.message);
      toast.error('Falha ao adicionar meta');
    }
  };

  // Transaction CRUD operations
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
    <FinanceContext.Provider value={{
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
      isLoading
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
