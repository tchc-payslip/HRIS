
import { Outlet, NavLink } from "react-router-dom";
import { 
  User, 
  FileText, 
  Clock, 
  Wallet, 
  Banknote, 
  CalendarDays, 
  UserRound,
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const navItems = [
    { to: "/profile", label: "Employee Profile", icon: <User className="w-4 h-4" /> },
    { to: "/documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
    { to: "/attendance", label: "Time Attendance", icon: <Clock className="w-4 h-4" /> },
    { to: "/salary", label: "Salary", icon: <Wallet className="w-4 h-4" /> },
    { to: "/budget", label: "Budget", icon: <Banknote className="w-4 h-4" /> },
    { to: "/shifts", label: "Shifts", icon: <CalendarDays className="w-4 h-4" /> },
    { to: "/self-service", label: "Self-Service", icon: <UserRound className="w-4 h-4" /> }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm">
      <header className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-4 p-1 rounded hover:bg-gray-100 lg:hidden" 
              onClick={toggleSidebar}
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-hr-brightBlue">Ascend HR</h1>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden md:flex text-gray-500">
              <span className="mr-2">Jane Doe</span>
              <span className="bg-green-500 rounded-full w-2 h-2"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <nav className={`
          ${isMobile ? (sidebarCollapsed ? 'hidden' : 'absolute z-10 h-full') : 'relative'} 
          ${sidebarCollapsed ? 'w-16' : 'w-48'} 
          transition-all duration-300 bg-white shadow-sm border-r border-gray-200
        `}>
          <div className={`flex flex-col h-full p-2`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hr-tab flex items-center py-2 px-2 rounded-md text-xs ${isActive ? 'active bg-hr-skyBlue/10 text-hr-brightBlue' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                <div className="mr-2">{item.icon}</div>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
            
            <button 
              className="mt-auto flex items-center justify-center p-2 rounded-md hover:bg-gray-100 mb-4"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              }
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-auto p-3">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-1 px-4 text-center text-gray-500 text-xs">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Ascend HR Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;
