import { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const LoadingSpinner = () => (
  <div 
    role="status" 
    aria-live="polite" 
    aria-label="Carregando conteúdo"
    className="min-h-screen flex items-center justify-center bg-fitpro-lightGray"
  >
    <svg
      className="animate-spin h-12 w-12 text-fitpro-purple"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fecha o sidebar ao clicar fora (mobile)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      sidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setSidebarOpen(false);
      buttonRef.current?.focus(); // Volta foco para botão do menu
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Evita scroll atrás do menu
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, handleClickOutside]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-fitpro-lightGray dark:bg-gray-950 text-fitpro-darkGray dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar desktop fixo */}
      <aside
        ref={sidebarRef}
        aria-label="Navegação lateral"
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar />
      </aside>

      {/* Overlay mobile, só aparece quando sidebar aberto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          aria-hidden="true"
          onClick={() => {
            setSidebarOpen(false);
            buttonRef.current?.focus();
          }}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-h-screen md:ml-64">
        {/* Header mobile com botão para abrir sidebar */}
        <header className="md:hidden flex items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
          <button
            ref={buttonRef}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu lateral"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
            className="text-fitpro-purple hover:text-fitpro-darkPurple focus:outline-none focus:ring-2 focus:ring-fitpro-purple rounded-md"
          >
            {/* Ícone Hamburger (simples SVG) */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="ml-4 text-lg font-semibold select-none">FitPro Gym</h1>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-6 overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
