
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SavingsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Caixinhas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie suas caixinhas de investimento aqui.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SavingsPage;
