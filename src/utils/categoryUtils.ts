import { CategoryType } from '../context/FinanceContext';

// Define category metadata
export interface CategoryInfo {
  name: string;
  color: string;
  icon: string;
  isExpense: boolean;
}

// Category information table
export const categoryInfo: Record<CategoryType, CategoryInfo> = {
  salary: {
    name: 'Salário',
    color: 'bg-green-500',
    icon: 'dollar-sign',
    isExpense: false
  },
  investments: {
    name: 'Investimentos',
    color: 'bg-blue-500',
    icon: 'coins',
    isExpense: false
  },
  gifts: {
    name: 'Presentes',
    color: 'bg-purple-500',
    icon: 'heart',
    isExpense: false
  },
  food: {
    name: 'Alimentação',
    color: 'bg-orange-500',
    icon: 'calendar-check',
    isExpense: true
  },
  transport: {
    name: 'Transporte',
    color: 'bg-blue-400',
    icon: 'calendar',
    isExpense: true
  },
  leisure: {
    name: 'Lazer',
    color: 'bg-pink-500',
    icon: 'calendar-plus',
    isExpense: true
  },
  health: {
    name: 'Saúde',
    color: 'bg-red-400',
    icon: 'heart',
    isExpense: true
  },
  education: {
    name: 'Educação',
    color: 'bg-yellow-500',
    icon: 'file-text',
    isExpense: true
  },
  housing: {
    name: 'Moradia',
    color: 'bg-indigo-500',
    icon: 'folder',
    isExpense: true
  },
  utilities: {
    name: 'Contas',
    color: 'bg-gray-500',
    icon: 'file-text',
    isExpense: true
  },
  clothing: {
    name: 'Roupas',
    color: 'bg-purple-400',
    icon: 'calendar-minus',
    isExpense: true
  },
  other: {
    name: 'Outros',
    color: 'bg-gray-400',
    icon: 'folder-open',
    isExpense: true
  }
};

// Criar e exportar a lista de categorias para uso em componentes
export const categories = Object.entries(categoryInfo).map(([id, info]) => ({
  id: id as CategoryType,
  name: info.name,
  color: info.color,
  icon: info.icon,
  isExpense: info.isExpense
}));

// Get category expense options
export const getExpenseCategories = (): CategoryType[] => {
  return Object.entries(categoryInfo)
    .filter(([_, info]) => info.isExpense)
    .map(([category]) => category as CategoryType);
};

// Get category income options
export const getIncomeCategories = (): CategoryType[] => {
  return Object.entries(categoryInfo)
    .filter(([_, info]) => !info.isExpense)
    .map(([category]) => category as CategoryType);
};

// Get all categories
export const getAllCategories = (): CategoryType[] => {
  return Object.keys(categoryInfo) as CategoryType[];
};

// Get category name
export const getCategoryName = (category: CategoryType): string => {
  return categoryInfo[category].name;
};

// Get category color
export const getCategoryColor = (category: CategoryType): string => {
  return categoryInfo[category].color;
};

// Get category icon
export const getCategoryIcon = (category: CategoryType): string => {
  return categoryInfo[category].icon;
};

// Check if category is for expenses
export const isCategoryExpense = (category: CategoryType): boolean => {
  return categoryInfo[category].isExpense;
};
