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

  const handleAddPerson = () => {
    dispatch(addPerson({
      name: 'New Person',
      age: 25,
      status: 'active'
    }));
  };

  const handleUpdateFirstPerson = () => {
    if (data.length > 0) {
      const firstPerson = data[0];
      dispatch(updatePerson({
        ...firstPerson,
        name: 'Updated ' + firstPerson.name,
        age: firstPerson.age + 1
      }));
    }
  };

  const handleDeleteFirstPerson = () => {
    if (data.length > 0) {
      dispatch(deletePerson(data[0].id));
    }
  };

  return (
    <MantineReactTable table={table} />
  );
}

export default App;
