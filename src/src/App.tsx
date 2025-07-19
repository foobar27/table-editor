import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { addPerson, updatePerson, deletePerson } from './store';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  children?: Person[];
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
  const dispatch = useDispatch();

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        mantineEditTextInputProps: {
          required: true,
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'multi-select',
        mantineFilterMultiSelectProps: {
          data: statusList,
        },
        editVariant: 'select',
        mantineEditSelectProps: {
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
    enableEditing: true,
    enableExpanding: true,
    editDisplayMode: 'row',
    mantineEditRowModalProps: {
      closeOnClickOutside: false,
      withCloseButton: true,
    },
    getSubRows: (row) => row.children,
    onEditingRowSave: ({ values, row, exitEditingMode }) => {
      // Update the person in Redux store
      dispatch(updatePerson({
        id: row.original.id,
        name: values.name,
        age: values.age,
        status: values.status,
        children: row.original.children,
      }));
      exitEditingMode();
    },
    onCreatingRowSave: ({ values, exitCreatingMode }) => {
      // Add new person to Redux store
      dispatch(addPerson({
        name: values.name,
        age: values.age,
        status: values.status,
      }));
      exitCreatingMode();
    },
    onEditingRowCancel: () => {
      // Handle cancel editing if needed
    },
    onCreatingRowCancel: () => {
      // Handle cancel creating if needed
    },
    state: { isLoading: loading },
  });

  return <MantineReactTable table={table} />;
}

export default App;
