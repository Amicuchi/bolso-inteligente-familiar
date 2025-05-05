
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/ui/help-tooltip';

interface RecurringTransactionsListProps {
  transactions: Transaction[];
}

const RecurringTransactionsList: React.FC<RecurringTransactionsListProps> = ({ transactions }) => {
  // Agrupa transações por tipo (receita/despesa)
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const renderTransactionList = (transactions: Transaction[], title: string) => (
    <>
      <h3 className="text-lg font-medium mt-4 mb-2">{title}</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{getCategoryName(transaction.category)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.frequency === 'monthly' ? 'Mensal' : 
                        transaction.frequency === 'yearly' ? 'Anual' : 'Semanal'}
                    </Badge>
                  </TableCell>
                  <TableCell 
                    className={`text-right ${
                      transaction.type === 'income' ? 'text-income' : 'text-expense'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-10 text-center">
                  Nenhuma transação recorrente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Transações Recorrentes
          <HelpTooltip content="Lista de todas as suas transações recorrentes que são usadas para gerar previsões financeiras." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderTransactionList(incomes, "Receitas Recorrentes")}
        {renderTransactionList(expenses, "Despesas Recorrentes")}
      </CardContent>
    </Card>
  );
};

export default RecurringTransactionsList;
