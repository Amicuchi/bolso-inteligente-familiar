
import { useState, useEffect } from 'react';
import { SavingsBox } from '../types';
import { generateId } from '../utils/financeUtils';
import { initialSavingsBoxes } from '../initialData/savingsBoxes';

export const useSavingsBoxes = () => {
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>(() => {
    const saved = localStorage.getItem('savingsBoxes');
    return saved ? JSON.parse(saved) : initialSavingsBoxes;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('savingsBoxes', JSON.stringify(savingsBoxes));
  }, [savingsBoxes]);

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

  return {
    savingsBoxes,
    addSavingsBox,
    updateSavingsBox,
    deleteSavingsBox,
    addSavingsTransaction
  };
};
