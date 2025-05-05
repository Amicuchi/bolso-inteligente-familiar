
export type CategoryInfo = {
  name: string;
  color: string;
  icon?: string;
};

export const categoryInfo: Record<string, CategoryInfo> = {
  salary: {
    name: 'Salário',
    color: '#10B981',
    icon: 'briefcase'
  },
  investments: {
    name: 'Investimentos',
    color: '#6366F1',
    icon: 'trending-up'
  },
  gifts: {
    name: 'Presentes',
    color: '#EC4899',
    icon: 'gift'
  },
  food: {
    name: 'Alimentação',
    color: '#F59E0B',
    icon: 'utensils'
  },
  transport: {
    name: 'Transporte',
    color: '#3B82F6',
    icon: 'car'
  },
  leisure: {
    name: 'Lazer',
    color: '#8B5CF6',
    icon: 'film'
  },
  health: {
    name: 'Saúde',
    color: '#EF4444',
    icon: 'activity'
  },
  education: {
    name: 'Educação',
    color: '#6366F1',
    icon: 'book'
  },
  housing: {
    name: 'Moradia',
    color: '#F97316',
    icon: 'home'
  },
  utilities: {
    name: 'Contas',
    color: '#0EA5E9',
    icon: 'file-text'
  },
  clothing: {
    name: 'Vestuário',
    color: '#EC4899',
    icon: 'shopping-bag'
  },
  other: {
    name: 'Outros',
    color: '#6B7280',
    icon: 'more-horizontal'
  }
};

// Export the categories array for dropdown menus
export const categories = Object.entries(categoryInfo).map(([id, info]) => ({
  id,
  name: info.name,
  color: info.color,
  icon: info.icon
}));

export function getCategoryName(categoryId: string): string {
  return categoryInfo[categoryId]?.name || 'Desconhecido';
}

export function getCategoryColor(categoryId: string): string {
  return categoryInfo[categoryId]?.color || '#6B7280';
}
