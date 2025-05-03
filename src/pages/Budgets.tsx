
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BudgetsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie seus orçamentos aqui.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BudgetsPage;
