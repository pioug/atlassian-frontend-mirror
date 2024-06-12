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
		id: 'create-account',
		label: 'Create account',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: 'details',
		label: 'Your details',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
	{
		id: 'select-plan',
		label: 'Select a plan',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'payment-methods',
		label: 'Add payment method',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'confirmation',
		label: 'Complete purchase',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

export default () => (
	<Box xcss={containerStyles}>
		<ProgressTracker items={items} spacing="compact" />
	</Box>
);
