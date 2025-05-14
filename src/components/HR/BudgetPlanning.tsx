
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock departments data
const departments = [
  { id: "1", name: "Human Resources", headcount: 5 },
  { id: "2", name: "Engineering", headcount: 15 },
  { id: "3", name: "Marketing", headcount: 8 },
  { id: "4", name: "Finance", headcount: 6 },
  { id: "5", name: "Support", headcount: 10 },
];

// Mock budget plan initial data
const initialBudgetData = [
  { 
    id: "1", 
    department: "Human Resources", 
    currentYearBudget: 425000,
    nextYearProjection: 450000,
    salaryIncrease: 5.9,
    newPositions: 1,
    bonusBudget: 21250,
    benefitsCost: 85000,
    totalBudget: 556250
  },
  { 
    id: "2", 
    department: "Engineering", 
    currentYearBudget: 1425000,
    nextYearProjection: 1650000,
    salaryIncrease: 7.5,
    newPositions: 3,
    bonusBudget: 82500,
    benefitsCost: 330000,
    totalBudget: 2062500
  },
  { 
    id: "3", 
    department: "Marketing", 
    currentYearBudget: 640000,
    nextYearProjection: 680000,
    salaryIncrease: 6.3,
    newPositions: 1,
    bonusBudget: 34000,
    benefitsCost: 136000,
    totalBudget: 850000
  },
  { 
    id: "4", 
    department: "Finance", 
    currentYearBudget: 510000,
    nextYearProjection: 530000,
    salaryIncrease: 3.9,
    newPositions: 0,
    bonusBudget: 51000,
    benefitsCost: 106000,
    totalBudget: 687000
  },
  { 
    id: "5", 
    department: "Support", 
    currentYearBudget: 680000,
    nextYearProjection: 730000,
    salaryIncrease: 4.5,
    newPositions: 1,
    bonusBudget: 36500,
    benefitsCost: 146000,
    totalBudget: 912500
  },
];

const BudgetPlanning = () => {
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [budgetPlanData, setBudgetPlanData] = useState(initialBudgetData);
  
  // Calculate totals
  const totalCurrentBudget = budgetPlanData.reduce((sum, item) => sum + item.currentYearBudget, 0);
  const totalNextYearBudget = budgetPlanData.reduce((sum, item) => sum + item.nextYearProjection, 0);
  const totalBonusBudget = budgetPlanData.reduce((sum, item) => sum + item.bonusBudget, 0);
  const totalBenefitsCost = budgetPlanData.reduce((sum, item) => sum + item.benefitsCost, 0);
  const grandTotalBudget = budgetPlanData.reduce((sum, item) => sum + item.totalBudget, 0);
  const totalNewPositions = budgetPlanData.reduce((sum, item) => sum + item.newPositions, 0);
  const averageSalaryIncrease = (budgetPlanData.reduce((sum, item) => sum + item.salaryIncrease, 0) / budgetPlanData.length).toFixed(2);
  
  const handleSaveBudgetPlan = () => {
    // In a real app, this would save the budget plan data
    alert('Budget plan saved successfully!');
  };
  
  const handleUpdateDepartmentBudget = (deptId: string, field: string, value: number) => {
    // In a real app, this would update a specific department's budget value
    const updatedData = budgetPlanData.map(item => {
      if (item.id === deptId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setBudgetPlanData(updatedData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Budget Planning</h1>
        <div className="flex items-center space-x-2">
          <Select value={fiscalYear} onValueChange={setFiscalYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Fiscal Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">FY 2024</SelectItem>
              <SelectItem value="2025">FY 2025</SelectItem>
              <SelectItem value="2026">FY 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSaveBudgetPlan}>Save Budget Plan</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${grandTotalBudget.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              {fiscalYear} Fiscal Year
            </p>
            <div className="text-sm mt-4">
              <div className="flex justify-between items-center mt-2">
                <span>Current Year Budget:</span>
                <span className="font-medium">${totalCurrentBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Increase:</span>
                <span className="font-medium text-green-600">
                  {((grandTotalBudget - totalCurrentBudget) / totalCurrentBudget * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salary Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Base Salaries</p>
                <div className="text-xl font-bold">${totalNextYearBudget.toLocaleString()}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Increase</p>
                <div className="text-xl font-bold">{averageSalaryIncrease}%</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bonus Budget</p>
                <div className="text-xl font-bold">${totalBonusBudget.toLocaleString()}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Benefits Cost</p>
                <div className="text-xl font-bold">${totalBenefitsCost.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Headcount Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{totalNewPositions}</div>
            <p className="text-sm text-gray-500 mt-1">
              New Positions Planned
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {departments.map(dept => (
                <div key={dept.id}>
                  <p className="text-xs text-gray-500">{dept.name}</p>
                  <p className="font-medium">{dept.headcount} staff</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Current Budget</TableHead>
                  <TableHead className="text-right">Projected Budget</TableHead>
                  <TableHead className="text-right">% Increase</TableHead>
                  <TableHead className="text-right">New Positions</TableHead>
                  <TableHead className="text-right">Bonus Budget</TableHead>
                  <TableHead className="text-right">Benefits Cost</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetPlanData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.department}</TableCell>
                    <TableCell className="text-right">${item.currentYearBudget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.nextYearProjection.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.salaryIncrease}%</TableCell>
                    <TableCell className="text-right">{item.newPositions}</TableCell>
                    <TableCell className="text-right">${item.bonusBudget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.benefitsCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">${item.totalBudget.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">TOTAL</TableCell>
                  <TableCell className="text-right font-bold">${totalCurrentBudget.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">${totalNextYearBudget.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">{averageSalaryIncrease}%</TableCell>
                  <TableCell className="text-right font-bold">{totalNewPositions}</TableCell>
                  <TableCell className="text-right font-bold">${totalBonusBudget.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">${totalBenefitsCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">${grandTotalBudget.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Budget Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="select-department">Select Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="select-department">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button disabled={!selectedDepartment}>View Details</Button>
              </div>
            </div>
            
            {selectedDepartment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-budget">Current Year Budget</Label>
                    <Input type="number" id="current-budget" disabled value="680000" />
                  </div>
                  <div>
                    <Label htmlFor="next-year">Next Year Projection</Label>
                    <Input type="number" id="next-year" value="730000" />
                  </div>
                  <div>
                    <Label htmlFor="salary-increase">Salary Increase %</Label>
                    <Input type="number" id="salary-increase" value="4.5" />
                  </div>
                  <div>
                    <Label htmlFor="new-positions">New Positions</Label>
                    <Input type="number" id="new-positions" value="1" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bonus-budget">Bonus Budget</Label>
                    <Input type="number" id="bonus-budget" value="36500" />
                  </div>
                  <div>
                    <Label htmlFor="benefits-cost">Benefits Cost</Label>
                    <Input type="number" id="benefits-cost" value="146000" />
                  </div>
                  <div>
                    <Label htmlFor="total-budget">Total Budget</Label>
                    <Input type="number" id="total-budget" disabled value="912500" />
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button>Update Department Budget</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanning;
