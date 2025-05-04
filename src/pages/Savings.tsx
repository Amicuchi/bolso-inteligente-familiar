
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import SavingsBoxForm from '@/components/savings/SavingsBoxForm';
import SavingsTransactionForm from '@/components/savings/SavingsTransactionForm';
import DeleteConfirmationDialog from '@/components/savings/DeleteConfirmationDialog';
import { useToast } from "@/hooks/use-toast";

const SavingsPage = () => {
  const { savingsBoxes, deleteSavingsBox } = useFinance();
  const { toast } = useToast();

  // States for dialog management
  const [isCreateBoxOpen, setIsCreateBoxOpen] = useState(false);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentBoxId, setCurrentBoxId] = useState<string | null>(null);
  const [expandedBoxId, setExpandedBoxId] = useState<string | null>(null);

  const currentBox = currentBoxId
    ? savingsBoxes.find(box => box.id === currentBoxId)
    : null;

  // Dialog handlers
  const handleCreateBox = () => {
    setIsCreateBoxOpen(true);
  };

  const handleEditBox = (id: string) => {
    setCurrentBoxId(id);
    setIsEditBoxOpen(true);
  };

  const handleAddTransaction = (id: string) => {
    setCurrentBoxId(id);
    setIsAddTransactionOpen(true);
  };

  const handleDeleteBox = (id: string) => {
    setCurrentBoxId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (currentBoxId) {
      deleteSavingsBox(currentBoxId);
      toast({
        title: "Caixinha excluída",
        description: "A caixinha foi excluída com sucesso.",
      });
      setIsDeleteOpen(false);
      setCurrentBoxId(null);
    }
  };

  const toggleTransactions = (id: string) => {
    setExpandedBoxId(expandedBoxId === id ? null : id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Caixinhas</CardTitle>
            <Button onClick={handleCreateBox} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Caixinha
            </Button>
          </CardHeader>
          <CardContent>
            {savingsBoxes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Você ainda não criou nenhuma caixinha de economia.
                </p>
                <Button onClick={handleCreateBox}>Criar primeira caixinha</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {savingsBoxes.map((box) => {
                  const percentage = box.targetAmount
                    ? Math.min(Math.round((box.currentAmount / box.targetAmount) * 100), 100)
                    : 100;
                  
                  const isExpanded = expandedBoxId === box.id;

                  return (
                    <Card key={box.id} className="border border-muted">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">{box.name}</CardTitle>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddTransaction(box.id)}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Transação
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditBox(box.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteBox(box.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Saldo atual:</span>
                            <span className="font-semibold text-lg">
                              {formatCurrency(box.currentAmount)}
                            </span>
                          </div>
                          
                          {box.targetAmount && (
                            <>
                              <div className="flex justify-between items-center text-sm">
                                <span>Meta:</span>
                                <span>{formatCurrency(box.targetAmount)}</span>
                              </div>
                              <div className="space-y-1">
                                <Progress value={percentage} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{percentage}%</span>
                                  <span>
                                    {formatCurrency(box.currentAmount)} de {formatCurrency(box.targetAmount)}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => toggleTransactions(box.id)}
                          >
                            {isExpanded ? "Ocultar transações" : "Ver transações"}
                          </Button>

                          {isExpanded && box.transactions.length > 0 && (
                            <div className="pt-2">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {box.transactions.sort((a, b) => {
                                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                                  }).map((transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>{formatDate(transaction.date)}</TableCell>
                                      <TableCell>{transaction.description}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center">
                                          {transaction.type === 'deposit' ? (
                                            <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                                          ) : (
                                            <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
                                          )}
                                          {transaction.type === 'deposit' ? 'Depósito' : 'Retirada'}
                                        </div>
                                      </TableCell>
                                      <TableCell className={`text-right font-medium ${
                                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {transaction.type === 'deposit' ? '+' : '-'} 
                                        {formatCurrency(transaction.amount)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                          
                          {isExpanded && box.transactions.length === 0 && (
                            <div className="py-4 text-center text-muted-foreground">
                              Nenhuma transação registrada para esta caixinha.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Savings Box Dialog */}
      <Dialog open={isCreateBoxOpen} onOpenChange={setIsCreateBoxOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Caixinha</DialogTitle>
            <DialogDescription>
              Crie uma caixinha para guardar dinheiro para um objetivo específico.
            </DialogDescription>
          </DialogHeader>
          <SavingsBoxForm 
            onSuccess={() => setIsCreateBoxOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Savings Box Dialog */}
      <Dialog open={isEditBoxOpen} onOpenChange={setIsEditBoxOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Caixinha</DialogTitle>
          </DialogHeader>
          {currentBox && (
            <SavingsBoxForm 
              onSuccess={() => setIsEditBoxOpen(false)} 
              existingBox={currentBox}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentBox ? `Nova Transação - ${currentBox.name}` : 'Nova Transação'}
            </DialogTitle>
          </DialogHeader>
          {currentBox && (
            <SavingsTransactionForm
              boxId={currentBox.id}
              onSuccess={() => setIsAddTransactionOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Caixinha"
        description="Tem certeza que deseja excluir esta caixinha? Esta ação não pode ser desfeita."
      />
    </MainLayout>
  );
};

export default SavingsPage;
