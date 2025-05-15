
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
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
  ChartBar,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Determine if we're in the HR section or Personal section
  const isHrSection = currentPath.startsWith('/hr');
  const currentTabItems = isHrSection ? hrTabItems : employeeTabItems;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - made thinner */}
      <header className="bg-green-700 py-2 px-4 text-white shadow-md flex justify-between items-center z-10">
        <div className="flex items-center">
          <h1 className="font-bold text-lg">HR Management System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-200" />
          <Settings 
            className="w-5 h-5 cursor-pointer hover:text-gray-200" 
            onClick={() => navigate('/settings')}
          />
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
            <UserRound className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Jane Doe</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - icons only with tooltips */}
        <div className="bg-white shadow-md z-20 flex flex-col w-14 fixed h-[calc(100vh-48px)]">
          {/* Personal section */}
          <div className="px-2 py-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2 opacity-0 h-0">
              Personal
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => cn(
                      "flex items-center justify-center py-2 px-2 rounded-md transition-colors",
                      isActive || (!isHrSection) 
                        ? "bg-green-700 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <User className="w-5 h-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Personal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* HR Core section */}
          <div className="px-2 py-2">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2 opacity-0 h-0">
              HR Core
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/hr/employee-management"
                    className={({ isActive }) => cn(
                      "flex items-center justify-center py-2 px-2 rounded-md transition-colors",
                      isActive || (isHrSection)
                        ? "bg-green-700 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Briefcase className="w-5 h-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>HR Core</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
