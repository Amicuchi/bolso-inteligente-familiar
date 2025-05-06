
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TagInput } from '@/components/ui/tag-input';
import HelpTooltip from '@/components/ui/help-tooltip';

interface TagsFieldProps {
  form: any;
}

export const TagsField: React.FC<TagsFieldProps> = ({ form }) => {
  return (
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
              value={field.value || []}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
