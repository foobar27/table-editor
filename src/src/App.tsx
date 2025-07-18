import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

const data = [
  { name: 'John', age: 30 },
  { name: 'Sara', age: 25 },
];

function App() {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
    ],
    []
  );

  const table = useMantineReactTable({ columns, data });

  return <MantineReactTable table={table} />;
}

export default App;
