
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

// Import module pages
import EmployeeProfile from "./components/EmployeeProfile/EmployeeProfile";
import Documents from "./components/Documents/Documents";
import TimeAttendance from "./components/TimeAttendance/TimeAttendance";
import Salary from "./components/Salary/Salary";
import Budget from "./components/Budget/Budget";
import Shifts from "./components/Shifts/Shifts";
import SelfService from "./components/SelfService/SelfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/profile" replace />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="documents" element={<Documents />} />
            <Route path="attendance" element={<TimeAttendance />} />
            <Route path="salary" element={<Salary />} />
            <Route path="budget" element={<Budget />} />
            <Route path="shifts" element={<Shifts />} />
            <Route path="self-service" element={<SelfService />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
