import React from 'react';

import { ProgressTracker, type Stages } from '@atlaskit/progress-tracker';

const items: Stages = [
	{
		id: 'move-issues',
		label: 'Move issues',
		percentageComplete: 100,
		status: 'disabled',
		href: '#',
	},
	{
		id: 'select-destination',
		label: 'Select destination',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: 'map-statuses',
		label: 'Map statuses',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
	{
		id: 'data-classification',
		label: 'Data classification',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'update-fields',
		label: 'Update fields',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'confirmation',
		label: 'Confirm changes',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

export default () => <ProgressTracker items={items} spacing="comfortable" />;
