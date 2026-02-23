import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  BarChart,
  Calendar,
  CreditCard,
  List,
  Moon,
  Sun
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5 transition-colors" /> },
    { name: 'Membros', path: '/members', icon: <Users className="h-5 w-5 transition-colors" /> },
    { name: 'Frequência', path: '/Frequencia', icon: <BarChart className="h-5 w-5 transition-colors" /> },
    { name: 'Agenda', path: '/agenda', icon: <Calendar className="h-5 w-5 transition-colors" /> },
    { name: 'Pagamentos', path: '/payments', icon: <CreditCard className="h-5 w-5 transition-colors" /> },
    { name: 'Treinos', path: '/trainings', icon: <List className="h-5 w-5 transition-colors" /> },
    { name: 'Configurações', path: '/settings', icon: <Settings className="h-5 w-5 transition-colors" /> },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white dark:bg-gray-900 text-fitpro-darkGray dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shadow-lg",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      aria-expanded={!collapsed}
    >
      {/* Cabeçalho da sidebar com logo e botão */}
      <div className={cn(
        "flex items-center p-4 border-b border-gray-200 dark:border-gray-700",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed ? (
          <div className="flex items-center select-none">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">TurAcademia</span>
          </div>
        ) : (
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 select-none">TA</div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menu lateral" : "Colapsar menu lateral"}
          className={cn(
            "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-fitpro-purple",
            collapsed ? "ml-0" : "ml-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-fitpro-purple" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-fitpro-purple" />
          )}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Menu principal">
        <ul className="px-2 space-y-1">
          {navItems.map(({ name, path, icon }) => {
            const isActive = location.pathname === path;
            const tooltipId = `tooltip-${name.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <li key={path} className="relative group">
                <NavLink
                  to={path}
                  className={({ isActive: navIsActive }) => cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    navIsActive
                      ? "bg-fitpro-lightPurple dark:bg-purple-900/50 text-fitpro-darkPurple dark:text-purple-300 font-semibold shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-fitpro-lightPurple dark:hover:bg-gray-800 hover:text-fitpro-darkPurple dark:hover:text-purple-300",
                    collapsed ? "justify-center" : ""
                  )}
                  end
                  aria-describedby={collapsed ? tooltipId : undefined}
                >
                  {/* Barra lateral esquerda no item ativo */}
                  {!collapsed && (
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 rounded-r-md",
                        isActive ? "bg-fitpro-purple" : "opacity-0 group-hover:opacity-100 transition-opacity"
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      "flex-shrink-0",
                      "text-gray-500 dark:text-gray-400 group-hover:text-fitpro-purple dark:group-hover:text-purple-400 transition-colors",
                      isActive ? "text-fitpro-purple dark:text-purple-400" : ""
                    )}
                  >
                    {icon}
                  </div>
                  {!collapsed && <span className="ml-3">{name}</span>}
                </NavLink>

                {/* Tooltip para itens colapsados */}
                {collapsed && (
                  <div
                    id={tooltipId}
                    role="tooltip"
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-fitpro-purple px-2 py-1 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {name}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Tema e Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Botão de Toggle Tema */}
        <Button
          variant="outline"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-center text-gray-600 dark:text-gray-300 hover:text-fitpro-darkPurple dark:hover:text-purple-300 hover:bg-fitpro-lightPurple dark:hover:bg-gray-800 focus:ring-fitpro-purple focus:ring-2 transition-colors border-gray-200 dark:border-gray-700",
            collapsed ? "px-2" : ""
          )}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
          {!collapsed && <span className="ml-2">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </Button>
        
        {/* Botão de Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className={cn(
            "w-full justify-center text-gray-600 dark:text-gray-300 hover:text-fitpro-darkPurple dark:hover:text-purple-300 hover:bg-fitpro-lightPurple dark:hover:bg-gray-800 focus:ring-fitpro-purple focus:ring-2 transition-colors border-gray-200 dark:border-gray-700",
            collapsed ? "px-2" : ""
          )}
          aria-label="Sair da aplicação"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
