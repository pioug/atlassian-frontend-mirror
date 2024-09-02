import React, { type ReactElement } from 'react';

import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import { axe } from '@af/accessibility-testing';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ProgressTracker, type Stages } from '../../index';

const items: Stages = [
	{
		id: 'disabled-1',
		label: 'Disabled step',
		percentageComplete: 100,
		status: 'disabled',
	},
	{
		id: 'visited-1',
		label: 'Visited step',
		percentageComplete: 100,
		status: 'visited',
		href: 'a',
	},
	{
		id: 'current-1',
		label: 'Current step',
		percentageComplete: 50,
		status: 'current',
	},
	{
		id: 'unvisited-1',
		label: 'Unvisited step 1',
		percentageComplete: 0,
		status: 'unvisited',
	},
	{
		id: 'unvisited-2',
		label: 'Unvisited step 2',
		percentageComplete: 0,
		status: 'unvisited',
	},
	{
		id: 'unvisited-3',
		label: 'Unvisited step 3',
		percentageComplete: 0,
		status: 'unvisited',
	},
];

ffTest.both('platform-progress-tracker-functional-facade', 'should pass basic aXe audit', () => {
	cases(
		'ProgressTracker',
		async ({ jsx }: { jsx: ReactElement }) => {
			const { container } = render(jsx);
			await axe(container);
		},
		[
			{ name: 'Default', jsx: <ProgressTracker items={items} /> },
			{ name: 'Cosy', jsx: <ProgressTracker items={items} spacing="cosy" /> },
			{
				name: 'Comfortable',
				jsx: <ProgressTracker items={items} spacing="comfortable" />,
			},
			{
				name: 'Compact',
				jsx: <ProgressTracker items={items} spacing="compact" />,
			},
		],
	);
});
