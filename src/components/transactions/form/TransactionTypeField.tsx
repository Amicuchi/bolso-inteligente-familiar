
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import HelpTooltip from '@/components/ui/help-tooltip';

interface TransactionTypeFieldProps {
  form: any;
}

export const TransactionTypeField: React.FC<TransactionTypeFieldProps> = ({ form }) => {
  return (
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
  );
};
