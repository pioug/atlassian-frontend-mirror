import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { ProgressTracker, type Stages } from '../../src';

const containerStyles = xcss({
	maxWidth: '300px',
	margin: 'auto',
});

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

export default () => (
	<Box xcss={containerStyles}>
		<ProgressTracker items={items} spacing="comfortable" />
	</Box>
);
