
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import HelpTooltip from '@/components/ui/help-tooltip';

interface AmountFieldProps {
  form: any;
}

export const AmountField: React.FC<AmountFieldProps> = ({ form }) => {
  return (
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
  );
};
