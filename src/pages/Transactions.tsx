
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TransactionDialog from '@/components/transactions/TransactionDialog';
import { toast } from '@/hooks/use-toast';
import DeleteConfirmationDialog from '@/components/transactions/DeleteConfirmationDialog';
import HelpTooltip from '@/components/ui/help-tooltip';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import { getCategoryName } from '@/utils/categoryUtils';

const TransactionsPage = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [tagFilter, setTagFilter] = useState('');

  // Get all unique tags from transactions
  const allTags = Array.from(
    new Set(
      transactions
        .flatMap(t => t.tags || [])
        .filter(Boolean)
    )
  );

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
            <TransactionFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
              allTags={allTags}
            />

            <div className="rounded-md border">
              <TransactionTable 
                transactions={sortedTransactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
