
import React from 'react';
import { AutoRule } from '@/types/user';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CategoryType } from '@/context/types';
import { getAllCategoryNames } from '@/utils/categoryUtils';

const autoRuleSchema = z.object({
  name: z.string().min(1, { message: 'O nome da regra é obrigatório' }),
  description: z.string().optional(),
  conditionField: z.enum(['description', 'amount', 'date', 'category']),
  conditionOperator: z.enum(['contains', 'equals', 'greater_than', 'less_than', 'between']),
  conditionValue: z.string().min(1, { message: 'O valor da condição é obrigatório' }),
  conditionValueEnd: z.string().optional(),
  actionType: z.enum(['set_category', 'add_tag', 'notify']),
  actionValue: z.string().min(1, { message: 'O valor da ação é obrigatório' }),
});

type AutoRuleFormValues = z.infer<typeof autoRuleSchema>;

interface AutoRuleFormProps {
  rule?: AutoRule;
  onSubmit: (rule: Partial<AutoRule>) => void;
  onCancel: () => void;
}

export const AutoRuleForm: React.FC<AutoRuleFormProps> = ({
  rule,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<AutoRuleFormValues>({
    resolver: zodResolver(autoRuleSchema),
    defaultValues: rule
      ? {
          name: rule.name,
          description: rule.description || '',
          conditionField: rule.condition.field,
          conditionOperator: rule.condition.operator,
          conditionValue: Array.isArray(rule.condition.value) 
            ? String(rule.condition.value[0]) 
            : String(rule.condition.value),
          conditionValueEnd: Array.isArray(rule.condition.value) 
            ? String(rule.condition.value[1]) 
            : undefined,
          actionType: rule.action.type,
          actionValue: rule.action.value,
        }
      : {
          name: '',
          description: '',
          conditionField: 'description',
          conditionOperator: 'contains',
          conditionValue: '',
          conditionValueEnd: '',
          actionType: 'set_category',
          actionValue: '',
        },
  });

  // Observa o operador para mostrar o segundo campo de valor quando for "between"
  const conditionOperator = form.watch('conditionOperator');
  const conditionField = form.watch('conditionField');
  const actionType = form.watch('actionType');
  
  // Mapeia os campos para português
  const fieldOptions = [
    { value: 'description', label: 'Descrição' },
    { value: 'amount', label: 'Valor' },
    { value: 'date', label: 'Data' },
    { value: 'category', label: 'Categoria' },
  ];
  
  // Mapeia os operadores para português
  const operatorOptions = [
    { value: 'contains', label: 'Contém', applicableFields: ['description'] },
    { value: 'equals', label: 'É igual a', applicableFields: ['description', 'amount', 'category'] },
    { value: 'greater_than', label: 'É maior que', applicableFields: ['amount', 'date'] },
    { value: 'less_than', label: 'É menor que', applicableFields: ['amount', 'date'] },
    { value: 'between', label: 'Está entre', applicableFields: ['amount', 'date'] },
  ];
  
  // Filtra operadores com base no campo selecionado
  const filteredOperators = operatorOptions.filter(
    op => op.applicableFields.includes(conditionField)
  );
  
  // Mapeia os tipos de ação para português
  const actionTypeOptions = [
    { value: 'set_category', label: 'Definir categoria' },
    { value: 'add_tag', label: 'Adicionar etiqueta' },
    { value: 'notify', label: 'Enviar notificação' },
  ];

  // Obtém todas as categorias disponíveis
  const categories = getAllCategoryNames().map(category => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1)
  }));

  // Manipulador de envio do formulário
  const handleSubmit = (values: AutoRuleFormValues) => {
    // Corrigindo o tipo para a condição "between"
    let conditionValue: string | number | [string, string];
    
    if (values.conditionOperator === 'between' && values.conditionValueEnd) {
      conditionValue = [values.conditionValue, values.conditionValueEnd];
    } else {
      conditionValue = values.conditionValue;
    }
    
    // Converte o valor para número se o campo for "amount"
    const processedValue = values.conditionField === 'amount'
      ? (Array.isArray(conditionValue) 
          ? conditionValue.map(v => parseFloat(v)) as [number, number]
          : parseFloat(conditionValue))
      : conditionValue;
    
    const newRule: Partial<AutoRule> = {
      name: values.name,
      description: values.description || undefined,
      condition: {
        field: values.conditionField,
        operator: values.conditionOperator,
        value: processedValue,
      },
      action: {
        type: values.actionType,
        value: values.actionValue,
      },
      enabled: rule?.enabled ?? true,
    };
    
    onSubmit(newRule);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da regra</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Categorizar Mercado" {...field} />
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
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o propósito desta regra..."
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h4 className="font-medium">Condição</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="conditionField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Redefine o operador quando o campo muda
                      const validOperators = operatorOptions.filter(
                        op => op.applicableFields.includes(value)
                      );
                      if (validOperators.length > 0 && 
                          !validOperators.some(op => op.value === form.getValues('conditionOperator'))) {
                        form.setValue('conditionOperator', validOperators[0].value as any);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um campo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="conditionOperator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um operador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredOperators.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={`grid ${conditionOperator === 'between' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
            <FormField
              control={form.control}
              name="conditionValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {conditionOperator === 'between' ? 'Valor inicial' : 'Valor'}
                  </FormLabel>
                  <FormControl>
                    {conditionField === 'category' ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        placeholder="Valor da condição"
                        type={conditionField === 'amount' ? 'number' : 'text'}
                        {...field} 
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {conditionOperator === 'between' && (
              <FormField
                control={form.control}
                name="conditionValueEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor final</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Valor final"
                        type={conditionField === 'amount' ? 'number' : 'text'}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h4 className="font-medium">Ação</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="actionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de ação</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="actionValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da ação</FormLabel>
                  <FormControl>
                    {actionType === 'set_category' ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        placeholder={
                          actionType === 'add_tag' 
                            ? "Nome da etiqueta" 
                            : "Mensagem de notificação"
                        }
                        {...field} 
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {rule ? 'Salvar alterações' : 'Criar regra'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
