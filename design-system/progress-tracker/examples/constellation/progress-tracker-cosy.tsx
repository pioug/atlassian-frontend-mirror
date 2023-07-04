import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { ProgressTracker, Stages } from '../../src';

const containerStyles = xcss({
  maxWidth: '300px',
  margin: 'auto',
});

const items: Stages = [
  {
    id: '1',
    label: 'Step 1',
    percentageComplete: 100,
    status: 'disabled',
    href: '#',
  },
  {
    id: '2',
    label: 'Step 2',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: '3',
    label: 'Step 3',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
  {
    id: '4',
    label: 'Step 4',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: '5',
    label: 'Step 5',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: '6',
    label: 'Step 6',
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
