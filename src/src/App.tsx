import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';

interface Person {
  name: string;
  age: number;
}

const data: Person[] = [
  { name: 'John', age: 30 },
  { name: 'Sara', age: 25 },
];

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
    ],
    []
  );

  const table = useMantineReactTable({ columns, data });

  return <MantineReactTable table={table} />;
}

export default App;
