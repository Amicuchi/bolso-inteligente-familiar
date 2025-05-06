
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserList } from '@/components/settings/UserList';
import { UserForm } from '@/components/settings/UserForm';
import { UserPermissions } from '@/components/settings/UserPermissions';
import { InviteUserForm } from '@/components/settings/InviteUserForm';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { AutoRules } from '@/components/settings/AutoRules';
import { AutoRuleForm } from '@/components/settings/AutoRuleForm';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { User, Permission, AutoRule, NotificationSetting } from '@/types/user';
import { PlusCircle, UserPlus } from 'lucide-react';

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@exemplo.com',
    role: 'admin',
    permissions: [
      'view_transactions', 'create_transactions', 'edit_transactions', 'delete_transactions',
      'view_budgets', 'create_budgets', 'edit_budgets', 'delete_budgets', 
      'view_goals', 'create_goals', 'edit_goals', 'delete_goals',
      'view_savings', 'create_savings', 'edit_savings', 'delete_savings',
      'view_reports', 'invite_users', 'manage_users', 'manage_system'
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    theme: 'system'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'collaborator',
    permissions: [
      'view_transactions', 'create_transactions', 
      'view_budgets', 'view_goals', 'view_savings', 'view_reports'
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Maria Souza',
    email: 'maria@exemplo.com',
    role: 'visitor',
    permissions: ['view_transactions', 'view_budgets', 'view_goals'],
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const dummyNotifications: NotificationSetting[] = [
  {
    id: '1',
    type: 'budget_exceeded',
    enabled: true,
    threshold: 90,
    channels: ['app', 'email']
  },
  {
    id: '2',
    type: 'goal_reached',
    enabled: true,
    threshold: 100,
    channels: ['app']
  },
  {
    id: '3',
    type: 'low_balance',
    enabled: false,
    threshold: 500,
    channels: ['email']
  },
  {
    id: '4',
    type: 'recurring_transaction',
    enabled: true,
    threshold: 3,
    channels: ['app']
  },
  {
    id: '5',
    type: 'large_expense',
    enabled: false,
    threshold: 1000,
    channels: ['app', 'email']
  }
];

const dummyRules: AutoRule[] = [
  {
    id: '1',
    name: 'Compras de supermercado',
    description: 'Categoriza automaticamente compras de supermercado',
    condition: {
      field: 'description',
      operator: 'contains',
      value: 'mercado'
    },
    action: {
      type: 'set_category',
      value: 'food'
    },
    enabled: true,
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Despesas de transporte',
    condition: {
      field: 'description',
      operator: 'contains',
      value: 'uber'
    },
    action: {
      type: 'set_category',
      value: 'transport'
    },
    enabled: true,
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
];

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(dummyNotifications);
  const [rules, setRules] = useState<AutoRule[]>(dummyRules);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Estado para diálogos e modais
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [isPermissionSheetOpen, setIsPermissionSheetOpen] = useState(false);
  const [isAutoRuleDialogOpen, setIsAutoRuleDialogOpen] = useState(false);
  
  // Estado para usuário selecionado (para edição ou permissões)
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [selectedRule, setSelectedRule] = useState<AutoRule | undefined>();
  
  // Usuário atual (para simulação)
  const currentUserId = '1';

  // Manipuladores de usuário
  const handleAddUser = (userData: any) => {
    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.role === 'admin' 
        ? ['view_transactions', 'create_transactions', 'edit_transactions', 'delete_transactions', 'manage_users', 'manage_system'] 
        : ['view_transactions'],
      status: userData.status,
      avatar: userData.avatar,
      createdAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setIsUserFormOpen(false);
    toast({
      title: "Usuário adicionado",
      description: `${newUser.name} foi adicionado com sucesso.`
    });
  };
  
  const handleEditUser = (userData: any) => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...userData } 
        : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(undefined);
    setIsUserFormOpen(false);
    toast({
      title: "Usuário atualizado",
      description: `As informações de ${userData.name} foram atualizadas.`
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso."
    });
  };
  
  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionSheetOpen(true);
  };
  
  const handlePermissionChange = (userId: string, permissions: Permission[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, permissions } 
        : user
    );
    
    setUsers(updatedUsers);
  };
  
  const handleInviteUser = (inviteData: any) => {
    toast({
      title: "Convite enviado",
      description: `Um convite foi enviado para ${inviteData.email}.`
    });
    setIsInviteFormOpen(false);
  };

  // Manipuladores de tema
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: "Tema atualizado",
      description: `O tema foi alterado para ${
        newTheme === 'light' ? 'claro' : 
        newTheme === 'dark' ? 'escuro' : 
        'sistema'
      }.`
    });
  };

  // Manipuladores de notificações
  const handleNotificationUpdate = (updatedNotifications: NotificationSetting[]) => {
    setNotifications(updatedNotifications);
    toast({
      title: "Notificações atualizadas",
      description: "As configurações de notificação foram salvas."
    });
  };

  // Manipuladores de regras automáticas
  const handleAddRule = () => {
    setSelectedRule(undefined);
    setIsAutoRuleDialogOpen(true);
  };
  
  const handleEditRule = (rule: AutoRule) => {
    setSelectedRule(rule);
    setIsAutoRuleDialogOpen(true);
  };
  
  const handleSaveRule = (ruleData: Partial<AutoRule>) => {
    if (selectedRule) {
      // Editando regra existente
      const updatedRules = rules.map(rule => 
        rule.id === selectedRule.id 
          ? { ...rule, ...ruleData } 
          : rule
      );
      setRules(updatedRules);
      toast({
        title: "Regra atualizada",
        description: `A regra "${ruleData.name}" foi atualizada.`
      });
    } else {
      // Adicionando nova regra
      const newRule: AutoRule = {
        id: uuidv4(),
        name: ruleData.name!,
        description: ruleData.description,
        condition: ruleData.condition!,
        action: ruleData.action!,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: currentUserId
      };
      setRules([...rules, newRule]);
      toast({
        title: "Regra criada",
        description: `A regra "${newRule.name}" foi criada.`
      });
    }
    
    setIsAutoRuleDialogOpen(false);
    setSelectedRule(undefined);
  };
  
  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast({
      title: "Regra removida",
      description: "A regra foi removida com sucesso."
    });
  };
  
  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled } 
        : rule
    );
    setRules(updatedRules);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e configurações do sistema
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-2">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
          </TabsList>
          
          {/* Aba de Usuários */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsInviteFormOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convidar
                </Button>
                <Button onClick={() => {
                  setSelectedUser(undefined);
                  setIsUserFormOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
            </div>
            
            <UserList 
              users={users} 
              onEditUser={(user) => {
                setSelectedUser(user);
                setIsUserFormOpen(true);
              }}
              onDeleteUser={handleDeleteUser}
              onManagePermissions={handleManagePermissions}
              currentUserId={currentUserId}
            />
          </TabsContent>
          
          {/* Aba de Preferências */}
          <TabsContent value="preferences" className="space-y-6">
            {/* Configurações de tema */}
            <ThemeSettings theme={theme} onThemeChange={handleThemeChange} />
            
            {/* Configurações de notificação */}
            <NotificationSettings 
              settings={notifications}
              onUpdate={handleNotificationUpdate}
            />
          </TabsContent>
          
          {/* Aba de Automação */}
          <TabsContent value="automation" className="space-y-6">
            {/* Regras Automáticas */}
            <AutoRules 
              rules={rules}
              onAddRule={handleAddRule}
              onEditRule={handleEditRule}
              onDeleteRule={handleDeleteRule}
              onToggleRule={handleToggleRule}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Diálogo para adicionar/editar usuário */}
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? `Editar ${selectedUser.name}` : 'Adicionar Usuário'}
            </DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser} 
            onSubmit={selectedUser ? handleEditUser : handleAddUser}
            onCancel={() => {
              setIsUserFormOpen(false);
              setSelectedUser(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para convidar usuário */}
      <Dialog open={isInviteFormOpen} onOpenChange={setIsInviteFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
          </DialogHeader>
          <InviteUserForm 
            onSubmit={handleInviteUser}
            onCancel={() => setIsInviteFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Sheet para gerenciar permissões */}
      <Sheet open={isPermissionSheetOpen} onOpenChange={setIsPermissionSheetOpen}>
        <SheetContent className="overflow-y-auto w-[90vw] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {selectedUser ? `Permissões de ${selectedUser.name}` : 'Gerenciar Permissões'}
            </SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="py-6">
              <UserPermissions 
                user={selectedUser}
                onChange={handlePermissionChange}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Diálogo para adicionar/editar regra automática */}
      <Dialog open={isAutoRuleDialogOpen} onOpenChange={setIsAutoRuleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? `Editar Regra: ${selectedRule.name}` : 'Nova Regra Automática'}
            </DialogTitle>
          </DialogHeader>
          <AutoRuleForm 
            rule={selectedRule}
            onSubmit={handleSaveRule}
            onCancel={() => {
              setIsAutoRuleDialogOpen(false);
              setSelectedRule(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SettingsPage;
