
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFinance, Budget, CategoryType } from '@/context/FinanceContext';
import { getCategoryName } from '@/utils/categoryUtils';
import { formatCurrency } from '@/utils/format';
import DeleteConfirmationDialog from '@/components/transactions/DeleteConfirmationDialog';

// Create schema for budget form validation
const budgetFormSchema = z.object({
  category: z.string(),
  amount: z.coerce.number().positive('O valor deve ser positivo'),
  period: z.string(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

const BudgetsPage = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinance();
  const { toast } = useToast();

  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Current period budgets
  const periodBudgets = budgets.filter((budget) => budget.period === currentMonth);

  // Form setup
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: 'food',
      amount: 0,
      period: currentMonth,
    },
  });

  // Handle budget edit
  const handleEditBudget = (budget: Budget) => {
    setCurrentBudget(budget);
    form.reset({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
    });
    setIsDialogOpen(true);
  };

  // Handle budget delete
  const handleDeleteBudget = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (currentBudget) {
      deleteBudget(currentBudget.id);
      toast({
        title: "Orçamento excluído",
        description: `Orçamento para ${getCategoryName(currentBudget.category)} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle form submission
  const onSubmit = (values: BudgetFormValues) => {
    if (currentBudget) {
      // Update existing budget
      updateBudget({
        ...currentBudget,
        category: values.category as CategoryType,
        amount: values.amount,
        period: values.period,
      });
      toast({
        title: "Orçamento atualizado",
        description: "Seu orçamento foi atualizado com sucesso.",
      });
    } else {
      // Add new budget
      addBudget({
        category: values.category as CategoryType,
        amount: values.amount,
        period: values.period,
      });
      toast({
        title: "Orçamento criado",
        description: "Novo orçamento foi criado com sucesso.",
      });
    }
    setIsDialogOpen(false);
    setCurrentBudget(null);
    form.reset({
      category: 'food',
      amount: 0,
      period: currentMonth,
    });
  };

  // Open form for new budget
  const openNewBudgetForm = () => {
    setCurrentBudget(null);
    form.reset({
      category: 'food',
      amount: 0,
      period: currentMonth,
    });
    setIsDialogOpen(true);
  };

  // Format month for display
  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orçamentos</CardTitle>
            <div className="flex space-x-2">
              <Input
                type="month"
                value={currentMonth}
                onChange={handleMonthChange}
                className="w-48"
              />
              <Button onClick={openNewBudgetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {periodBudgets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor Orçado</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>{getCategoryName(budget.category)}</TableCell>
                      <TableCell>{formatCurrency(budget.amount)}</TableCell>
                      <TableCell>{formatMonth(budget.period)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditBudget(budget)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteBudget(budget)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum orçamento definido para {formatMonth(currentMonth)}.
                </p>
                <Button onClick={openNewBudgetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Orçamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Dialog for adding/editing budgets */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
              </DialogTitle>
              <DialogDescription>
                {currentBudget
                  ? 'Atualize os detalhes deste orçamento.'
                  : 'Adicione um novo orçamento ao seu plano financeiro.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Alimentação</SelectItem>
                            <SelectItem value="transport">Transporte</SelectItem>
                            <SelectItem value="leisure">Lazer</SelectItem>
                            <SelectItem value="health">Saúde</SelectItem>
                            <SelectItem value="education">Educação</SelectItem>
                            <SelectItem value="housing">Moradia</SelectItem>
                            <SelectItem value="utilities">Contas</SelectItem>
                            <SelectItem value="clothing">Vestuário</SelectItem>
                            <SelectItem value="other">Outros</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período</FormLabel>
                      <FormControl>
                        <Input
                          type="month"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    {currentBudget ? 'Atualizar' : 'Adicionar'} Orçamento
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Confirmation dialog for deleting budgets */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default BudgetsPage;
