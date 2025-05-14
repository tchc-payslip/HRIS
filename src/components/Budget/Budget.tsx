
import React, { useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';

const Budget = () => {
  const { budgetItems, expenses, fiscalYear, totalBudget, totalSpent, isLoading, error, fetchBudgetData, submitExpense } = useBudgetStore();
  const [submitExpenseOpen, setSubmitExpenseOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
  });
  
  useEffect(() => {
    fetchBudgetData(fiscalYear);
  }, [fetchBudgetData, fiscalYear]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseForm.category || !expenseForm.description || !expenseForm.amount) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await submitExpense({
        date: expenseForm.date,
        category: expenseForm.category,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
      });
      
      toast({
        title: "Expense submitted",
        description: "Your expense has been submitted for approval.",
      });
      
      setSubmitExpenseOpen(false);
      setExpenseForm({
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        amount: '',
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit expense. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate percent spent for progress bars
  const percentSpent = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  
  // Prepare data for bar chart
  const chartData = budgetItems.map((item) => ({
    name: item.name,
    budget: item.amount,
    spent: item.spent,
  }));
  
  // Set years for fiscal year select
  const currentYear = new Date().getFullYear();
  const fiscalYears = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  
  return (
    <div>
      <h1 className="page-title">Budget Management</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            Track and manage your department's budget allocation and expenses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-32">
            <Select
              value={fiscalYear}
              onValueChange={(year) => fetchBudgetData(year)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Fiscal Year" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    FY {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={submitExpenseOpen} onOpenChange={setSubmitExpenseOpen}>
            <DialogTrigger asChild>
              <Button>Submit Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New Expense</DialogTitle>
                <DialogDescription>
                  Submit a new expense for approval and reimbursement.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitExpense}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => setExpenseForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount ($)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Budget</CardTitle>
            <CardDescription>Total allocated budget for FY {fiscalYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>Total spent amount for FY {fiscalYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Remaining Balance</CardTitle>
            <CardDescription>Available budget for FY {fiscalYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(totalBudget - totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Overall budget utilization for FY {fiscalYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Budget Utilization</span>
              <span className="text-sm font-medium">{percentSpent.toFixed(1)}%</span>
            </div>
            <Progress value={percentSpent} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>$0</span>
              <span>{formatCurrency(totalBudget / 2)}</span>
              <span>{formatCurrency(totalBudget)}</span>
            </div>
          </div>
          
          <div className="h-80">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-lg text-gray-500">Loading chart...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="budget" name="Allocated Budget" fill="#8884d8" />
                  <Bar dataKey="spent" name="Spent Amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="categories">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Breakdown by budget category for FY {fiscalYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead className="w-[180px]">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading budget data...
                      </TableCell>
                    </TableRow>
                  ) : budgetItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No budget items found for this fiscal year
                      </TableCell>
                    </TableRow>
                  ) : (
                    budgetItems.map((item) => {
                      const percentage = (item.spent / item.amount) * 100;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{formatCurrency(item.spent)}</TableCell>
                          <TableCell>{formatCurrency(item.remaining)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={percentage}
                                className="h-2"
                                indicatorColor={
                                  percentage > 90
                                    ? 'bg-red-500'
                                    : percentage > 75
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }
                              />
                              <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>List of recently submitted expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading expense data...
                      </TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{expense.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              expense.status === 'approved'
                                ? 'bg-green-500'
                                : expense.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }
                          >
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budget;
