
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BudgetManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample budget overview data
  const budgetData = {
    totalBudget: 1200000,
    spentAmount: 850000,
    remainingAmount: 350000,
    percentUsed: 70.83,
    plannedBudget: 950000,
    plannedRemaining: 250000,
    plannedPercent: 79.17
  };

  // Sample department spending data
  const departmentData = [
    { name: 'Engineering', budget: 350000, spent: 280000, remaining: 70000, percentUsed: 80 },
    { name: 'Marketing', budget: 250000, spent: 180000, remaining: 70000, percentUsed: 72 },
    { name: 'Sales', budget: 300000, spent: 220000, remaining: 80000, percentUsed: 73.33 },
    { name: 'HR', budget: 150000, spent: 100000, remaining: 50000, percentUsed: 66.67 },
    { name: 'Operations', budget: 150000, spent: 70000, remaining: 80000, percentUsed: 46.67 },
  ];

  // Sample data for bar chart
  const barChartData = [
    { name: 'Jan', planned: 78000, actual: 75000 },
    { name: 'Feb', planned: 78000, actual: 76500 },
    { name: 'Mar', planned: 78000, actual: 79200 },
    { name: 'Apr', planned: 78000, actual: 80100 },
    { name: 'May', planned: 78000, actual: 77800 },
    { name: 'Jun', planned: 80000, actual: 82000 },
    { name: 'Jul', planned: 80000, actual: 81200 },
    { name: 'Aug', planned: 80000, actual: 79900 },
    { name: 'Sep', planned: 80000, actual: 78500 },
    { name: 'Oct', planned: 80000, actual: 0 },
    { name: 'Nov', planned: 80000, actual: 0 },
    { name: 'Dec', planned: 80000, actual: 0 },
  ];

  // Sample pie chart data
  const pieChartData = [
    { name: 'Salaries', value: 600000 },
    { name: 'Benefits', value: 150000 },
    { name: 'Bonuses', value: 50000 },
    { name: 'Training', value: 30000 },
    { name: 'Other', value: 20000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Detailed expense records
  const expenseRecords = [
    { id: 1, date: '2023-09-01', department: 'Engineering', category: 'Salaries', amount: 58000, description: 'Monthly payroll' },
    { id: 2, date: '2023-09-01', department: 'Marketing', category: 'Salaries', amount: 42000, description: 'Monthly payroll' },
    { id: 3, date: '2023-09-01', department: 'Sales', category: 'Salaries', amount: 53000, description: 'Monthly payroll' },
    { id: 4, date: '2023-09-01', department: 'HR', category: 'Salaries', amount: 25000, description: 'Monthly payroll' },
    { id: 5, date: '2023-09-01', department: 'Operations', category: 'Salaries', amount: 21000, description: 'Monthly payroll' },
    { id: 6, date: '2023-09-05', department: 'Marketing', category: 'Training', amount: 5000, description: 'Digital marketing course' },
    { id: 7, date: '2023-09-10', department: 'Engineering', category: 'Benefits', amount: 12000, description: 'Health insurance' },
    { id: 8, date: '2023-09-15', department: 'Sales', category: 'Bonuses', amount: 8000, description: 'Performance bonuses' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <div>
          <select className="border rounded-md p-2 bg-white">
            <option>FY 2023-2024</option>
            <option>FY 2022-2023</option>
            <option>FY 2021-2022</option>
          </select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Budget</CardTitle>
                <CardDescription>FY 2023-2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.totalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Spent Amount</CardTitle>
                <CardDescription>Year to date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.spentAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{budgetData.percentUsed}% of total budget</div>
                <Progress value={budgetData.percentUsed} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Remaining Budget</CardTitle>
                <CardDescription>Available funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.remainingAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{100 - budgetData.percentUsed}% of total budget</div>
                <Progress value={100 - budgetData.percentUsed} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Spending</CardTitle>
              <CardDescription>Monthly comparison for the current fiscal year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar name="Planned Budget" dataKey="planned" fill="#8884d8" />
                    <Bar name="Actual Spending" dataKey="actual" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Status</CardTitle>
                <CardDescription>Current vs Planned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Actual Spending</div>
                      <div className="text-sm font-medium">{budgetData.percentUsed}%</div>
                    </div>
                    <Progress value={budgetData.percentUsed} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-gray-500">${budgetData.spentAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${budgetData.totalBudget.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Planned Spending</div>
                      <div className="text-sm font-medium">{budgetData.plannedPercent}%</div>
                    </div>
                    <Progress value={budgetData.plannedPercent} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-gray-500">${budgetData.plannedBudget.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${budgetData.totalBudget.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Budget Summary</CardTitle>
              <CardDescription>Breakdown of budget allocation and spending by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Department</th>
                      <th className="text-left pb-2">Total Budget</th>
                      <th className="text-left pb-2">Spent</th>
                      <th className="text-left pb-2">Remaining</th>
                      <th className="text-left pb-2">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">{dept.name}</td>
                        <td className="py-3">${dept.budget.toLocaleString()}</td>
                        <td className="py-3">${dept.spent.toLocaleString()}</td>
                        <td className="py-3">${dept.remaining.toLocaleString()}</td>
                        <td className="py-3 w-40">
                          <div className="flex items-center gap-2">
                            <Progress value={dept.percentUsed} className="h-2 flex-1" />
                            <span className="text-sm">{dept.percentUsed}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentData.map((dept, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle>{dept.name}</CardTitle>
                  <CardDescription>${dept.budget.toLocaleString()} Total Budget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Budget Used</div>
                      <div className="text-sm font-medium">{dept.percentUsed}%</div>
                    </div>
                    <Progress value={dept.percentUsed} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Spent</div>
                      <div className="font-medium">${dept.spent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Remaining</div>
                      <div className="font-medium">${dept.remaining.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trends</CardTitle>
                <CardDescription>Planned vs actual spending by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Bar name="Planned Budget" dataKey="planned" fill="#8884d8" />
                      <Bar name="Actual Spending" dataKey="actual" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown of spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expense Records</CardTitle>
              <CardDescription>Detailed expense entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Date</th>
                      <th className="text-left pb-2">Department</th>
                      <th className="text-left pb-2">Category</th>
                      <th className="text-left pb-2">Amount</th>
                      <th className="text-left pb-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseRecords.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="py-3">{record.date}</td>
                        <td className="py-3">{record.department}</td>
                        <td className="py-3">{record.category}</td>
                        <td className="py-3">${record.amount.toLocaleString()}</td>
                        <td className="py-3">{record.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetManagement;
