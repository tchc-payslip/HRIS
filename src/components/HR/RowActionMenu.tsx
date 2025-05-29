
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface RowActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails?: () => void;
  onFunction2?: () => void;
  onFunction3?: () => void;
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
  onEdit,
  onDelete,
  onViewDetails,
  onFunction2,
  onFunction3
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>View details</DropdownMenuItem>
        <DropdownMenuItem onClick={onFunction2}>Function 2</DropdownMenuItem>
        <DropdownMenuItem onClick={onFunction3}>Function 3</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionMenu;
