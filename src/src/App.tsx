import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useSelector } from 'react-redux';
import { RootState } from './store';

interface Person {
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const statusList = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

function App() {
  const { data, loading } = useSelector((state: RootState) => state.person);

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
        filterFn: 'arrIncludesSome',
        Cell: ({ cell }: { cell: any }) => statusLabels[cell.getValue()] || cell.getValue(),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableFilters: true,
    state: { isLoading: loading },
  });

  return <MantineReactTable table={table} />;
}

export default App;
