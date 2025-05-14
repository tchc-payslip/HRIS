
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, Download, FileDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Mock data for budget tracking
const mockBudgetData = [
  { 
    department: "Human Resources", 
    budgeted: 556250, 
    spent: 250000, 
    remaining: 306250,
    percentSpent: 45,
    monthlyData: [
      { month: 'Jan', spent: 42000 },
      { month: 'Feb', spent: 45000 },
      { month: 'Mar', spent: 48000 },
      { month: 'Apr', spent: 52000 },
      { month: 'May', spent: 63000 },
      { month: 'Jun', spent: 0 },
      { month: 'Jul', spent: 0 },
      { month: 'Aug', spent: 0 },
      { month: 'Sep', spent: 0 },
      { month: 'Oct', spent: 0 },
      { month: 'Nov', spent: 0 },
      { month: 'Dec', spent: 0 }
    ]
  },
  { 
    department: "Engineering", 
    budgeted: 2062500, 
    spent: 950000, 
    remaining: 1112500,
    percentSpent: 46,
    monthlyData: [
      { month: 'Jan', spent: 178000 },
      { month: 'Feb', spent: 185000 },
      { month: 'Mar', spent: 190000 },
      { month: 'Apr', spent: 192000 },
      { month: 'May', spent: 205000 },
      { month: 'Jun', spent: 0 },
      { month: 'Jul', spent: 0 },
      { month: 'Aug', spent: 0 },
      { month: 'Sep', spent: 0 },
      { month: 'Oct', spent: 0 },
      { month: 'Nov', spent: 0 },
      { month: 'Dec', spent: 0 }
    ]
  },
  { 
    department: "Marketing", 
    budgeted: 850000, 
    spent: 425000, 
    remaining: 425000,
    percentSpent: 50,
    monthlyData: [
      { month: 'Jan', spent: 75000 },
      { month: 'Feb', spent: 82000 },
      { month: 'Mar', spent: 86000 },
      { month: 'Apr', spent: 89000 },
      { month: 'May', spent: 93000 },
      { month: 'Jun', spent: 0 },
      { month: 'Jul', spent: 0 },
      { month: 'Aug', spent: 0 },
      { month: 'Sep', spent: 0 },
      { month: 'Oct', spent: 0 },
      { month: 'Nov', spent: 0 },
      { month: 'Dec', spent: 0 }
    ]
  },
  { 
    department: "Finance", 
    budgeted: 687000, 
    spent: 330000, 
    remaining: 357000,
    percentSpent: 48,
    monthlyData: [
      { month: 'Jan', spent: 62000 },
      { month: 'Feb', spent: 65000 },
      { month: 'Mar', spent: 66000 },
      { month: 'Apr', spent: 67000 },
      { month: 'May', spent: 70000 },
      { month: 'Jun', spent: 0 },
      { month: 'Jul', spent: 0 },
      { month: 'Aug', spent: 0 },
      { month: 'Sep', spent: 0 },
      { month: 'Oct', spent: 0 },
      { month: 'Nov', spent: 0 },
      { month: 'Dec', spent: 0 }
    ]
  },
  { 
    department: "Support", 
    budgeted: 912500, 
    spent: 410000, 
    remaining: 502500,
    percentSpent: 45,
    monthlyData: [
      { month: 'Jan', spent: 78000 },
      { month: 'Feb', spent: 82000 },
      { month: 'Mar', spent: 80000 },
      { month: 'Apr', spent: 85000 },
      { month: 'May', spent: 85000 },
      { month: 'Jun', spent: 0 },
      { month: 'Jul', spent: 0 },
      { month: 'Aug', spent: 0 },
      { month: 'Sep', spent: 0 },
      { month: 'Oct', spent: 0 },
      { month: 'Nov', spent: 0 },
      { month: 'Dec', spent: 0 }
    ]
  },
];

// Calculate totals
const totalBudget = mockBudgetData.reduce((sum, dept) => sum + dept.budgeted, 0);
const totalSpent = mockBudgetData.reduce((sum, dept) => sum + dept.spent, 0);
const totalRemaining = mockBudgetData.reduce((sum, dept) => sum + dept.remaining, 0);
const overallPercentSpent = Math.round((totalSpent / totalBudget) * 100);

// Pie chart data
const pieChartData = mockBudgetData.map(dept => ({
  name: dept.department,
  value: dept.spent
}));

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Monthly spend across all departments
const monthlySpendData = [
  { month: 'Jan', spent: 435000 },
  { month: 'Feb', spent: 459000 },
  { month: 'Mar', spent: 470000 },
  { month: 'Apr', spent: 485000 },
  { month: 'May', spent: 516000 },
  { month: 'Jun', spent: 0 },
  { month: 'Jul', spent: 0 },
  { month: 'Aug', spent: 0 },
  { month: 'Sep', spent: 0 },
  { month: 'Oct', spent: 0 },
  { month: 'Nov', spent: 0 },
  { month: 'Dec', spent: 0 }
];

const BudgetManagement = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  // Filter department data based on selection
  const departmentData = selectedDepartment 
    ? mockBudgetData.find(dept => dept.department === selectedDepartment)?.monthlyData
    : monthlySpendData;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Budget Management</h1>
        <div className="flex items-center space-x-2">
          <Select value={fiscalYear} onValueChange={setFiscalYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Fiscal Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">FY 2024</SelectItem>
              <SelectItem value="2023">FY 2023</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] pl-3 text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBudget.toLocaleString()}</div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span>FY {fiscalYear}</span>
              <span>{format(date, "MMMM yyyy")}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSpent.toLocaleString()}</div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span>{overallPercentSpent}% of total budget</span>
              <span className="text-green-600">On track</span>
            </div>
            <div className="mt-2">
              <Progress value={overallPercentSpent} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRemaining.toLocaleString()}</div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span>{100 - overallPercentSpent}% remaining</span>
              <span className="text-gray-500">7 months left</span>
            </div>
            <div className="mt-2">
              <Progress value={100 - overallPercentSpent} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Budget Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget Spend</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Line 
                      type="monotone" 
                      dataKey="spent" 
                      stroke="#3b82f6" 
                      name="Spent"
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Spending Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Department Budget Tracking</CardTitle>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {mockBudgetData.map(dept => (
                      <SelectItem key={dept.department} value={dept.department}>
                        {dept.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">% Spent</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedDepartment 
                    ? mockBudgetData.filter(dept => dept.department === selectedDepartment)
                    : mockBudgetData).map(dept => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell className="text-right">${dept.budgeted.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${dept.spent.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${dept.remaining.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{dept.percentSpent}%</TableCell>
                      <TableCell className="w-[180px]">
                        <Progress 
                          value={dept.percentSpent} 
                          className="h-2" 
                          indicatorColor={
                            dept.percentSpent > 60 ? "bg-red-500" : 
                            dept.percentSpent > 45 ? "bg-yellow-500" : 
                            "bg-green-500"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!selectedDepartment && (
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">TOTAL</TableCell>
                      <TableCell className="text-right font-bold">${totalBudget.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">${totalSpent.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">${totalRemaining.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">{overallPercentSpent}%</TableCell>
                      <TableCell>
                        <Progress value={overallPercentSpent} className="h-2" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Monthly Spending Trends</CardTitle>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {mockBudgetData.map(dept => (
                      <SelectItem key={dept.department} value={dept.department}>
                        {dept.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="spent" name="Spent" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetManagement;
