import React from 'react';
import { Modal, Box, Text, Group, Badge, ScrollArea, Divider } from '@mantine/core';
import { IconUser, IconActivity, IconClock } from '@tabler/icons-react';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  children?: Person[];
}

interface ChangeLogEntry {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  personId: string;
  personName: string;
  beforeState?: Partial<Person>;
  afterState?: Partial<Person>;
  description: string;
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

interface PersonModalProps {
  opened: boolean;
  onClose: () => void;
  person: Person | null;
  changelog: ChangeLogEntry[];
}

const PersonModal: React.FC<PersonModalProps> = ({ opened, onClose, person, changelog }) => (
  <Modal
    opened={opened}
    onClose={onClose}
    title="Person Details & Changelog"
    size="lg"
  >
    {person && (
      <Box>
        {/* Person Details */}
        <Box mb="md">
          <Text size="lg" weight={700} mb="sm">
            <IconUser size={20} style={{ marginRight: 8 }} />
            Person Information
          </Text>
          <Group>
            <Text><strong>Name:</strong> {person.name}</Text>
            <Text><strong>Age:</strong> {person.age}</Text>
            <Badge color={person.status === 'active' ? 'green' : 'red'}>
              {statusLabels[person.status]}
            </Badge>
          </Group>
          {person.children && person.children.length > 0 && (
            <Text mt="sm"><strong>Children:</strong> {person.children.length}</Text>
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
            {changelog.length > 0 ? (
              changelog.map((entry) => (
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
);

export default PersonModal; 