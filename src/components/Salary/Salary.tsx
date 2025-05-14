
import React, { useEffect } from 'react';
import { useSalaryStore } from '@/store/salaryStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Salary = () => {
  const { currentSalary, payHistory, isLoading, error, fetchSalaryData, downloadPaySlip } = useSalaryStore();
  
  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleDownloadPaySlip = async (id: string) => {
    try {
      await downloadPaySlip(id);
      toast({
        title: "Download started",
        description: "Your payslip is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download payslip. Please try again.",
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
  
  // Prepare data for line chart
  const chartData = [...payHistory]
    .sort((a, b) => new Date(a.payDate).getTime() - new Date(b.payDate).getTime())
    .map((item) => ({
      name: new Date(item.payDate).toLocaleString('default', { month: 'short' }),
      amount: item.netSalary,
    }));
  
  // Prepare data for pie chart
  const lastPayslip = payHistory[0] || {
    grossSalary: 0,
    netSalary: 0,
    taxes: 0,
    deductions: 0,
    bonuses: 0,
  };
  
  const pieData = [
    { name: 'Net Salary', value: lastPayslip.netSalary, color: '#4caf50' },
    { name: 'Taxes', value: lastPayslip.taxes, color: '#f44336' },
    { name: 'Deductions', value: lastPayslip.deductions, color: '#ff9800' },
  ];
  
  // Calculate year-to-date earnings
  const ytdEarnings = payHistory.reduce((sum, item) => sum + item.grossSalary, 0);
  
  // Calculate net vs gross difference for the last month
  const netPercentage = lastPayslip.grossSalary ? ((lastPayslip.netSalary / lastPayslip.grossSalary) * 100).toFixed(1) : '0';
  const deductionsPercentage = lastPayslip.grossSalary ? (((lastPayslip.taxes + lastPayslip.deductions) / lastPayslip.grossSalary) * 100).toFixed(1) : '0';
  
  return (
    <div>
      <h1 className="page-title">Salary & Compensation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Annual Salary</CardTitle>
            <CardDescription>Your current annual base salary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(currentSalary)}</p>
              <p className="text-sm text-gray-500 mt-2">Base salary per year</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Take-Home</CardTitle>
            <CardDescription>Your latest monthly net pay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(lastPayslip.netSalary)}</p>
              <p className="text-sm text-gray-500 mt-2">After taxes and deductions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Year-to-Date</CardTitle>
            <CardDescription>Your total earnings this year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(ytdEarnings)}</p>
              <p className="text-sm text-gray-500 mt-2">Gross earnings YTD</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Earnings Trends</CardTitle>
            <CardDescription>Your net salary over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-lg text-gray-500">Loading chart...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1EAEDB"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Latest Pay Breakdown</CardTitle>
            <CardDescription>Distribution of your latest paycheck</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-60">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-gray-500">Loading chart...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="space-y-4 my-auto">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#4caf50] rounded-full"></div>
                    <p className="text-sm">Net Salary</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-semibold">{formatCurrency(lastPayslip.netSalary)}</p>
                    <p className="text-sm text-green-600">{netPercentage}%</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#f44336] rounded-full"></div>
                    <p className="text-sm">Taxes</p>
                  </div>
                  <p className="text-lg font-semibold mt-1">{formatCurrency(lastPayslip.taxes)}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#ff9800] rounded-full"></div>
                    <p className="text-sm">Deductions</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-semibold">{formatCurrency(lastPayslip.deductions)}</p>
                    <p className="text-sm text-red-600">{deductionsPercentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pay History</CardTitle>
          <CardDescription>Your past payment records</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg text-gray-500">Loading payment records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Taxes</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Bonuses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payHistory.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.period}</TableCell>
                    <TableCell>{new Date(payslip.payDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(payslip.grossSalary)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payslip.netSalary)}</TableCell>
                    <TableCell className="flex items-center text-red-500">
                      <ArrowDownCircle className="mr-1 h-3 w-3" />
                      {formatCurrency(payslip.taxes)}
                    </TableCell>
                    <TableCell className="flex items-center text-red-500">
                      <ArrowDownCircle className="mr-1 h-3 w-3" />
                      {formatCurrency(payslip.deductions)}
                    </TableCell>
                    <TableCell className="flex items-center text-green-500">
                      {payslip.bonuses > 0 && <ArrowUpCircle className="mr-1 h-3 w-3" />}
                      {formatCurrency(payslip.bonuses)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadPaySlip(payslip.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Salary;
