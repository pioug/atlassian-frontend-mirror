import React from 'react';

import { ProgressTracker, Stages } from '../../src';

const items: Stages = [
  {
    id: 'get-started',
    label: 'Get started',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'create-team',
    label: 'Create a team',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'invite-people',
    label: 'Invite people',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'permissions',
    label: 'Set permissions',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'email-settings',
    label: 'Email settings',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'confirmation',
    label: 'Confirm changes',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
];

export default () => <ProgressTracker items={items} />;
