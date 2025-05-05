
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { categories } from '@/utils/categoryUtils';
import { useFinance } from '@/context/FinanceContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/ui/help-tooltip';

// Definir o esquema de validação
const transactionSchema = z.object({
  description: z.string().min(3, {
    message: 'A descrição deve ter pelo menos 3 caracteres.',
  }),
  amount: z.coerce.number().positive({
    message: 'O valor deve ser positivo.',
  }),
  date: z.string(),
  category: z.string().min(1, {
    message: 'Selecione uma categoria.',
  }),
  type: z.enum(['income', 'expense']),
});

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  transaction?: any;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onOpenChange,
  mode,
  transaction,
}) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Configurar o formulário com os valores padrão
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 10),
      category: '',
      type: 'expense',
    },
  });

  // Preencher o formulário com os dados da transação quando em modo de edição
  useEffect(() => {
    if (mode === 'edit' && transaction) {
      const { description, amount, date, category, type, tags = [] } = transaction;
      
      form.reset({
        description,
        amount,
        date: date.substring(0, 10),
        category,
        type,
      });
      
      setTags(tags || []);
    } else {
      form.reset({
        description: '',
        amount: 0,
        date: new Date().toISOString().substring(0, 10),
        category: '',
        type: 'expense',
      });
      setTags([]);
    }
  }, [form, mode, transaction, open]);

  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    if (mode === 'add') {
      // Adicionar nova transação
      addTransaction({
        ...data,
        id: Date.now().toString(),
        tags,
      });
      toast({
        title: 'Transação adicionada',
        description: 'A transação foi adicionada com sucesso.',
      });
    } else if (mode === 'edit' && transaction) {
      // Atualizar transação existente
      updateTransaction({
        ...transaction,
        ...data,
        tags,
      });
      toast({
        title: 'Transação atualizada',
        description: 'A transação foi atualizada com sucesso.',
      });
    }

    // Fechar o modal
    onOpenChange(false);
  };

  // Adicionar nova tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remover tag
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Lidar com a tecla Enter no campo de tag
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Adicionar Transação' : 'Editar Transação'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Preencha os campos para adicionar uma nova transação.'
              : 'Edite os campos para atualizar a transação.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Descrição
                    <HelpTooltip content="Descreva o propósito da transação. Ex: Supermercado, Salário, etc." />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da transação" {...field} />
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
                  <FormLabel className="flex items-center">
                    Valor
                    <HelpTooltip content="Informe o valor da transação. Use apenas números positivos." />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Data
                    <HelpTooltip content="Data em que a transação ocorreu." />
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tipo
                    <HelpTooltip content="Selecione se é uma receita (entrada) ou despesa (saída)." />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Categoria
                    <HelpTooltip content="Categorize sua transação para facilitar a análise posterior." />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="flex items-center">
                Tags
                <HelpTooltip content="Adicione tags para organizar melhor suas transações. Ex: Férias, Trabalho, Família." />
              </FormLabel>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Adicionar tag"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">{mode === 'add' ? 'Adicionar' : 'Atualizar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
