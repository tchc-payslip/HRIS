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
  Sun,
  Moon,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const { colors, applyThemeToDOM, toggleDarkMode } = useThemeStore();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [isTabsDropdownOpen, setIsTabsDropdownOpen] = useState(false);
  const currentPath = location.pathname;
  const mainSection = currentPath.split('/')[1] || 'profile';
  
  // Apply theme on mount and when colors change
  useEffect(() => {
    if (colors) {
      applyThemeToDOM(colors);
    }
  }, [colors, applyThemeToDOM]);

  // Determine which section we're in (Personal or HR)
  const isHrSection = currentPath.startsWith('/hr');
  const isSettingsPage = currentPath === '/settings';
  
  // Employee self-service sections and tabs
  const employeeSections = [
    { 
      to: "/profile", 
      label: "Profile", 
      icon: <User className="w-4 h-4" />,
      tabs: []
    },
    { 
      to: "/attendance", 
      label: "Attendance", 
      icon: <Clock className="w-4 h-4" />,
      tabs: [
        { to: "/attendance", label: "Attendance" },
        { to: "/timestamp", label: "Timestamp" },
        { to: "/shifts", label: "Shift" },
        { to: "/leave", label: "Leave" }
      ]
    },
    { 
      to: "/salary", 
      label: "Salary", 
      icon: <Wallet className="w-4 h-4" />,
      tabs: []
    },
    { 
      to: "/self-service", 
      label: "Self-service", 
      icon: <UserRound className="w-4 h-4" />,
      tabs: []
    },
    { 
      to: "/documents", 
      label: "Documents", 
      icon: <FileText className="w-4 h-4" />,
      tabs: []
    }
  ];

  // HR personnel sections and tabs
  const hrSections = [
    { 
      to: "/hr/employee-management", 
      label: "Employee Management", 
      icon: <Users className="w-4 h-4" />,
      tabs: []
    },
    { 
      to: "/hr/attendance-leave", 
      label: "Attendance & Leave", 
      icon: <Calendar className="w-4 h-4" />,
      tabs: [
        { to: "/hr/attendance-leave", label: "Attendance" },
        { to: "/hr/attendance-leave/timestamp", label: "Timestamp" },
        { to: "/hr/attendance-leave/shifts", label: "Shift" },
        { to: "/hr/attendance-leave/leave", label: "Leave" }
      ]
    },
    { 
      to: "/hr/payroll", 
      label: "Payroll", 
      icon: <Wallet className="w-4 h-4" />,
      tabs: []
    },
    { 
      to: "/hr/budget-management", 
      label: "Budget Management", 
      icon: <Banknote className="w-4 h-4" />,
      tabs: [
        { to: "/hr/budget-planning", label: "Budget Planning" },
        { to: "/hr/budget-management", label: "Budget Management" }
      ]
    }
  ];

  // Get the appropriate sections based on current module
  const currentSections = isHrSection ? hrSections : employeeSections;

  // Get current section and its tabs
  const getCurrentSection = () => {
    if (isSettingsPage) return null;
    const section = currentSections.find(section => 
      currentPath.startsWith(section.to) || 
      section.tabs.some(tab => tab.to === currentPath)
    );
    return section;
  };

  const currentSection = getCurrentSection();
  const currentTabs = currentSection?.tabs || [];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-2.5 top-2.5 bottom-2.5 z-[60] transition-all duration-300 ease-in-out rounded-lg flex flex-col",
          isSidebarExpanded ? "w-64" : "w-16"
        )}
        style={{ backgroundColor: colors?.sidebar?.background }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* HRIS Logo */}
        <div className="p-4 border-b" style={{ borderColor: colors?.sidebar?.divider }}>
          {isSidebarExpanded && (
            <h1 className="font-bold text-xl" style={{ color: colors?.sidebar?.activeItemText }}>
              HRIS
            </h1>
          )}
        </div>

        {/* Notification */}
        <div className="p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn(
                    "p-2 rounded-md flex items-center sidebar-item",
                    isSidebarExpanded ? "w-full" : "justify-center"
                  )}
                >
                  <div className="relative">
                    <Bell className="w-4 h-4 text-white" />
                    <span className="notification-badge">3</span>
                  </div>
                  {isSidebarExpanded && <span className="ml-3 text-sm">Notifications</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="bg-gray-800 text-white"
                style={{
                  visibility: isSidebarExpanded ? 'hidden' : 'visible'
                }}
              >
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Personal Module */}
          <div className="px-2 mb-4">
            {/* Personal Group Label */}
            {isSidebarExpanded && (
              <div className="px-2 py-1.5 mb-1">
                <span className="text-sm font-semibold text-white">
                  Personal
                </span>
              </div>
            )}

            {/* Personal Module Sections */}
            <div className="space-y-1">
              {employeeSections.map((section) => (
                <NavLink
                  key={section.to}
                  to={section.to}
                  className={({ isActive }) => cn(
                    "flex items-center w-full p-2 rounded-md text-sm sidebar-item",
                    isActive ? "bg-white/20" : ""
                  )}
                  style={{ 
                    color: colors?.sidebar?.itemText
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">{section.icon}</div>
                  {isSidebarExpanded && <span className="ml-3">{section.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>

          {/* HR Core Module */}
          <div className="px-2">
            {/* HR Core Group Label */}
            {isSidebarExpanded && (
              <div className="px-2 py-1.5 mb-1">
                <span className="text-sm font-semibold text-white">
                  HR Core
                </span>
              </div>
            )}

            {/* HR Core Module Sections */}
            <div className="space-y-1">
              {hrSections.map((section) => (
                <NavLink
                  key={section.to}
                  to={section.to}
                  className={({ isActive }) => cn(
                    "flex items-center w-full p-2 rounded-md text-sm sidebar-item",
                    isActive ? "bg-white/20" : ""
                  )}
                  style={{ 
                    color: colors?.sidebar?.itemText
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">{section.icon}</div>
                  {isSidebarExpanded && <span className="ml-3">{section.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Items */}
        <div className="mt-auto">
          {/* Account */}
          <div className="p-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate('/settings')}
                    className={cn(
                      "p-2 rounded-md flex items-center sidebar-item",
                      isSidebarExpanded ? "w-full" : "justify-center"
                    )}
                  >
                    <UserRound className="w-4 h-4" />
                    {isSidebarExpanded && <span className="ml-3 text-sm">Account</span>}
                  </button>
                </TooltipTrigger>
                {!isSidebarExpanded && (
                  <TooltipContent side="right" className="bg-gray-800 text-white">
                    <p>Account</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Dark Mode Toggle */}
          <div className="p-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleDarkMode}
                    className={cn(
                      "p-2 rounded-md flex items-center sidebar-item",
                      isSidebarExpanded ? "w-full" : "justify-center"
                    )}
                  >
                    {colors?.isDarkMode ? (
                      <>
                        <Sun className="w-4 h-4" />
                        {isSidebarExpanded && <span className="ml-3 text-sm">Light Mode</span>}
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        {isSidebarExpanded && <span className="ml-3 text-sm">Dark Mode</span>}
                      </>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 h-screen overflow-y-auto">
        {!isSettingsPage && currentSection && (
          <div className="sticky top-0 z-50 border-b bg-theme-global" style={{ 
            borderColor: colors?.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : undefined 
          }}>
            {/* Hierarchical Breadcrumb Navigation */}
            <div className="flex items-center h-12 px-4">
              <div className="flex items-center gap-2">
                {/* Module Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors">
                    <div className="flex items-center">
                      {isHrSection ? (
                        <Briefcase className={cn(
                          "w-4 h-4 mr-1.5",
                          colors?.isDarkMode ? "text-white" : "text-primary"
                        )} />
                      ) : (
                        <User className={cn(
                          "w-4 h-4 mr-1.5",
                          colors?.isDarkMode ? "text-white" : "text-primary"
                        )} />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        colors?.isDarkMode ? "text-white" : "text-primary"
                      )}>
                        {isHrSection ? 'HR Core' : 'Personal'}
                      </span>
                      <ChevronRight className={cn(
                        "w-4 h-4 ml-1",
                        colors?.isDarkMode ? "text-white/60" : "text-gray-400"
                      )} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className={cn(!isHrSection && "text-primary")}
                    >
                      <User className="w-4 h-4 mr-1.5" />
                      Personal
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/hr/employee-management')}
                      className={cn(isHrSection && "text-primary")}
                    >
                      <Briefcase className="w-4 h-4 mr-1.5" />
                      HR Core
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Section Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-primary/5">
                    <div className="flex items-center">
                      {currentSection?.icon && (
                        <div className="w-4 h-4 mr-1.5">
                          {currentSection.icon}
                        </div>
                      )}
                      <span className="text-sm font-medium text-primary">
                        {currentSection?.label}
                      </span>
                      {currentTabs.length > 0 && (
                        <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {currentSections.map((section) => (
                      <DropdownMenuItem
                        key={section.to}
                        onClick={() => navigate(section.to)}
                        className={cn(section === currentSection && "text-primary")}
                      >
                        {section.icon && (
                          <div className="w-4 h-4 mr-1.5">
                            {section.icon}
                          </div>
                        )}
                        {section.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tab Dropdown (only if section has tabs) */}
                {currentTabs.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-primary/5">
                      <span className="text-sm font-medium text-primary">
                        {currentTabs.find(tab => tab.to === currentPath)?.label || currentTabs[0].label}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {currentTabs.map((tab) => (
                        <DropdownMenuItem
                          key={tab.to}
                          onClick={() => navigate(tab.to)}
                          className={cn(tab.to === currentPath && "text-primary")}
                        >
                          {tab.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 main-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
