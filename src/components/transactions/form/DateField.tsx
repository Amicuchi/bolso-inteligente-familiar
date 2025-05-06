
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import HelpTooltip from '@/components/ui/help-tooltip';

interface DateFieldProps {
  form: any;
}

export const DateField: React.FC<DateFieldProps> = ({ form }) => {
  return (
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
  );
};
