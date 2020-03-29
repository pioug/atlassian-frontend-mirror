import React from 'react';
import { ProgressTracker, Stages } from '../src';

const items: Stages = [
  {
    id: '1',
    label: 'Step 1',
    percentageComplete: 100,
    status: 'visited',
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
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: '4',
    label: 'Step 4',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: '5',
    label: 'Step 5',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: '6',
    label: 'Step 6',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
];

export default () => <ProgressTracker items={items} />;
