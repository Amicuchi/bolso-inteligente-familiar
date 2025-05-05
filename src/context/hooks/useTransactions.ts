
import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { generateId } from '../utils/financeUtils';
import { initialTransactions } from '../initialData/transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  // Get recurring transactions
  const getRecurringTransactions = () => {
    return transactions.filter(transaction => transaction.isRecurring);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getRecurringTransactions
  };
};
