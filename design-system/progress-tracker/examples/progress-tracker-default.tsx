import React from 'react';

import { ProgressTracker, type Stages } from '@atlaskit/progress-tracker';

const items: Stages = [
	{
		id: 'disabled-1',
		label: 'Disabled step 1',
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
		id: 'disabled-2',
		label: 'Disabled step 2',
		percentageComplete: 100,
		status: 'disabled',
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
		id: 'disabled-3',
		label: 'Disabled step 3',
		percentageComplete: 0,
		status: 'disabled',
		href: '#',
	},
	{
		id: 'unvisited-3',
		label: 'Unvisited step 2',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

export default () => <ProgressTracker items={items} testId="progress-tracker" />;
