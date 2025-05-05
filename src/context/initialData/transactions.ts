
import { Transaction } from '../FinanceContext';

export const initialTransactions: Transaction[] = [
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
