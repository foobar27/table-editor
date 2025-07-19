import React from 'react';
import { Modal, Box, Text, Group, ScrollArea, Divider, Badge, Breadcrumbs, Anchor } from '@mantine/core';
import { IconUser, IconActivity, IconClock, IconChevronRight } from '@tabler/icons-react';
import StatusBadge from './StatusBadge';
import type { Person, ChangeLogEntry } from './types';

interface PersonModalProps {
  opened: boolean;
  onClose: () => void;
  person: Person | null;
  changelog: ChangeLogEntry[];
  personPath: Person[] | null;
  onBreadcrumbClick?: (personId: string) => void;
}

const PersonModal: React.FC<PersonModalProps> = ({ opened, onClose, person, changelog, personPath, onBreadcrumbClick }) => (
  <Modal
    opened={opened}
    onClose={onClose}
    title="Person Details & Changelog"
    size="lg"
  >
    {person && (
      <Box>
        {/* Breadcrumbs */}
        {personPath && personPath.length > 1 && (
          <Box mb="md">
            <Breadcrumbs separator={<IconChevronRight size={16} />}>
              {personPath.map((ancestor, index) => (
                <Anchor
                  key={ancestor.id}
                  size="sm"
                  color={index === personPath.length - 1 ? 'blue' : 'dimmed'}
                  style={{ fontWeight: index === personPath.length - 1 ? 'bold' : 'normal', cursor: index === personPath.length - 1 ? 'default' : 'pointer' }}
                  onClick={index === personPath.length - 1 ? undefined : () => onBreadcrumbClick && onBreadcrumbClick(ancestor.id)}
                  underline={index === personPath.length - 1 ? false : true}
                >
                  {ancestor.name}
                </Anchor>
              ))}
            </Breadcrumbs>
          </Box>
        )}

        {/* Person Details */}
        <Box mb="md">
          <Text size="lg" weight={700} mb="sm">
            <IconUser size={20} style={{ marginRight: 8 }} />
            Person Information
          </Text>
          <Group>
            <Text><strong>Name:</strong> {person.name}</Text>
            <Text><strong>Age:</strong> {person.age}</Text>
            <StatusBadge status={person.status} />
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
                    {entry.action === 'CREATE' || entry.action === 'DELETE' ? (
                      <StatusBadge status={entry.action === 'CREATE' ? 'active' : 'inactive'} />
                    ) : (
                      <Badge color="gray">{entry.action}</Badge>
                    )}
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