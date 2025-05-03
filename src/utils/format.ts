
// Format a number as currency (BRL)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Format a date to local string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Get the current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Get the first day of a month
export const getFirstDayOfMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  return `${year}-${month}-01`;
};

// Get the last day of a month
export const getLastDayOfMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month), 0);
  return `${year}-${month}-${date.getDate()}`;
};

// Check if a date is within a month period
export const isDateInMonth = (date: string, yearMonth: string): boolean => {
  return date.startsWith(yearMonth);
};

// Calculate percentage
export const calculatePercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

// Format a month (YYYY-MM) to a short month name
export const formatMonthShort = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('pt-BR', { month: 'short' });
};

// Format a number as compact currency
export const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
    currency: 'BRL'
  }).format(value);
};
