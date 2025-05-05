
import { useState, useEffect } from 'react';
import { Goal } from '../types';
import { generateId } from '../utils/financeUtils';
import { initialGoals } from '../initialData/goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

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

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal
  };
};
