import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, type MRT_FilterFn } from 'mantine-react-table';

interface Person {
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const data: Person[] = [
  { name: 'John', age: 30, status: 'active' },
  { name: 'Sara', age: 25, status: 'inactive' },
];

const statusList = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const statusFilterFn: MRT_FilterFn<Person> = (row, id, filterValue: string[]) => {
  if (filterValue.length === 0) {
    return true;
  }
  return filterValue.includes(row.getValue("status"));
};

function App() {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'multi-select',
        mantineFilterMultiSelectProps: {
          data: statusList,
        },
        filterFn: statusFilterFn,
        Cell: ({ cell }: { cell: any }) => statusLabels[cell.getValue()] || cell.getValue(),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableFilters: true,
  });

  return <MantineReactTable table={table} />;
}

export default App;
