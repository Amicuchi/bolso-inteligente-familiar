
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useFinance, SavingsBox } from '@/context/FinanceContext';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for savings box form
const savingsBoxSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  hasTarget: z.boolean().default(false),
  targetAmount: z.union([
    z.number().positive('O valor deve ser maior que zero'),
    z.literal('')
  ]).optional(),
});

type SavingsBoxFormValues = z.infer<typeof savingsBoxSchema>;

interface SavingsBoxFormProps {
  existingBox?: SavingsBox;
  onSuccess: () => void;
}

const SavingsBoxForm: React.FC<SavingsBoxFormProps> = ({
  existingBox,
  onSuccess,
}) => {
  const { addSavingsBox, updateSavingsBox } = useFinance();
  const { toast } = useToast();
  
  const defaultValues: Partial<SavingsBoxFormValues> = {
    name: existingBox?.name || '',
    hasTarget: existingBox?.targetAmount !== undefined,
    targetAmount: existingBox?.targetAmount || '',
  };

  const form = useForm<SavingsBoxFormValues>({
    resolver: zodResolver(savingsBoxSchema),
    defaultValues,
  });

  const watchHasTarget = form.watch('hasTarget');

  const onSubmit = (data: SavingsBoxFormValues) => {
    try {
      if (existingBox) {
        // Update existing savings box
        updateSavingsBox({
          ...existingBox,
          name: data.name,
          targetAmount: data.hasTarget && data.targetAmount !== '' 
            ? Number(data.targetAmount) 
            : undefined,
        });
        toast({
          title: 'Caixinha atualizada',
          description: 'A caixinha foi atualizada com sucesso.',
        });
      } else {
        // Create new savings box
        addSavingsBox({
          name: data.name,
          targetAmount: data.hasTarget && data.targetAmount !== '' 
            ? Number(data.targetAmount) 
            : undefined,
          currentAmount: 0,
        });
        toast({
          title: 'Caixinha criada',
          description: 'A caixinha foi criada com sucesso.',
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a caixinha.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Caixinha</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Viagem para a praia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasTarget"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Definir meta</FormLabel>
                <FormDescription>
                  Defina um valor alvo para esta caixinha
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {watchHasTarget && (
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da meta</FormLabel>
                <FormControl>
                  <Input
                    type="number" 
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit">
            {existingBox ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SavingsBoxForm;
