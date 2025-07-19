import React, { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { addPerson, updatePerson, deletePerson } from './store';
import { Box, ActionIcon, Modal, Text, Group, Badge, ScrollArea, Divider } from '@mantine/core';
import { IconEdit, IconFileDatabase, IconSend, IconTrash, IconClock, IconUser, IconActivity } from '@tabler/icons-react';

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
      
      <Modal
        opened={!!selectedPersonId}
        onClose={closePersonModal}
        title="Person Details & Changelog"
        size="lg"
      >
        {selectedPerson && (
          <Box>
            {/* Person Details */}
            <Box mb="md">
              <Text size="lg" weight={700} mb="sm">
                <IconUser size={20} style={{ marginRight: 8 }} />
                Person Information
              </Text>
              <Group>
                <Text><strong>Name:</strong> {selectedPerson.name}</Text>
                <Text><strong>Age:</strong> {selectedPerson.age}</Text>
                <Badge color={selectedPerson.status === 'active' ? 'green' : 'red'}>
                  {statusLabels[selectedPerson.status]}
                </Badge>
              </Group>
              {selectedPerson.children && selectedPerson.children.length > 0 && (
                <Text mt="sm"><strong>Children:</strong> {selectedPerson.children.length}</Text>
              )}
            </Box>

            <Divider mb="md" />

            {/* Changelog */}
            <Box>
              <Text size="lg" weight={700} mb="sm">
                <IconActivity size={20} style={{ marginRight: 8 }} />
                Change History
              </Text>
              <ScrollArea h={300}>
                {personChangelog.length > 0 ? (
                  personChangelog.map((entry) => (
                    <Box key={entry.id} mb="sm" p="sm" sx={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
                      <Group position="apart" mb="xs">
                        <Badge 
                          color={
                            entry.action === 'CREATE' ? 'green' : 
                            entry.action === 'UPDATE' ? 'blue' : 'red'
                          }
                        >
                          {entry.action}
                        </Badge>
                        <Text size="xs" color="dimmed">
                          <IconClock size={12} style={{ marginRight: 4 }} />
                          {new Date(entry.timestamp).toLocaleString()}
                        </Text>
                      </Group>
                      <Text size="sm">{entry.description}</Text>
                      {entry.beforeState && (
                        <Text size="xs" color="dimmed" mt="xs">
                          <strong>Before:</strong> {JSON.stringify(entry.beforeState, null, 2)}
                        </Text>
                      )}
                      {entry.afterState && (
                        <Text size="xs" color="dimmed" mt="xs">
                          <strong>After:</strong> {JSON.stringify(entry.afterState, null, 2)}
                        </Text>
                      )}
                    </Box>
                  ))
                ) : (
                  <Text color="dimmed" align="center">No changes recorded for this person.</Text>
                )}
              </ScrollArea>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
}

export default App;
