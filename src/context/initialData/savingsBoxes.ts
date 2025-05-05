
import { SavingsBox } from '../FinanceContext';

export const initialSavingsBoxes: SavingsBox[] = [
  {
    id: 'sb1',
    name: 'Reserva de emergência',
    targetAmount: 10000,
    currentAmount: 2000,
    transactions: [
      {
        id: 'sbt1',
        amount: 2000,
        date: '2025-05-01',
        type: 'deposit',
        description: 'Depósito inicial'
      }
    ]
  },
  {
    id: 'sb2',
    name: 'Viagem de férias',
    targetAmount: 5000,
    currentAmount: 1500,
    transactions: [
      {
        id: 'sbt2',
        amount: 1500,
        date: '2025-05-01',
        type: 'deposit',
        description: 'Depósito inicial'
      }
    ]
  }
];
