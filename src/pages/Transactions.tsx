
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TransactionDialog from '@/components/transactions/TransactionDialog';
import { toast } from '@/hooks/use-toast';
import DeleteConfirmationDialog from '@/components/transactions/DeleteConfirmationDialog';
import HelpTooltip from '@/components/ui/help-tooltip';

const TransactionsPage = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [tagFilter, setTagFilter] = useState('');

  // Filter transactions based on search term and tag filter
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchLower) ||
      getCategoryName(transaction.category).toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower);
    
    const matchesTag = 
      !tagFilter || 
      (transaction.tags && transaction.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase())));
    
    return matchesSearch && matchesTag;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get all unique tags from transactions
  const allTags = Array.from(
    new Set(
      transactions
        .flatMap(t => t.tags || [])
        .filter(Boolean)
    )
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
              <CardTitle className="flex items-center">
                Transações
                <HelpTooltip content="Gerencie suas receitas e despesas. Adicione, edite ou remova transações." />
              </CardTitle>
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
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <div className="flex-1 w-full flex items-center space-x-2">
                <Search className="text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-1 w-full flex items-center space-x-2">
                <Tag className="text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Filtrar por tag..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                />
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Tags populares:</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={`cursor-pointer ${tagFilter === tag ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tags</TableHead>
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
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {transaction.tags && transaction.tags.length > 0 ? (
                              transaction.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">Sem tags</span>
                            )}
                          </div>
                        </TableCell>
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
                      <TableCell colSpan={6} className="h-24 text-center">
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
