import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
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
  List
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
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
        "h-screen bg-white text-fitpro-darkGray border-r border-gray-200 flex flex-col overflow-hidden shadow-lg",
        "transition-width duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      aria-expanded={!collapsed}
    >
      {/* Cabeçalho da sidebar com logo e botão */}
      <div className={cn(
        "flex items-center p-4 border-b border-gray-200",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed ? (
          <div className="flex items-center select-none">
            <span className="text-2xl font-extrabold text-blue-600 tracking-wide">TurAcademia</span>
          </div>
        ) : (
          <div className="text-2xl font-extrabold text-blue-600 select-none">TA</div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menu lateral" : "Colapsar menu lateral"}
          className={cn(
            "p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fitpro-purple",
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
                      ? "bg-fitpro-lightPurple text-fitpro-darkPurple font-semibold shadow-md"
                      : "text-gray-600 hover:bg-fitpro-lightPurple hover:text-fitpro-darkPurple",
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
                      "text-gray-500 group-hover:text-fitpro-purple transition-colors",
                      isActive ? "text-fitpro-purple" : ""
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

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleLogout}
          className={cn(
            "w-full justify-center text-gray-600 hover:text-fitpro-darkPurple hover:bg-fitpro-lightPurple focus:ring-fitpro-purple focus:ring-2 transition-colors",
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
