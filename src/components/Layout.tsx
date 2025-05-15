
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  User, 
  FileText, 
  Clock, 
  Wallet, 
  Banknote, 
  CalendarDays, 
  UserRound,
  Users,
  Calendar,
  BriefCase,
  Menu,
  ChartBar,
  ListTodo,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  
  // Employee self-service menu items
  const employeeNavItems = [
    { to: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { to: "/attendance", label: "Attendance", icon: <Clock className="w-5 h-5" /> },
    { to: "/salary", label: "Salary", icon: <Wallet className="w-5 h-5" /> },
    { to: "/shifts", label: "Shift", icon: <CalendarDays className="w-5 h-5" /> },
    { to: "/self-service", label: "Self-service", icon: <UserRound className="w-5 h-5" /> },
    { to: "/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> }
  ];

  // HR personnel menu items
  const hrNavItems = [
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 py-3 px-4 text-white shadow-md flex justify-between items-center">
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
        {/* Sidebar */}
        <div 
          className={cn(
            "bg-white shadow-md z-10 flex flex-col transition-all duration-300 ease-in-out",
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
            <div className="flex flex-col space-y-1">
              {employeeNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center py-2 px-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-green-700 text-white" 
                      : "text-gray-700 hover:bg-gray-100",
                    !sidebarExpanded && "justify-center"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className={cn(
                      "ml-2 text-sm transition-all",
                      sidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          {/* HR Core section */}
          <div className="px-2 py-2">
            <p className={cn(
              "text-xs font-semibold text-gray-500 mb-2 px-2 transition-opacity duration-300",
              sidebarExpanded ? "opacity-100" : "opacity-0 h-0"
            )}>
              HR Core
            </p>
            <div className="flex flex-col space-y-1">
              {hrNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center py-2 px-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-green-700 text-white" 
                      : "text-gray-700 hover:bg-gray-100",
                    !sidebarExpanded && "justify-center"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className={cn(
                      "ml-2 text-sm transition-all",
                      sidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-5">
          <div className="bg-white rounded-lg shadow-sm p-5 min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
