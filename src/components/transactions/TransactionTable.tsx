
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/context/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onEdit, 
  onDelete 
}) => {
  if (transactions.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          Nenhuma transação encontrada.
        </TableCell>
      </TableRow>
    );
  }

  return (
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
        {transactions.map((transaction) => (
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
              <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
