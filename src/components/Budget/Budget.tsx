
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useBudgetStore } from '@/store/budgetStore';
import { toast } from 'sonner';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  period: string;
}

const Budget = () => {
  const { budgets, isLoading, fetchBudgets, addBudget, updateBudget, deleteBudget } = useBudgetStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [newBudgetForm, setNewBudgetForm] = useState({
    category: '',
    description: '',
    budgeted: '',
    period: ''
  });
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudgetForm.category || !newBudgetForm.budgeted) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addBudget({
        category: newBudgetForm.category,
        description: newBudgetForm.description,
        budgeted: parseFloat(newBudgetForm.budgeted),
        period: newBudgetForm.period || 'monthly',
        actual: 0
      });
      
      setNewBudgetForm({ category: '', description: '', budgeted: '', period: '' });
      toast.success('Budget item added successfully');
    } catch (error) {
      toast.error('Failed to add budget item');
    }
  };

  const handleUpdateBudget = async (id: string, updates: Partial<BudgetItem>) => {
    try {
      await updateBudget(id, updates);
      setEditingBudget(null);
      toast.success('Budget updated successfully');
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success('Budget item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete budget item');
    }
  };

  const getTotalBudgeted = () => budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const getTotalActual = () => budgets.reduce((sum, budget) => sum + budget.actual, 0);
  const getTotalVariance = () => getTotalBudgeted() - getTotalActual();
  const getVariancePercentage = () => {
    const total = getTotalBudgeted();
    return total > 0 ? ((getTotalVariance() / total) * 100) : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'over-budget': return 'bg-red-100 text-red-800';
      case 'under-budget': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotalBudgeted().toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actual</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotalActual().toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Variance</p>
                <p className={`text-2xl font-bold ${getTotalVariance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(getTotalVariance()).toLocaleString()}
                </p>
              </div>
              {getTotalVariance() >= 0 ? 
                <TrendingUp className="w-8 h-8 text-green-600" /> : 
                <TrendingDown className="w-8 h-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Variance %</p>
                <p className={`text-2xl font-bold ${getVariancePercentage() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(getVariancePercentage()).toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add-budget">Add Budget</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell className="font-medium">{budget.category}</TableCell>
                        <TableCell>{budget.description}</TableCell>
                        <TableCell>{budget.period}</TableCell>
                        <TableCell>${budget.budgeted.toLocaleString()}</TableCell>
                        <TableCell>${budget.actual.toLocaleString()}</TableCell>
                        <TableCell className={budget.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${Math.abs(budget.variance).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={Math.min(budget.percentage, 100)} 
                              className="w-16" 
                            />
                            <span className="text-sm">{budget.percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(budget.status)}>
                            {budget.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingBudget(budget)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBudget(budget.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {budgets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                          No budget items found. Add your first budget item to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-budget">
          <Card>
            <CardHeader>
              <CardTitle>Add New Budget Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={newBudgetForm.category}
                      onChange={(e) => setNewBudgetForm({...newBudgetForm, category: e.target.value})}
                      placeholder="e.g., Marketing, Operations"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgeted">Budgeted Amount *</Label>
                    <Input
                      id="budgeted"
                      type="number"
                      step="0.01"
                      value={newBudgetForm.budgeted}
                      onChange={(e) => setNewBudgetForm({...newBudgetForm, budgeted: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newBudgetForm.description}
                    onChange={(e) => setNewBudgetForm({...newBudgetForm, description: e.target.value})}
                    placeholder="Brief description of the budget item"
                  />
                </div>
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select 
                    value={newBudgetForm.period} 
                    onValueChange={(value) => setNewBudgetForm({...newBudgetForm, period: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Budget Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{budget.category}</span>
                        <span>{budget.percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(budget.percentage, 100)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-sm text-gray-600">{budget.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${budget.budgeted.toLocaleString()}</p>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Budget Modal/Form */}
      {editingBudget && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Budget Item</h3>
            <div className="space-y-4">
              <div>
                <Label>Actual Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingBudget.actual}
                  onChange={(e) => setEditingBudget({
                    ...editingBudget, 
                    actual: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUpdateBudget(editingBudget.id, { actual: editingBudget.actual })}
                  className="flex-1"
                >
                  Update
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingBudget(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Budget;
