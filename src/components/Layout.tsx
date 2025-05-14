
import { Outlet, NavLink } from "react-router-dom";
import { 
  User, 
  FileText, 
  Clock, 
  Wallet, 
  Banknote, 
  CalendarDays, 
  UserRound 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  
  const navItems = [
    { to: "/profile", label: "Employee Profile", icon: <User className="w-5 h-5" /> },
    { to: "/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { to: "/attendance", label: "Time Attendance", icon: <Clock className="w-5 h-5" /> },
    { to: "/salary", label: "Salary", icon: <Wallet className="w-5 h-5" /> },
    { to: "/budget", label: "Budget", icon: <Banknote className="w-5 h-5" /> },
    { to: "/shifts", label: "Shifts", icon: <CalendarDays className="w-5 h-5" /> },
    { to: "/self-service", label: "Self-Service", icon: <UserRound className="w-5 h-5" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-hr-brightBlue">Ascend HR</h1>
          <div className="flex items-center space-x-4">
            {/* Profile or other header actions can go here */}
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 flex flex-col sm:flex-row gap-6 p-6">
        <nav className={`${isMobile ? 'w-full overflow-x-auto' : 'w-64'} bg-white rounded-lg shadow-sm p-4 border border-gray-200`}>
          <div className={`flex ${isMobile ? 'flex-row space-x-2' : 'flex-col space-y-2'}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hr-tab ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span className={isMobile ? 'hidden sm:inline' : ''}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="flex-1 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <Outlet />
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Ascend HR Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;
