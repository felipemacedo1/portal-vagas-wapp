import { useState } from 'react'
import { DataTable as PrimeDataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'

interface DataTableColumn {
  field: string
  header: string
  sortable?: boolean
  filterable?: boolean
  body?: (rowData: any) => React.ReactNode
  style?: React.CSSProperties
}

interface DataTableProps {
  id?: string
  data: any[]
  columns: DataTableColumn[]
  loading?: boolean
  totalRecords?: number
  rows?: number
  paginator?: boolean
  rowsPerPageOptions?: number[]
  dense?: boolean
  stickyHeader?: boolean
  maxHeight?: string
  columnToggle?: boolean
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
  id,
  data,
  columns,
  loading = false,
  totalRecords,
  rows = 10,
  paginator = true,
  rowsPerPageOptions = [10, 20, 50],
  dense,
  stickyHeader = true,
  maxHeight = '60vh',
  columnToggle = true,
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
  // Persisted density
  const storedDensityKey = id ? `pv_dt_density_${id}` : undefined
  const storedColsKey = id ? `pv_dt_cols_${id}` : undefined
  const defaultDense = storedDensityKey ? localStorage.getItem(storedDensityKey) === 'compact' : false
  const [isDense, setIsDense] = useState(dense ?? defaultDense)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (!storedColsKey) return columns.map(c => c.field)
    try {
      const saved = localStorage.getItem(storedColsKey)
      return saved ? JSON.parse(saved) : columns.map(c => c.field)
    } catch {
      return columns.map(c => c.field)
    }
  })

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
        {columnToggle && (
          <MultiSelect
            options={columns.map(c => ({ label: c.header, value: c.field }))}
            value={visibleColumns}
            onChange={(e) => {
              const v = e.value as string[]
              setVisibleColumns(v)
              if (storedColsKey) localStorage.setItem(storedColsKey, JSON.stringify(v))
            }}
            placeholder="Colunas"
            className="w-18rem"
            display="chip"
          />
        )}

        <Dropdown
          options={[{label:'Conforto', value:'comfortable'},{label:'Compacto', value:'compact'}]}
          value={isDense ? 'compact' : 'comfortable'}
          onChange={(e) => {
            const v = e.value
            const d = v === 'compact'
            setIsDense(d)
            if (storedDensityKey) localStorage.setItem(storedDensityKey, d ? 'compact' : 'comfortable')
          }}
          className="w-12rem"
        />

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
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={rowsPerPageOptions}
        currentPageReportTemplate="{first}–{last} de {totalRecords}"
        scrollable={stickyHeader}
        scrollHeight={stickyHeader ? maxHeight : undefined}
        onPage={(e) => {
          setFirst(e.first)
          onPage?.(e)
        }}
        onSort={onSort}
        onFilter={onFilter}
        globalFilter={globalFilter}
        emptyMessage="Nenhum registro encontrado"
        className={isDense ? 'p-datatable-sm' : ''}
        responsiveLayout="scroll"
      >
        {onSelectionChange && (
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        )}
        
        {columns.filter(c => visibleColumns.includes(c.field)).map((col) => (
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
