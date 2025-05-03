
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TransactionDialog from '@/components/transactions/TransactionDialog';
import { toast } from '@/hooks/use-toast';
import DeleteConfirmationDialog from '@/components/transactions/DeleteConfirmationDialog';

const TransactionsPage = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      getCategoryName(transaction.category).toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentTransaction) {
      deleteTransaction(currentTransaction.id);
      toast({
        title: "Transação excluída",
        description: "A transação foi removida com sucesso."
      });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Transações</CardTitle>
              <CardDescription>
                Gerencie suas receitas e despesas
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{getCategoryName(transaction.category)}</TableCell>
                        <TableCell 
                          className={`text-right ${
                            transaction.type === 'income' ? 'text-income' : 'text-expense'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma transação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>

        {/* Add Transaction Dialog */}
        <TransactionDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
          mode="add"
        />

        {/* Edit Transaction Dialog */}
        {currentTransaction && (
          <TransactionDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            transaction={currentTransaction}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
