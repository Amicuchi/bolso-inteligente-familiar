
import React from 'react';
import { User, Permission } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface UserPermissionsProps {
  user: User;
  onChange: (userId: string, permissions: Permission[]) => void;
}

export const UserPermissions: React.FC<UserPermissionsProps> = ({
  user,
  onChange,
}) => {
  const permissionGroups = [
    {
      title: 'Transações',
      permissions: [
        { id: 'view_transactions', label: 'Visualizar transações' },
        { id: 'create_transactions', label: 'Criar transações' },
        { id: 'edit_transactions', label: 'Editar transações' },
        { id: 'delete_transactions', label: 'Excluir transações' },
      ],
    },
    {
      title: 'Orçamentos',
      permissions: [
        { id: 'view_budgets', label: 'Visualizar orçamentos' },
        { id: 'create_budgets', label: 'Criar orçamentos' },
        { id: 'edit_budgets', label: 'Editar orçamentos' },
        { id: 'delete_budgets', label: 'Excluir orçamentos' },
      ],
    },
    {
      title: 'Metas',
      permissions: [
        { id: 'view_goals', label: 'Visualizar metas' },
        { id: 'create_goals', label: 'Criar metas' },
        { id: 'edit_goals', label: 'Editar metas' },
        { id: 'delete_goals', label: 'Excluir metas' },
      ],
    },
    {
      title: 'Caixinhas',
      permissions: [
        { id: 'view_savings', label: 'Visualizar caixinhas' },
        { id: 'create_savings', label: 'Criar caixinhas' },
        { id: 'edit_savings', label: 'Editar caixinhas' },
        { id: 'delete_savings', label: 'Excluir caixinhas' },
      ],
    },
    {
      title: 'Relatórios',
      permissions: [
        { id: 'view_reports', label: 'Visualizar relatórios' },
      ],
    },
    {
      title: 'Usuários',
      permissions: [
        { id: 'invite_users', label: 'Convidar usuários' },
        { id: 'manage_users', label: 'Gerenciar usuários' },
      ],
    },
    {
      title: 'Sistema',
      permissions: [
        { id: 'manage_system', label: 'Gerenciar sistema' },
      ],
    },
  ];

  const handleTogglePermission = (permission: string) => {
    const permissionId = permission as Permission;
    let newPermissions: Permission[];
    
    if (user.permissions.includes(permissionId)) {
      newPermissions = user.permissions.filter(p => p !== permissionId);
    } else {
      newPermissions = [...user.permissions, permissionId];
    }
    
    onChange(user.id, newPermissions);
  };

  return (
    <div className="space-y-6">
      {permissionGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>
              Defina o que este usuário pode fazer com {group.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${user.id}-${permission.id}`}
                    checked={user.permissions.includes(permission.id as Permission)}
                    onCheckedChange={() => handleTogglePermission(permission.id)}
                  />
                  <label
                    htmlFor={`${user.id}-${permission.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
