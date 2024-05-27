import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { ProgressTracker, type Stages } from '../../src';

const containerStyles = xcss({
  maxWidth: '300px',
  margin: 'auto',
});

const items: Stages = [
  {
    id: 'welcome',
    label: 'Welcome',
    percentageComplete: 100,
    status: 'disabled',
    href: '#',
  },
  {
    id: 'create-space',
    label: 'Create a space',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'upload-photo',
    label: 'Upload a photo',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
  {
    id: 'your-details',
    label: 'Your details',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'invite-users',
    label: 'Invite users',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
];

export default () => (
  <Box xcss={containerStyles}>
    <ProgressTracker items={items} spacing="cosy" />
  </Box>
);
