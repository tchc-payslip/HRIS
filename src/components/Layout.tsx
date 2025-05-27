
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  ChartBar,
  Bell,
  ClockIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const mainSection = currentPath.split('/')[1] || 'profile';
  
  // Determine which section we're in (Personal or HR)
  const isHrSection = currentPath.startsWith('/hr');
  const isSettingsPage = currentPath === '/settings';
  
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
    { to: "/hr/raw-attendance", label: "Raw Attendance", icon: <ClockIcon className="w-5 h-5" /> },
    { to: "/hr/attendance-leave", label: "Attendance & Leave", icon: <Calendar className="w-5 h-5" /> },
    { to: "/hr/payroll", label: "Payroll", icon: <Wallet className="w-5 h-5" /> },
    { to: "/hr/budget-planning", label: "Budget Planning", icon: <ChartBar className="w-5 h-5" /> },
    { to: "/hr/budget-management", label: "Budget Management", icon: <Banknote className="w-5 h-5" /> }
  ];

  // Get the appropriate tab items based on section
  const currentTabItems = isHrSection ? hrTabItems : employeeTabItems;
  
  // Get the theme color from localStorage
  const themeColor = localStorage.getItem('theme-color') || 'green-700';

  // Get the current active tab value based on the current path
  const getCurrentActiveTab = () => {
    return currentPath;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - thinner */}
      <header className={`bg-[--theme-color] py-1.5 px-4 text-white shadow-md flex justify-between items-center z-10`}>
        <div className="flex items-center">
          <h1 className="font-bold text-base">HR Management System</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification icon */}
          <Bell className="w-4 h-4 cursor-pointer hover:text-gray-200" />
          
          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 cursor-pointer hover:text-gray-200">
              <UserRound className="w-4 h-4" />
              <span className="hidden md:inline text-sm">Jane Doe</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                Account Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/settings')}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - icons only with tooltips */}
        <div className="bg-white shadow-md z-20 flex flex-col w-14 fixed h-[calc(100vh-40px)]">
          {/* Personal section */}
          <div className="px-2 py-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => cn(
                      "flex items-center justify-center py-2 px-2 rounded-md transition-colors w-10 h-10 mx-auto",
                      isActive || (!isHrSection && !isSettingsPage) 
                        ? "bg-gray-700 text-white font-bold"
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
          <div className="px-2 py-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/hr/employee-management"
                    className={({ isActive }) => cn(
                      "flex items-center justify-center py-2 px-2 rounded-md transition-colors w-10 h-10 mx-auto",
                      isActive || (isHrSection && !isSettingsPage)
                        ? "bg-gray-700 text-white font-bold"
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
          {/* Tabbed Navigation - only show for Personal and HR sections */}
          {!isSettingsPage && (
            <div className="bg-white border-b sticky top-0 z-10 py-1 px-4">
              <Tabs value={getCurrentActiveTab()} className="w-full">
                <TabsList className="w-full flex overflow-x-auto pb-1 scrollbar-hide bg-transparent h-auto p-0 space-x-1">
                  {currentTabItems.map((item) => (
                    <TabsTrigger 
                      key={item.to}
                      value={item.to}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                        currentPath === item.to
                          ? "bg-gray-700 text-white font-bold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      onClick={() => navigate(item.to)}
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
          )}
          
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
