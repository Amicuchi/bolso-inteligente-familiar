import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFinance, Transaction, CategoryType } from '@/context/FinanceContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { TagInput } from '@/components/ui/tag-input';
import { Switch } from '@/components/ui/switch';
import { categories } from '@/utils/categoryUtils';
import HelpTooltip from '@/components/ui/help-tooltip';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, { message: 'Insira um valor válido' }),
  date: z.date(),
  category: z.string(),
  description: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres' }),
  tags: z.array(z.string()).optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['monthly', 'weekly', 'yearly']).optional()
});

type FormData = z.infer<typeof formSchema>;

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
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: transaction?.type || 'expense',
      amount: transaction?.amount.toString() || '',
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      category: transaction?.category || '',
      description: transaction?.description || '',
      tags: transaction?.tags || [],
      isRecurring: transaction?.isRecurring || false,
      frequency: transaction?.frequency || 'monthly'
    }
  });
  
  const isRecurring = form.watch('isRecurring');
  
  const onSubmit = (data: FormData) => {
    if (data.isRecurring && !data.frequency) {
      form.setError('frequency', { message: 'Selecione a frequência para transações recorrentes' });
      return;
    }
    
    const newTransaction: Omit<Transaction, 'id'> = {
      type: data.type,
      amount: parseFloat(data.amount),
      date: data.date.toISOString().split('T')[0],
      category: data.category as CategoryType,
      description: data.description,
      tags: data.tags,
      isRecurring: data.isRecurring,
      frequency: data.isRecurring ? data.frequency : undefined
    };
    
    if (mode === 'add') {
      addTransaction(newTransaction);
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso."
      });
    } else if (mode === 'edit' && transaction) {
      updateTransaction({ ...newTransaction, id: transaction.id });
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center">
                    Tipo de Transação
                    <HelpTooltip content="Selecione se a transação é uma receita (entrada de dinheiro) ou uma despesa (saída de dinheiro)." />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" id="income" />
                        </FormControl>
                        <FormLabel htmlFor="income">Receita</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" id="expense" />
                        </FormControl>
                        <FormLabel htmlFor="expense">Despesa</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Valor
                    <HelpTooltip content="Insira o valor da transação. Use um ponto (.) como separador decimal." />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Valor" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Data
                    <HelpTooltip content="Selecione a data em que a transação ocorreu." />
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      onSelect={field.onChange}
                      defaultDate={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Categoria
                    <HelpTooltip content="Selecione a categoria que melhor descreve a transação." />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Descrição
                    <HelpTooltip content="Adicione uma breve descrição para identificar a transação." />
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tags
                    <HelpTooltip content="Adicione tags para categorizar ainda mais suas transações (ex: 'Mercado', 'Aluguel')." />
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center">
                      Transação Recorrente
                      <HelpTooltip content="Marque esta opção se essa transação ocorre regularmente (ex: aluguel, salário)." />
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Esta transação se repete regularmente
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isRecurring && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Frequência
                      <HelpTooltip content="Com que frequência esta transação se repete." />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            
            <div className="flex justify-end space-x-2 pt-3">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {mode === 'add' ? 'Adicionar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
