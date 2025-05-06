
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Transaction, CategoryType } from '@/context/FinanceContext';
import { TransactionTypeField } from './form/TransactionTypeField';
import { AmountField } from './form/AmountField';
import { DateField } from './form/DateField';
import { CategoryField } from './form/CategoryField';
import { DescriptionField } from './form/DescriptionField';
import { TagsField } from './form/TagsField';
import { RecurringField } from './form/RecurringField';
import { FrequencyField } from './form/FrequencyField';
import { FormActions } from './form/FormActions';

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

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || 'expense',
      amount: initialData?.amount.toString() || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      category: initialData?.category || '',
      description: initialData?.description || '',
      tags: initialData?.tags || [],
      isRecurring: initialData?.isRecurring || false,
      frequency: initialData?.frequency || 'monthly'
    }
  });
  
  const isRecurring = form.watch('isRecurring');
  
  const handleSubmit = (data: FormData) => {
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
    
    onSubmit(newTransaction);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TransactionTypeField form={form} />
        <AmountField form={form} />
        <DateField form={form} />
        <CategoryField form={form} />
        <DescriptionField form={form} />
        <TagsField form={form} />
        <RecurringField form={form} />
        <FrequencyField form={form} visible={isRecurring} />
        <FormActions onCancel={onCancel} isEditing={!!initialData} />
      </form>
    </Form>
  );
};
