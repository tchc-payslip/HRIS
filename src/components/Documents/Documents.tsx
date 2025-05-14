
import React, { useEffect, useState } from 'react';
import { useDocumentsStore } from '@/store/documentsStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Trash2, Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

const Documents = () => {
  const { documents, isLoading, error, fetchDocuments, uploadDocument, deleteDocument } = useDocumentsStore();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'PDF',
    file: null as File | null,
  });
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadForm((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };
  
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const fileSizeInMB = (uploadForm.file.size / (1024 * 1024)).toFixed(1);
      
      await uploadDocument({
        title: uploadForm.title,
        type: uploadForm.type,
        fileUrl: URL.createObjectURL(uploadForm.file),
        fileSize: `${fileSizeInMB} MB`,
      });
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
      
      setUploadDialogOpen(false);
      setUploadForm({
        title: '',
        type: 'PDF',
        file: null,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteDocument = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDocument(id);
        toast({
          title: "Document deleted",
          description: "The document has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div>
      <h1 className="page-title">Documents</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Manage your important documents here</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a new document to your document library.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={uploadForm.type}
                    onValueChange={(value) => setUploadForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                      <SelectItem value="JPG">JPG</SelectItem>
                      <SelectItem value="PNG">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="tax">Tax Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>View and manage all your documents</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-lg text-gray-500">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-gray-500 text-center mb-6">
                    You haven't uploaded any documents yet.
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Your First Document
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{doc.fileSize}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>View and manage your contract documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No contracts found</h3>
                <p className="text-gray-500 text-center mb-6">
                  Upload your contract documents for better organization.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Contract Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal</CardTitle>
              <CardDescription>View and manage your personal documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No personal documents found</h3>
                <p className="text-gray-500 text-center mb-6">
                  Upload your personal documents for better organization.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Personal Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Documents</CardTitle>
              <CardDescription>View and manage your tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No tax documents found</h3>
                <p className="text-gray-500 text-center mb-6">
                  Upload your tax documents for better organization.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Tax Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
