
export type UserRole = 'admin' | 'collaborator' | 'visitor';

export type Permission = 
  | 'view_transactions' 
  | 'create_transactions' 
  | 'edit_transactions' 
  | 'delete_transactions'
  | 'view_budgets'
  | 'create_budgets'
  | 'edit_budgets'
  | 'delete_budgets'
  | 'view_goals'
  | 'create_goals'
  | 'edit_goals'
  | 'delete_goals'
  | 'view_savings'
  | 'create_savings'
  | 'edit_savings'
  | 'delete_savings'
  | 'view_reports'
  | 'invite_users'
  | 'manage_users'
  | 'manage_system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'pending' | 'inactive';
  theme?: 'light' | 'dark' | 'system';
}

export interface AutoRule {
  id: string;
  name: string;
  description?: string;
  condition: {
    field: 'description' | 'amount' | 'date' | 'category';
    operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'between';
    value: string | number | [string, string]; // Para between podemos usar um array
  };
  action: {
    type: 'set_category' | 'add_tag' | 'notify';
    value: string;
  };
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}

export interface NotificationSetting {
  id: string;
  type: 'budget_exceeded' | 'goal_reached' | 'low_balance' | 'recurring_transaction' | 'large_expense';
  enabled: boolean;
  threshold?: number; // Por exemplo, notificar quando o saldo estiver abaixo de X
  channels: ('email' | 'app')[];
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSetting[];
  autoRules: AutoRule[];
}
