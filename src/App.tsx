
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Employee self-service components
import EmployeeProfile from "./components/EmployeeProfile/EmployeeProfile";
import Documents from "./components/Documents/Documents";
import TimeAttendance from "./components/TimeAttendance/TimeAttendance";
import Salary from "./components/Salary/Salary";
import Shifts from "./components/Shifts/Shifts";
import SelfService from "./components/SelfService/SelfService";

// HR management components
import EmployeeManagement from "./components/HR/EmployeeManagement";
import AttendanceLeaveManagement from "./components/HR/AttendanceLeaveManagement";
import PayrollCompensation from "./components/HR/PayrollCompensation";
import BudgetPlanning from "./components/HR/BudgetPlanning";
import BudgetManagement from "./components/HR/BudgetManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          
          {/* Employee Self-Service Routes */}
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="documents" element={<Documents />} />
          <Route path="attendance" element={<TimeAttendance />} />
          <Route path="salary" element={<Salary />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="self-service" element={<SelfService />} />
          
          {/* HR Administration Routes */}
          <Route path="hr/employee-management" element={<EmployeeManagement />} />
          <Route path="hr/attendance-leave" element={<AttendanceLeaveManagement />} />
          <Route path="hr/payroll" element={<PayrollCompensation />} />
          <Route path="hr/budget-planning" element={<BudgetPlanning />} />
          <Route path="hr/budget-management" element={<BudgetManagement />} />
          
          {/* Redirect any unknown paths to 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
