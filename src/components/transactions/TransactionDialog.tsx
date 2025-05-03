
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFinance, Transaction, CategoryType, TransactionType } from '@/context/FinanceContext';
import { getCategoryName } from '@/utils/categoryUtils';
import { toast } from '@/hooks/use-toast';

interface TransactionFormData {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: CategoryType;
}

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
  
  // Define form with default values
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: mode === 'edit' && transaction ? {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
    } : {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'expense' as TransactionType,
      category: 'other' as CategoryType,
    }
  });

  // Watch for the type field to update available categories
  const transactionType = watch('type');

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      // Wait a bit before resetting to avoid UI flicker
      const timer = setTimeout(() => {
        if (mode === 'edit' && transaction) {
          reset({
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
          });
        } else {
          reset({
            description: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            category: 'other',
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, reset, mode, transaction]);

  const onSubmit = (data: TransactionFormData) => {
    if (mode === 'add') {
      addTransaction({
        description: data.description,
        amount: Number(data.amount),
        date: data.date,
        type: data.type,
        category: data.category,
      });
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso."
      });
    } else if (mode === 'edit' && transaction) {
      updateTransaction({
        id: transaction.id,
        description: data.description,
        amount: Number(data.amount),
        date: data.date,
        type: data.type,
        category: data.category,
      });
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso."
      });
    }
    onOpenChange(false);
  };

  // Get categories based on transaction type
  const incomeCategories: CategoryType[] = [
    'salary', 'investments', 'gifts', 'other'
  ];
  
  const expenseCategories: CategoryType[] = [
    'food', 'transport', 'leisure', 'health', 'education', 
    'housing', 'utilities', 'clothing', 'other'
  ];

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Adicionar Transação' : 'Editar Transação'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <div className="col-span-3">
                <Select
                  defaultValue={mode === 'edit' && transaction ? transaction.type : 'expense'}
                  onValueChange={(value: TransactionType) => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de transação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <span className="text-sm text-destructive">O tipo é obrigatório</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...register('description', { required: true })}
              />
              {errors.description && (
                <div className="col-start-2 col-span-3 text-sm text-destructive">
                  A descrição é obrigatória
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Valor (R$)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="col-span-3"
                {...register('amount', { 
                  required: true,
                  valueAsNumber: true,
                  min: 0
                })}
              />
              {errors.amount && (
                <div className="col-start-2 col-span-3 text-sm text-destructive">
                  O valor deve ser maior que zero
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                {...register('date', { required: true })}
              />
              {errors.date && (
                <div className="col-start-2 col-span-3 text-sm text-destructive">
                  A data é obrigatória
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <div className="col-span-3">
                <Select
                  defaultValue={mode === 'edit' && transaction ? transaction.category : 'other'}
                  onValueChange={(value: CategoryType) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <span className="text-sm text-destructive">A categoria é obrigatória</span>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Adicionar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
