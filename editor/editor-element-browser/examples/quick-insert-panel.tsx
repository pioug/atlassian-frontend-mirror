/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
import Heading from '@atlaskit/heading';
import DecisionIcon from '@atlaskit/icon/core/decision';
import TaskIcon from '@atlaskit/icon/core/task';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import type { QuickInsertPanelItem } from '../src/types';
import { QuickInsertPanel } from '../src/ui/QuickInsertPanel';
import { SearchPanel } from '../src/ui/SearchPanel';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
});

const outerBoxContainerStyles = xcss({
	width: '320px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const items: QuickInsertPanelItem[] = [
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Create and assing action items',
		categories: [], // will be defined for each QuickInsert item
		icon: () => <TaskIcon label="Actions" />, // Editor Controls icon, to be added to each QuickInsert item
		id: 'action' as QuickInsertItemId,
		keyshortcut: '[]',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 100,
		title: 'Action item', // will need to be updated to 'Actions'
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Capture decisions so they’re easy to track',
		categories: [],
		icon: () => <DecisionIcon label="Decision" />,
		id: 'decision' as QuickInsertItemId,
		keyshortcut: '<>',
		priority: 900,
		title: 'Decision',
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Some description',
		categories: [],
		icon: () => <TaskIcon label="Actions" />,
		id: 'something' as QuickInsertItemId,
		keyshortcut: 'Cmd-Shift-D',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 600,
		title: 'Something else',
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Create and assing action items',
		categories: [], // will be defined for each QuickInsert item
		icon: () => <TaskIcon label="Actions" />, // Editor Controls icon, to be added to each QuickInsert item
		id: 'action' as QuickInsertItemId,
		keyshortcut: '[]',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 100,
		title: 'Action item', // will need to be updated to 'Actions'
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Capture decisions so they’re easy to track',
		categories: [],
		icon: () => <DecisionIcon label="Decision" />,
		id: 'decision' as QuickInsertItemId,
		keyshortcut: '<>',
		priority: 900,
		title: 'Decision',
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Some description',
		categories: [],
		icon: () => <TaskIcon label="Actions" />,
		id: 'something' as QuickInsertItemId,
		keyshortcut: 'Cmd-Shift-D',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 600,
		title: 'Something else',
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Some recommended description',
		categories: [],
		icon: () => <TaskIcon label="Actions" />,
		id: 'something-recommended' as QuickInsertItemId,
		keyshortcut: 'Cmd-Shift-D',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 600,
		title: 'Some recommended',
	},
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Some recommended description 2',
		categories: [],
		icon: () => <DecisionIcon label="Decision" />,
		id: 'something-recommended-2' as QuickInsertItemId,
		keyshortcut: 'Cmd-Shift-D',
		keywords: ['checkbox', 'task', 'todo'],
		priority: 600,
		title: 'Some recommended 2',
	},
];

export default function ElementBrowserExample() {
	const [searchText, setSearchText] = useState<string>('');

	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.200" alignBlock="center">
				<Heading size="xsmall">Type search query here:</Heading>
				<Box xcss={innerBoxContainerStyles}>
					<SearchPanel
						onChange={(event) => {
							setSearchText((event.target as HTMLInputElement).value);
						}}
					/>
				</Box>
				<Heading size="xsmall">Quick Insert Panel</Heading>
				<Box xcss={innerBoxContainerStyles}>
					<QuickInsertPanel items={items} onItemInsert={() => {}} query={searchText} />
				</Box>
			</Stack>
		</Box>
	);
}
