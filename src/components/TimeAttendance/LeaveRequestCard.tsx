
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

interface LeaveRequestCardProps {
  onRequestLeave: (startDate: string, endDate: string, reason: string) => Promise<void>;
}

const LeaveRequestCard = ({ onRequestLeave }: LeaveRequestCardProps) => {
  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onRequestLeave(leaveForm.startDate, leaveForm.endDate, leaveForm.reason);
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval.",
      });
      setRequestLeaveOpen(false);
      setLeaveForm({
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Failed to submit your leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> Request Leave
        </CardTitle>
        <CardDescription>Submit time-off requests for approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Dialog open={requestLeaveOpen} onOpenChange={setRequestLeaveOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Request Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Submit a request for your time off. All requests require approval from your manager.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLeaveRequest}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="col-span-3"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="col-span-3"
                      required
                      min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      Reason
                    </Label>
                    <Textarea
                      id="reason"
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;
