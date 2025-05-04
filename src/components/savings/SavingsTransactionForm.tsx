
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for savings transaction form
const savingsTransactionSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['deposit', 'withdrawal']),
});

type SavingsTransactionFormValues = z.infer<typeof savingsTransactionSchema>;

interface SavingsTransactionFormProps {
  boxId: string;
  onSuccess: () => void;
}

const SavingsTransactionForm: React.FC<SavingsTransactionFormProps> = ({
  boxId,
  onSuccess,
}) => {
  const { addSavingsTransaction, savingsBoxes } = useFinance();
  const { toast } = useToast();

  const currentBox = savingsBoxes.find(box => box.id === boxId);
  
  const form = useForm<SavingsTransactionFormValues>({
    resolver: zodResolver(savingsTransactionSchema),
    defaultValues: {
      amount: undefined,
      description: '',
      type: 'deposit',
    },
  });

  const onSubmit = (data: SavingsTransactionFormValues) => {
    try {
      // Check if withdrawal exceeds available balance
      if (data.type === 'withdrawal' && currentBox && data.amount > currentBox.currentAmount) {
        toast({
          title: 'Erro',
          description: 'O valor de retirada não pode ser maior que o saldo disponível.',
          variant: 'destructive',
        });
        return;
      }

      addSavingsTransaction(boxId, {
        amount: data.amount,
        description: data.description,
        type: data.type,
        date: new Date().toISOString().split('T')[0],
      });

      toast({
        title: 'Transação registrada',
        description: 'A transação foi registrada com sucesso.',
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao registrar a transação.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transação</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="deposit" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Depósito
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="withdrawal" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Retirada
                    </FormLabel>
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
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Depósito mensal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Transação
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SavingsTransactionForm;
