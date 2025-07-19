import React, { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { addPerson, updatePerson, deletePerson } from './store';
import { Box, ActionIcon } from '@mantine/core';
import { IconEdit, IconFileDatabase, IconTrash } from '@tabler/icons-react';
import PersonModal from './PersonModal';
import StatusBadge from './StatusBadge';
import type { Person, ChangeLogEntry } from './types';

const statusList = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

function App() {
  const { data, loading, changelog } = useSelector((state: RootState) => state.person);
  const dispatch = useDispatch();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Helper function to find a person by ID recursively
  const findPersonById = (persons: Person[], id: string): Person | null => {
    for (const person of persons) {
      if (person.id === id) return person;
      if (person.children) {
        const found = findPersonById(person.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to find the path/ancestors of a person
  const findPersonPath = (persons: Person[], targetId: string, currentPath: Person[] = []): Person[] | null => {
    for (const person of persons) {
      const newPath = [...currentPath, person];
      
      if (person.id === targetId) {
        return newPath;
      }
      
      if (person.children) {
        const found = findPersonPath(person.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to get changelog entries for a specific person
  const getPersonChangelog = (personId: string) => {
    return changelog.filter(entry => entry.personId === personId);
  };

  const openPersonModal = (personId: string) => {
    setSelectedPersonId(personId);
  };

  const closePersonModal = () => {
    setSelectedPersonId(null);
  };

  const selectedPerson = selectedPersonId ? findPersonById(data, selectedPersonId) : null;
  const personPath = selectedPersonId ? findPersonPath(data, selectedPersonId) : null;
  const personChangelog = selectedPersonId ? getPersonChangelog(selectedPersonId) : [];

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
        Cell: ({ cell }: { cell: any }) => (
          <StatusBadge status={cell.getValue()} />
        ),
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
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
        <ActionIcon
          onClick={() => { table.setEditingRow(row); }}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon
          onClick={() => dispatch(deletePerson(row.original.id))}
        >
          <IconTrash />
        </ActionIcon>
        <ActionIcon onClick={() => { openPersonModal(row.original.id); }}>
          <IconFileDatabase/>
        </ActionIcon>
      </Box>
    ),
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

  return (
    <>
      <MantineReactTable table={table} />
      <PersonModal
        opened={!!selectedPersonId}
        onClose={closePersonModal}
        person={selectedPerson}
        changelog={personChangelog}
        personPath={personPath}
      />
    </>
  );
}

export default App;
