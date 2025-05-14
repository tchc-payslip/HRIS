
import { create } from 'zustand';

interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  fileSize: string;
}

interface DocumentsState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  
  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      const mockDocuments = [
        {
          id: '1',
          title: 'Employment Contract',
          type: 'PDF',
          createdAt: '2023-01-15T10:30:00Z',
          updatedAt: '2023-01-15T10:30:00Z',
          fileUrl: '/documents/contract.pdf',
          fileSize: '2.3 MB',
        },
        {
          id: '2',
          title: 'Employee Handbook',
          type: 'PDF',
          createdAt: '2023-01-10T14:45:00Z',
          updatedAt: '2023-02-05T09:15:00Z',
          fileUrl: '/documents/handbook.pdf',
          fileSize: '5.7 MB',
        },
        {
          id: '3',
          title: 'Tax Forms',
          type: 'PDF',
          createdAt: '2023-03-20T11:20:00Z',
          updatedAt: '2023-03-20T11:20:00Z',
          fileUrl: '/documents/tax-forms.pdf',
          fileSize: '1.2 MB',
        },
      ];
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({ documents: mockDocuments, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch documents', isLoading: false });
    }
  },
  
  uploadDocument: async (document) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newDocument = {
        ...document,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set((state) => ({
        documents: [...state.documents, newDocument],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to upload document', isLoading: false });
    }
  },
  
  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // This would be a real API call in a production app
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete document', isLoading: false });
    }
  },
}));
