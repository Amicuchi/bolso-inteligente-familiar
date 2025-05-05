
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFinance, Transaction, CategoryType } from '@/context/FinanceContext';
import { TransactionForm } from './TransactionForm';
import { toast } from '@/hooks/use-toast';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  transaction?: Transaction;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onOpenChange,
  mode,
  transaction
}) => {
  const { addTransaction, updateTransaction } = useFinance();
  
  const handleSave = (formData: Omit<Transaction, 'id'>) => {
    if (mode === 'add') {
      addTransaction(formData);
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso."
      });
    } else if (mode === 'edit' && transaction) {
      updateTransaction({ ...formData, id: transaction.id });
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso."
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Adicionar Nova Transação' : 'Editar Transação'}
          </DialogTitle>
        </DialogHeader>
        
        <TransactionForm 
          initialData={transaction}
          onSubmit={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
