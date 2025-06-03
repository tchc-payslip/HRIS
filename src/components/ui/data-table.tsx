import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  data: TData[]
  columns: {
    id: string
    label: string
    accessor: keyof TData
    minWidth?: number
    format?: (value: any) => string | React.ReactNode
  }[]
  loading?: boolean
  stickyFirstColumn?: boolean
  onSort?: (field: keyof TData) => void
  sortField?: keyof TData | null
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (row: TData) => void
  renderFirstColumn?: (row: TData) => React.ReactNode
  emptyMessage?: string
  loadingMessage?: string
}

export function DataTable<TData extends { id: string | number }>({
  data,
  columns,
  loading = false,
  stickyFirstColumn = false,
  onSort,
  sortField,
  sortDirection,
  onRowClick,
  renderFirstColumn,
  emptyMessage = "No data found",
  loadingMessage = "Loading data..."
}: DataTableProps<TData>) {
  const getSortIcon = (field: keyof TData) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? "↑" : "↓";
  };

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div 
        className="h-full max-h-[calc(100vh-280px)] overflow-auto"
        style={{ 
          position: 'relative',
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader>
          <TableHeader>
            <TableRow className="after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-gray-200">
              {renderFirstColumn && (
                <TableHead 
                  className={cn(
                    "bg-white",
                    stickyFirstColumn && "sticky left-0 z-[51] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                  )}
                  style={{ width: '80px' }}
                >
                  Actions
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    "bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]",
                    onSort && "cursor-pointer hover:bg-gray-50/75"
                  )}
                  onClick={() => onSort?.(column.accessor)}
                  style={{ minWidth: column.minWidth || 150 }}
                >
                  {column.label} {getSortIcon(column.accessor)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (renderFirstColumn ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (renderFirstColumn ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow 
                  key={row.id} 
                  className={cn(
                    "hover:bg-gray-50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {renderFirstColumn && (
                    <TableCell 
                      className={cn(
                        "bg-white",
                        stickyFirstColumn && "sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                      )}
                      style={{ width: '80px' }}
                    >
                      {renderFirstColumn(row)}
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.accessor];
                    return (
                      <TableCell 
                        key={`${row.id}-${column.id}`}
                        style={{ minWidth: column.minWidth || 150 }}
                      >
                        {column.format ? column.format(value) : String(value || '-')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 