
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  User, 
  FileText, 
  Clock, 
  Wallet, 
  Banknote, 
  UserRound,
  Users,
  Calendar,
  Briefcase,
  Menu,
  ChartBar,
  ListTodo,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Layout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const mainSection = currentPath.split('/')[1] || 'profile';
  
  // Employee self-service menu items (for tabs)
  const employeeTabItems = [
    { to: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { to: "/attendance", label: "Attendance", icon: <Clock className="w-5 h-5" /> },
    { to: "/salary", label: "Salary", icon: <Wallet className="w-5 h-5" /> },
    { to: "/shifts", label: "Shift", icon: <Calendar className="w-5 h-5" /> },
    { to: "/self-service", label: "Self-service", icon: <UserRound className="w-5 h-5" /> },
    { to: "/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> }
  ];

  // HR personnel menu items (for tabs)
  const hrTabItems = [
    { to: "/hr/employee-management", label: "Employee Management", icon: <Users className="w-5 h-5" /> },
    { to: "/hr/attendance-leave", label: "Attendance & Leave", icon: <Calendar className="w-5 h-5" /> },
    { to: "/hr/payroll", label: "Payroll & Compensation", icon: <Wallet className="w-5 h-5" /> },
    { to: "/hr/budget-planning", label: "Budget Planning", icon: <ChartBar className="w-5 h-5" /> },
    { to: "/hr/budget-management", label: "Budget Management", icon: <Banknote className="w-5 h-5" /> }
  ];

  // Handle sidebar expansion on hover
  const expandSidebar = () => {
    setSidebarExpanded(true);
  };

  const collapseSidebar = () => {
    setSidebarExpanded(false);
  };

  // Determine if we're in the HR section or Personal section
  const isHrSection = currentPath.startsWith('/hr');
  const currentTabItems = isHrSection ? hrTabItems : employeeTabItems;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 py-3 px-4 text-white shadow-md flex justify-between items-center z-10">
        <div className="flex items-center">
          <h1 className="font-bold text-lg">HR Management System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-200" />
          <Settings className="w-5 h-5 cursor-pointer hover:text-gray-200" />
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
            <UserRound className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Jane Doe</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only contains Personal and HR Core sections */}
        <div 
          className={cn(
            "bg-white shadow-md z-20 flex flex-col transition-all duration-300 ease-in-out fixed h-[calc(100vh-56px)]",
            sidebarExpanded ? "w-52" : "w-14"
          )}
          onMouseEnter={expandSidebar}
          onMouseLeave={collapseSidebar}
        >
          {/* Personal section */}
          <div className="px-2 py-4">
            <p className={cn(
              "text-xs font-semibold text-gray-500 mb-2 px-2 transition-opacity duration-300",
              sidebarExpanded ? "opacity-100" : "opacity-0 h-0"
            )}>
              Personal
            </p>
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "flex items-center py-2 px-2 rounded-md transition-colors",
                isActive || (!isHrSection) 
                  ? "bg-green-700 text-white" 
                  : "text-gray-700 hover:bg-gray-100",
                !sidebarExpanded && "justify-center"
              )}
            >
              <div className="flex items-center">
                <User className="w-5 h-5" />
                <span className={cn(
                  "ml-2 text-sm transition-all",
                  sidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                )}>
                  Personal
                </span>
              </div>
            </NavLink>
          </div>

          {/* HR Core section */}
          <div className="px-2 py-2">
            <p className={cn(
              "text-xs font-semibold text-gray-500 mb-2 px-2 transition-opacity duration-300",
              sidebarExpanded ? "opacity-100" : "opacity-0 h-0"
            )}>
              HR Core
            </p>
            <NavLink
              to="/hr/employee-management"
              className={({ isActive }) => cn(
                "flex items-center py-2 px-2 rounded-md transition-colors",
                isActive || (isHrSection)
                  ? "bg-green-700 text-white" 
                  : "text-gray-700 hover:bg-gray-100",
                !sidebarExpanded && "justify-center"
              )}
            >
              <div className="flex items-center">
                <Briefcase className="w-5 h-5" />
                <span className={cn(
                  "ml-2 text-sm transition-all",
                  sidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                )}>
                  HR Core
                </span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Main content - with fixed position */}
        <div className="flex-1 overflow-auto ml-14 bg-gray-50">
          {/* Tabbed Navigation */}
          <div className="bg-white border-b sticky top-0 z-10 py-2 px-4">
            <Tabs defaultValue={location.pathname} className="w-full">
              <TabsList className="w-full flex overflow-x-auto pb-1 scrollbar-hide">
                {currentTabItems.map((item) => (
                  <TabsTrigger 
                    key={item.to}
                    value={item.to}
                    className="flex items-center"
                    onClick={() => window.location.href = item.to}
                    data-active={item.to === location.pathname}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="p-5">
            <div className="bg-white rounded-lg shadow-sm p-5 min-h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
