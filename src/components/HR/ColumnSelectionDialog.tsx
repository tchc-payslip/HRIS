
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

interface ColumnOption {
  id: string;
  label: string;
}

interface ColumnSelectionDialogProps {
  columns: ColumnOption[];
  selectedColumns: string[];
  onColumnToggle: (columnId: string) => void;
}

const ColumnSelectionDialog: React.FC<ColumnSelectionDialogProps> = ({
  columns,
  selectedColumns,
  onColumnToggle
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Settings className="h-4 w-4 mr-1" />
          Configure Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Show/Hide Columns</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {columns.map(column => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox
                id={`column-${column.id}`}
                checked={selectedColumns.includes(column.id)}
                onCheckedChange={() => onColumnToggle(column.id)}
              />
              <label
                htmlFor={`column-${column.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button type="button">Done</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnSelectionDialog;
