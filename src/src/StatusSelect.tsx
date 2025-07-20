import React from 'react';
import { Select, Badge } from '@mantine/core';
import type { Person } from './types';

interface StatusSelectProps {
  value: Person['status'];
  onChange: (value: Person['status']) => void;
  label?: string;
  required?: boolean;
}

const statusList = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange, label = 'Status', required = false }) => {
  return (
    <Select
      label={label}
      data={statusList}
      value={value}
      onChange={(val) => onChange(val as Person['status'])}
      required={required}
      styles={(theme) => ({
        item: {
          // applies styles to selected item
          '&[data-selected]': {
            '&, &:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[3],
              color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
            },
          },

          // applies styles to hovered item (with mouse or keyboard)
          '&[data-hovered]': {},
        },
      })}
      itemComponent={({ label, value, ...others }) => (
        <div {...others}>
          <Badge
            color={value === 'active' ? 'green' : 'red'}
            variant="filled"
            size="sm"
          >
            {label}
          </Badge>
        </div>
      )}
    />
  );
};

export default StatusSelect; 