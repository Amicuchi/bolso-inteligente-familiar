
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/context/FinanceContext';
import { formatCurrency, formatDate } from '@/utils/format';
import { getCategoryName } from '@/utils/categoryUtils';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/ui/help-tooltip';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Transações Recentes
          <HelpTooltip content="Exibe as 5 transações mais recentes do seu histórico financeiro." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{getCategoryName(transaction.category)}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {transaction.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`font-medium ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {transaction.type === 'income' ? '+' : '-'} 
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-muted-foreground">Sem transações recentes</p>
          </div>
        )}
        <div className="mt-4 text-center">
          <a href="/transactions" className="text-primary hover:underline text-sm">
            Ver todas as transações
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
