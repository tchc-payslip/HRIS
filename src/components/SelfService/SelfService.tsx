
import React, { useEffect, useState } from 'react';
import { useSelfServiceStore } from '@/store/selfServiceStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BellIcon, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SelfService = () => {
  const { requests, notifications, isLoading, error, fetchRequests, fetchNotifications, submitRequest, cancelRequest, markNotificationAsRead } = useSelfServiceStore();
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    type: '',
    title: '',
    description: '',
  });
  
  useEffect(() => {
    fetchRequests();
    fetchNotifications();
  }, [fetchRequests, fetchNotifications]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestForm.type || !requestForm.title || !requestForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await submitRequest({
        type: requestForm.type as any,
        title: requestForm.title,
        description: requestForm.description,
      });
      
      toast({
        title: "Request submitted",
        description: "Your request has been submitted successfully.",
      });
      
      setNewRequestOpen(false);
      setRequestForm({
        type: '',
        title: '',
        description: '',
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelRequest = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await cancelRequest(id);
        
        toast({
          title: "Request cancelled",
          description: "Your request has been cancelled successfully.",
        });
      } catch (error) {
        toast({
          title: "Cancellation failed",
          description: "Failed to cancel your request. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleReadNotification = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'leave':
        return 'Leave Request';
      case 'equipment':
        return 'Equipment Request';
      case 'certificate':
        return 'Certificate Request';
      case 'training':
        return 'Training Request';
      case 'other':
        return 'Other Request';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const unreadNotifications = notifications.filter((notification) => !notification.read);
  
  return (
    <div>
      <h1 className="page-title">Self-Service Portal</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            Manage your requests and view notifications
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a New Request</DialogTitle>
                <DialogDescription>
                  Fill out the form below to submit a new request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitRequest}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Request Type
                    </Label>
                    <Select
                      value={requestForm.type}
                      onValueChange={(value) => setRequestForm((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leave">Leave Request</SelectItem>
                        <SelectItem value="equipment">Equipment Request</SelectItem>
                        <SelectItem value="certificate">Certificate Request</SelectItem>
                        <SelectItem value="training">Training Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={requestForm.title}
                      onChange={(e) => setRequestForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={requestForm.description}
                      onChange={(e) => setRequestForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                      rows={4}
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Requests</CardTitle>
              <CardDescription>Your currently active requests</CardDescription>
            </div>
            <Button onClick={() => setNewRequestOpen(true)}>New Request</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-lg text-gray-500">Loading requests...</p>
              </div>
            ) : requests.filter((req) => req.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No active requests</h3>
                <p className="text-gray-500 text-sm mb-6">
                  You don't have any pending requests at the moment.
                </p>
                <Button onClick={() => setNewRequestOpen(true)}>Create Your First Request</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests
                  .filter((req) => req.status === 'pending')
                  .map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between"
                    >
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Badge className="mr-2">{getTypeLabel(request.type)}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <h4 className="font-medium text-lg">{request.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">{request.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          Cancel Request
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellIcon className="mr-2 h-5 w-5" />
              Notifications
              {unreadNotifications.length > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadNotifications.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Your recent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-md ${
                      notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => handleReadNotification(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-medium ${notification.read ? '' : 'text-blue-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="certificate">Certificates</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>All your past and current requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading requests...
                      </TableCell>
                    </TableRow>
                  ) : requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {request.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{getTypeLabel(request.type)}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {request.title}
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(request.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {['leave', 'equipment', 'certificate', 'training'].map((type) => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardHeader>
                <CardTitle>{getTypeLabel(type)} History</CardTitle>
                <CardDescription>Your {type} requests history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          Loading requests...
                        </TableCell>
                      </TableRow>
                    ) : requests.filter((req) => req.type === type).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No {type} requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests
                        .filter((req) => req.type === type)
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.title}</TableCell>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.description}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SelfService;
