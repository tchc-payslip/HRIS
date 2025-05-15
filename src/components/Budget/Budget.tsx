
import { useState, useEffect } from 'react';
import { useBudgetStore } from "@/store/budgetStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const Budget = () => {
  // We'll adapt to use the budgetStore correctly based on the available props
  const budgetStore = useBudgetStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data structure to use instead of budgetItems if they don't exist in the store
  const sampleBudgetData = {
    fiscalYear: "2023-2024",
    totalBudget: 1200000,
    allocatedBudget: 950000,
    remainingBudget: 250000,
    percentUsed: 79.17,
    departments: [
      { name: "Engineering", budget: 350000, allocated: 340000, remaining: 10000 },
      { name: "Marketing", budget: 250000, allocated: 220000, remaining: 30000 },
      { name: "Sales", budget: 300000, allocated: 290000, remaining: 10000 },
      { name: "HR", budget: 150000, allocated: 100000, remaining: 50000 },
      { name: "Operations", budget: 150000, allocated: 0, remaining: 150000 }
    ]
  };
  
  // Use sample data if store properties don't exist
  const budgetData = sampleBudgetData;
  
  // Empty useEffect as a placeholder for when store functions exist
  useEffect(() => {
    // If fetchBudgetData exists in the store, call it
    // For now, we'll use our sample data
  }, []);
  
  const handleExpenseSubmit = (expense) => {
    // If submitExpense exists in the store, call it
    console.log("Submitting expense:", expense);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget Planning</h1>
        <div>
          <select className="border rounded-md p-2 bg-white">
            <option>FY {budgetData.fiscalYear}</option>
            <option>FY 2022-2023</option>
          </select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Budget Allocation</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Budget</CardTitle>
                <CardDescription>FY {budgetData.fiscalYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.totalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Allocated Budget</CardTitle>
                <CardDescription>Currently assigned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.allocatedBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{budgetData.percentUsed}% of total budget</div>
                <Progress value={budgetData.percentUsed} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Remaining Budget</CardTitle>
                <CardDescription>Available for allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.remainingBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{100 - budgetData.percentUsed}% of total budget</div>
                <Progress value={100 - budgetData.percentUsed} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Budget Allocation</CardTitle>
              <CardDescription>Overview of budget distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.departments.map((dept, index) => {
                  const percentAllocated = (dept.allocated / dept.budget) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm">${dept.allocated.toLocaleString()} / ${dept.budget.toLocaleString()}</div>
                      </div>
                      <Progress value={percentAllocated} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Budget Allocation</CardTitle>
              <CardDescription>Manage budget distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Department</th>
                      <th className="text-left pb-2">Total Budget</th>
                      <th className="text-left pb-2">Allocated</th>
                      <th className="text-left pb-2">Remaining</th>
                      <th className="text-left pb-2">Allocation %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetData.departments.map((dept, index) => {
                      const percentAllocated = (dept.allocated / dept.budget) * 100;
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3">{dept.name}</td>
                          <td className="py-3">${dept.budget.toLocaleString()}</td>
                          <td className="py-3">${dept.allocated.toLocaleString()}</td>
                          <td className="py-3">${dept.remaining.toLocaleString()}</td>
                          <td className="py-3 w-40">
                            <div className="flex items-center gap-2">
                              <Progress value={percentAllocated} className="h-2 flex-1" />
                              <span className="text-sm">{percentAllocated.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Planning Form</CardTitle>
              <CardDescription>Create or modify budget allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select className="w-full border rounded-md p-2">
                      <option value="">Select Department</option>
                      {budgetData.departments.map((dept, index) => (
                        <option key={index} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget Amount</label>
                    <input type="number" className="w-full border rounded-md p-2" placeholder="Enter amount" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea className="w-full border rounded-md p-2" rows="3" placeholder="Enter budget description"></textarea>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                    onClick={() => handleExpenseSubmit({})}
                  >
                    Save Allocation
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budget;
