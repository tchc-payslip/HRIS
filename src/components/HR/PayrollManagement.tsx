import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PayrollManagement = () => {
  return (
    <div className="pt-0 min-h-screen bg-secondary">
      <Tabs defaultValue="payroll" className="space-y-2">
        <TabsList className="bg-background sticky top-0 z-30 w-full">
          <TabsTrigger 
            value="payroll"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Payroll
          </TabsTrigger>
          <TabsTrigger 
            value="salary"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Salary Structure
          </TabsTrigger>
          <TabsTrigger 
            value="benefits"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Benefits
          </TabsTrigger>
          <TabsTrigger 
            value="deductions"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Deductions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="m-0">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Hello World - Payroll management placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="m-0">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Hello World - Salary structure placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="m-0">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Benefits Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Hello World - Benefits management placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="m-0">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Deductions Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Hello World - Deductions management placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollManagement; 