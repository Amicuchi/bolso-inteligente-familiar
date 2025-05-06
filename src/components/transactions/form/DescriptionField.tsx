
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import HelpTooltip from '@/components/ui/help-tooltip';

interface DescriptionFieldProps {
  form: any;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
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
  );
};
