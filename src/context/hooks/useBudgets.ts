
import { useState, useEffect } from 'react';
import { Budget } from '../types';
import { generateId } from '../utils/financeUtils';
import { initialBudgets } from '../initialData/budgets';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : initialBudgets;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

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

  return {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget
  };
};
