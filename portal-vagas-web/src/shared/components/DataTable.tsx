import { useState } from 'react'
import { DataTable as PrimeDataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Paginator } from 'primereact/paginator'

interface DataTableColumn {
  field: string
  header: string
  sortable?: boolean
  filterable?: boolean
  body?: (rowData: any) => React.ReactNode
  style?: React.CSSProperties
}

interface DataTableProps {
  data: any[]
  columns: DataTableColumn[]
  loading?: boolean
  totalRecords?: number
  rows?: number
  paginator?: boolean
  selection?: any
  onSelectionChange?: (e: any) => void
  onPage?: (e: any) => void
  onSort?: (e: any) => void
  onFilter?: (e: any) => void
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  actions?: (rowData: any) => React.ReactNode
  exportable?: boolean
  onExport?: () => void
}

export const DataTable = ({
  data,
  columns,
  loading = false,
  totalRecords,
  rows = 10,
  paginator = true,
  selection,
  onSelectionChange,
  onPage,
  onSort,
  onFilter,
  globalFilter,
  onGlobalFilterChange,
  actions,
  exportable = false,
  onExport
}: DataTableProps) => {
  const [first, setFirst] = useState(0)

  const header = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex align-items-center gap-2">
        {onGlobalFilterChange && (
          <div className="p-inputgroup w-20rem">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              placeholder="Buscar..."
              value={globalFilter || ''}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {exportable && (
          <Button
            icon="pi pi-download"
            label="Exportar"
            className="p-button-outlined"
            onClick={onExport}
          />
        )}
      </div>
    </div>
  )

  const actionBodyTemplate = (rowData: any) => {
    return actions ? actions(rowData) : null
  }

  return (
    <div className="card">
      <PrimeDataTable
        value={data}
        loading={loading}
        header={header}
        selection={selection}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        paginator={paginator}
        rows={rows}
        totalRecords={totalRecords}
        lazy={!!onPage}
        first={first}
        onPage={(e) => {
          setFirst(e.first)
          onPage?.(e)
        }}
        onSort={onSort}
        onFilter={onFilter}
        globalFilter={globalFilter}
        emptyMessage="Nenhum registro encontrado"
        className="p-datatable-sm"
        responsiveLayout="scroll"
      >
        {onSelectionChange && (
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        )}
        
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            filter={col.filterable}
            body={col.body}
            style={col.style}
          />
        ))}
        
        {actions && (
          <Column
            header="Ações"
            body={actionBodyTemplate}
            style={{ width: '8rem' }}
          />
        )}
      </PrimeDataTable>
    </div>
  )
}