
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TransactionsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie suas transações aqui.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
