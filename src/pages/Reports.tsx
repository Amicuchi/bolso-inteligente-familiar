
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinance } from '@/context/FinanceContext';
import { 
  getCurrentMonth, 
  getFirstDayOfMonth, 
  getLastDayOfMonth, 
  formatMonthShort,
  formatCurrency
} from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';
import { Progress } from '@/components/ui/progress';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import MonthSelector from '@/components/reports/MonthSelector';
import IncomeExpenseChart from '@/components/reports/IncomeExpenseChart';
import SavingsReport from '@/components/reports/SavingsReport';
import HelpTooltip from '@/components/ui/help-tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReportsPage = () => {
  const { transactions, budgets, goals, savingsBoxes } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonth());
  
  // Filter transactions for the selected period
  const filteredTransactions = useMemo(() => {
    const firstDay = getFirstDayOfMonth(selectedPeriod);
    const lastDay = getLastDayOfMonth(selectedPeriod);
    return transactions.filter(
      transaction => transaction.date >= firstDay && transaction.date <= lastDay
    );
  }, [transactions, selectedPeriod]);

  // Get previous month transactions
  const previousPeriod = useMemo(() => {
    const [year, month] = selectedPeriod.split('-').map(Number);
    let prevMonth = month - 1;
    let prevYear = year;
    
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear = year - 1;
    }
    
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  }, [selectedPeriod]);

  const previousTransactions = useMemo(() => {
    const firstDay = getFirstDayOfMonth(previousPeriod);
    const lastDay = getLastDayOfMonth(previousPeriod);
    return transactions.filter(
      transaction => transaction.date >= firstDay && transaction.date <= lastDay
    );
  }, [transactions, previousPeriod]);

  // Calculate period totals
  const periodTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    });
    
    let prevIncome = 0;
    let prevExpense = 0;
    
    previousTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        prevIncome += transaction.amount;
      } else {
        prevExpense += transaction.amount;
      }
    });
    
    const incomeChange = prevIncome === 0 ? 100 : ((income - prevIncome) / prevIncome) * 100;
    const expenseChange = prevExpense === 0 ? 100 : ((expense - prevExpense) / prevExpense) * 100;
    const balance = income - expense;
    const prevBalance = prevIncome - prevExpense;
    const balanceChange = prevBalance === 0 ? 100 : ((balance - prevBalance) / Math.abs(prevBalance)) * 100;
    
    return {
      income,
      expense,
      balance,
      savings: savingsBoxes.reduce((total, box) => total + box.currentAmount, 0),
      incomeChange,
      expenseChange,
      balanceChange,
      prevIncome,
      prevExpense,
      prevBalance
    };
  }, [filteredTransactions, previousTransactions, savingsBoxes]);

  // Group transactions by category for the selected period
  const categoryTotals = useMemo(() => {
    const totals = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        if (!totals[transaction.category]) {
          totals[transaction.category] = 0;
        }
        totals[transaction.category] += transaction.amount;
      }
    });
    
    return Object.entries(totals)
      .map(([category, amount]) => ({ 
        category, 
        categoryName: getCategoryName(category), 
        amount: amount as number,
        percentage: (amount as number) / periodTotals.expense * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, periodTotals.expense]);

  // Group transactions by tags
  const tagTotals = useMemo(() => {
    const totals = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.tags && transaction.tags.length > 0) {
        transaction.tags.forEach(tag => {
          if (!totals[tag]) {
            totals[tag] = {
              income: 0,
              expense: 0,
              count: 0
            };
          }
          
          if (transaction.type === 'income') {
            totals[tag].income += transaction.amount;
          } else {
            totals[tag].expense += transaction.amount;
          }
          
          totals[tag].count += 1;
        });
      }
    });
    
    return Object.entries(totals)
      .map(([tag, data]) => ({ 
        tag, 
        ...data as { income: number, expense: number, count: number },
        net: (data as any).income - (data as any).expense
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTransactions]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">Relatórios Financeiros</h1>
            <HelpTooltip content="Visualize e analise seus dados financeiros em diferentes perspectivas. Use o seletor de mês para mudar o período." />
          </div>
          <MonthSelector 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                Receitas
                <HelpTooltip content="Total de receitas no período selecionado." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-income">{formatCurrency(periodTotals.income)}</span>
                <div className="flex items-center text-sm">
                  {periodTotals.incomeChange > 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-income" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-expense" />
                  )}
                  <span className={periodTotals.incomeChange > 0 ? "text-income" : "text-expense"}>
                    {Math.abs(periodTotals.incomeChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs {formatCurrency(periodTotals.prevIncome)} mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                Despesas
                <HelpTooltip content="Total de despesas no período selecionado." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-expense">{formatCurrency(periodTotals.expense)}</span>
                <div className="flex items-center text-sm">
                  {periodTotals.expenseChange < 0 ? (
                    <TrendingDown className="mr-1 h-4 w-4 text-income" />
                  ) : (
                    <TrendingUp className="mr-1 h-4 w-4 text-expense" />
                  )}
                  <span className={periodTotals.expenseChange < 0 ? "text-income" : "text-expense"}>
                    {Math.abs(periodTotals.expenseChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs {formatCurrency(periodTotals.prevExpense)} mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                Saldo
                <HelpTooltip content="Diferença entre receitas e despesas no período." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${periodTotals.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(periodTotals.balance)}
                </span>
                <div className="flex items-center text-sm">
                  {periodTotals.balanceChange > 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-income" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-expense" />
                  )}
                  <span className={periodTotals.balanceChange > 0 ? "text-income" : "text-expense"}>
                    {Math.abs(periodTotals.balanceChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs {formatCurrency(periodTotals.prevBalance)} mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monthly">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="category">Por Categoria</TabsTrigger>
            <TabsTrigger value="tags">Por Tags</TabsTrigger>
            <TabsTrigger value="savings">Poupanças</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Resumo do Mês {formatMonthShort(selectedPeriod)}
                  <HelpTooltip content="Visão geral das receitas e despesas do mês selecionado." />
                </CardTitle>
                <CardDescription>
                  Análise detalhada do fluxo financeiro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <IncomeExpenseChart 
                  transactions={filteredTransactions} 
                  periodTotals={periodTotals}
                  period={formatMonthShort(selectedPeriod)}
                />
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    Indicadores Financeiros
                    <HelpTooltip content="Métricas importantes para avaliar sua saúde financeira." />
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">Taxa de Poupança</span>
                          <HelpTooltip content="Porcentagem da receita que foi economizada no período." />
                        </div>
                        <span className="text-sm font-medium">
                          {periodTotals.income > 0 
                            ? ((periodTotals.income - periodTotals.expense) / periodTotals.income * 100).toFixed(1) 
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={periodTotals.income > 0 
                          ? Math.min(((periodTotals.income - periodTotals.expense) / periodTotals.income * 100), 100) 
                          : 0} 
                        className="h-2"
                        indicatorClassName="bg-income"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">Comprometimento da Renda</span>
                          <HelpTooltip content="Porcentagem da receita que foi gasta com despesas." />
                        </div>
                        <span className="text-sm font-medium">
                          {periodTotals.income > 0 
                            ? (periodTotals.expense / periodTotals.income * 100).toFixed(1) 
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={periodTotals.income > 0 
                          ? Math.min((periodTotals.expense / periodTotals.income * 100), 100) 
                          : 0} 
                        className="h-2"
                        indicatorClassName={`${
                          (periodTotals.expense / periodTotals.income) < 0.7 
                            ? "bg-income" 
                            : (periodTotals.expense / periodTotals.income) < 0.9 
                              ? "bg-yellow-500" 
                              : "bg-expense"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="category" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Análise por Categoria
                  <HelpTooltip content="Distribuição das despesas por categorias para identificar padrões de gastos." />
                </CardTitle>
                <CardDescription>
                  Detalhamento das despesas por categoria em {formatMonthShort(selectedPeriod)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <CategoryDistribution transactions={filteredTransactions} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Top Categorias</h3>
                    <div className="space-y-3">
                      {categoryTotals.slice(0, 5).map((category) => (
                        <div key={category.category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category.categoryName}</span>
                            <span className="text-sm">{formatCurrency(category.amount)}</span>
                          </div>
                          <Progress 
                            value={category.percentage} 
                            className="h-2"
                            indicatorClassName="bg-expense"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Todas as Categorias</h3>
                      <div className="max-h-80 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Categoria</TableHead>
                              <TableHead className="text-right">Valor</TableHead>
                              <TableHead className="text-right">% do Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoryTotals.map((category) => (
                              <TableRow key={category.category}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell className="text-right">{formatCurrency(category.amount)}</TableCell>
                                <TableCell className="text-right">{category.percentage.toFixed(1)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Análise por Tags
                  <HelpTooltip content="Visualize suas finanças agrupadas por tags customizadas." />
                </CardTitle>
                <CardDescription>
                  Transações agrupadas por tags em {formatMonthShort(selectedPeriod)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tagTotals.length > 0 ? (
                  <div className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tag</TableHead>
                          <TableHead className="text-right">Receitas</TableHead>
                          <TableHead className="text-right">Despesas</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                          <TableHead className="text-right">Transações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tagTotals.map((tagData) => (
                          <TableRow key={tagData.tag}>
                            <TableCell className="font-medium">{tagData.tag}</TableCell>
                            <TableCell className="text-right text-income">{formatCurrency(tagData.income)}</TableCell>
                            <TableCell className="text-right text-expense">{formatCurrency(tagData.expense)}</TableCell>
                            <TableCell className={`text-right ${tagData.net >= 0 ? 'text-income' : 'text-expense'}`}>
                              {formatCurrency(tagData.net)}
                            </TableCell>
                            <TableCell className="text-right">{tagData.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Nenhuma tag encontrada</h3>
                    <p className="text-muted-foreground text-center mt-1 max-w-md">
                      Adicione tags às suas transações para visualizar análises agrupadas por tags.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4">
            <SavingsReport 
              savingsBoxes={savingsBoxes} 
              goals={goals}
              periodTotals={periodTotals}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
