import React from 'react';
import { Badge } from '@mantine/core';

export const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

interface StatusBadgeProps {
  status: 'active' | 'inactive' | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let color: string;
  if (status === 'active') color = 'green';
  else if (status === 'inactive') color = 'red';
  else color = 'gray';

  return <Badge color={color}>{statusLabels[status] || status}</Badge>;
};

export default StatusBadge;
