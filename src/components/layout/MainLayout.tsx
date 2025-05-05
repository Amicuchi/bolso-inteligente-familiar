
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChartPie, Coins, CreditCard, DollarSign, HelpCircle, Home, PiggyBank, TrendingUp } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger className="md:hidden mr-2" />
            <h1 className="text-2xl font-semibold">Gestor Financeiro Familiar</h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  return (
    <Sidebar className="border-r">
      <SidebarContent className="py-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold flex items-center">
            <DollarSign className="mr-2" />
            Bolso Inteligente
          </h2>
          <p className="text-sm text-muted-foreground">Gestão de finanças pessoais</p>
        </div>
        <div className="mt-6 space-y-1">
          <NavItem href="/" icon={<Home />} label="Dashboard" />
          <NavItem href="/transactions" icon={<CreditCard />} label="Transações" />
          <NavItem href="/budgets" icon={<Coins />} label="Orçamentos" />
          <NavItem href="/goals" icon={<TrendingUp />} label="Metas" />
          <NavItem href="/savings" icon={<PiggyBank />} label="Caixinhas" />
          <NavItem href="/reports" icon={<ChartPie />} label="Relatórios" />
          <NavItem href="/help" icon={<HelpCircle />} label="Ajuda" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <Link 
      to={href} 
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default MainLayout;
