
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import HelpTooltip from '@/components/ui/help-tooltip';

interface RecurringFieldProps {
  form: any;
}

export const RecurringField: React.FC<RecurringFieldProps> = ({ form }) => {
  return (
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
  );
};
