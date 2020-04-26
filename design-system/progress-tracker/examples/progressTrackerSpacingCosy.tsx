import React from 'react';

import { ProgressTracker, Stages } from '../src';

const items: Stages = [
  {
    id: 'disabled-1',
    label: 'Disabled step',
    percentageComplete: 100,
    status: 'disabled',
    href: '#',
  },
  {
    id: 'visited-1',
    label: 'Visited step',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'current-1',
    label: 'Current step',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
  {
    id: 'unvisited-1',
    label: 'Unvisited step 1',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'unvisited-2',
    label: 'Unvisited step 2',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'unvisited-3',
    label: 'Unvisited step 3',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
];

export default () => (
  <div style={{ maxWidth: 600, margin: 'auto' }}>
    <ProgressTracker items={items} spacing="cosy" />
  </div>
);
