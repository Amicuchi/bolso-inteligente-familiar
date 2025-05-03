
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GoalsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie suas metas financeiras aqui.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GoalsPage;
