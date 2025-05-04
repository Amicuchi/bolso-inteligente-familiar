
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, Plus, Target, TrendingUp } from 'lucide-react';
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
import { useFinance, Goal, CategoryType } from '@/context/FinanceContext';
import { getCategoryName } from '@/utils/categoryUtils';
import { formatCurrency, formatDate, calculatePercentage } from '@/utils/format';
import DeleteConfirmationDialog from '@/components/transactions/DeleteConfirmationDialog';
import { Progress } from '@/components/ui/progress';

// Create schema for goal form validation
const goalFormSchema = z.object({
  name: z.string().min(1, 'Nome da meta é obrigatório'),
  targetAmount: z.coerce.number().positive('O valor deve ser positivo'),
  currentAmount: z.coerce.number().min(0, 'O valor não pode ser negativo'),
  deadline: z.string().min(1, 'Data limite é obrigatória'),
  type: z.enum(['monthly-saving', 'accumulated', 'category-limit']),
  category: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const GoalsPage = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const { toast } = useToast();

  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Filter goals based on type
  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(goal => goal.type === filter);

  // Form setup
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      type: 'accumulated',
      category: undefined,
    },
  });

  // Handle goal edit
  const handleEditGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    form.reset({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      type: goal.type,
      category: goal.category,
    });
    setIsDialogOpen(true);
  };

  // Handle goal delete
  const handleDeleteGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (currentGoal) {
      deleteGoal(currentGoal.id);
      toast({
        title: "Meta excluída",
        description: `A meta "${currentGoal.name}" foi removida com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  // Open form for new goal
  const openNewGoalForm = () => {
    setCurrentGoal(null);
    form.reset({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      type: 'accumulated',
      category: undefined,
    });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (values: GoalFormValues) => {
    if (currentGoal) {
      // Update existing goal
      updateGoal({
        ...currentGoal,
        name: values.name,
        targetAmount: values.targetAmount,
        currentAmount: values.currentAmount,
        deadline: values.deadline,
        type: values.type,
        category: values.category as CategoryType | undefined,
      });
      toast({
        title: "Meta atualizada",
        description: "Sua meta foi atualizada com sucesso.",
      });
    } else {
      // Add new goal
      addGoal({
        name: values.name,
        targetAmount: values.targetAmount,
        currentAmount: values.currentAmount,
        deadline: values.deadline,
        type: values.type,
        category: values.category as CategoryType | undefined,
      });
      toast({
        title: "Meta criada",
        description: "Nova meta foi criada com sucesso.",
      });
    }
    setIsDialogOpen(false);
    setCurrentGoal(null);
  };

  // Function to get goal icon based on type
  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'monthly-saving':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'category-limit':
        return <Target className="h-4 w-4 mr-2" />;
      default:
        return <Target className="h-4 w-4 mr-2" />;
    }
  };

  // Function to get goal type name
  const getGoalTypeName = (type: string) => {
    switch (type) {
      case 'monthly-saving':
        return 'Economia Mensal';
      case 'accumulated':
        return 'Meta Acumulada';
      case 'category-limit':
        return 'Limite por Categoria';
      default:
        return type;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Metas Financeiras</CardTitle>
            <div className="flex space-x-2">
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as metas</SelectItem>
                  <SelectItem value="accumulated">Metas Acumuladas</SelectItem>
                  <SelectItem value="monthly-saving">Economia Mensal</SelectItem>
                  <SelectItem value="category-limit">Limite por Categoria</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openNewGoalForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredGoals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Data Limite</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.map((goal) => {
                    const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
                    return (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <div className="font-medium">{goal.name}</div>
                          {goal.category && (
                            <div className="text-sm text-muted-foreground">
                              Categoria: {getCategoryName(goal.category)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getGoalIcon(goal.type)}
                            <span>{getGoalTypeName(goal.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{formatCurrency(goal.currentAmount)}</span>
                              <span>{formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="text-xs text-right">{percentage}%</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(goal.deadline)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditGoal(goal)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeleteGoal(goal)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? 'Não existem metas definidas.' 
                    : `Não existem metas do tipo ${getGoalTypeName(filter)}.`}
                </p>
                <Button onClick={openNewGoalForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Meta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog for adding/editing goals */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentGoal ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
              <DialogDescription>
                {currentGoal
                  ? 'Atualize os detalhes desta meta financeira.'
                  : 'Adicione uma nova meta ao seu planejamento financeiro.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Meta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Fundo de emergência" {...field} />
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
                      <FormLabel>Tipo de Meta</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de meta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accumulated">Meta Acumulada</SelectItem>
                            <SelectItem value="monthly-saving">Economia Mensal</SelectItem>
                            <SelectItem value="category-limit">Limite por Categoria</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('type') === 'category-limit' && (
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
                )}

                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Alvo</FormLabel>
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
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Atual</FormLabel>
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
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Limite</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    {currentGoal ? 'Atualizar' : 'Adicionar'} Meta
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Confirmation dialog for deleting goals */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default GoalsPage;
