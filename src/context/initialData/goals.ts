
import { Goal } from '../FinanceContext';

export const initialGoals: Goal[] = [
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
