/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
import DecisionIcon from '@atlaskit/icon/core/decision';
import TaskIcon from '@atlaskit/icon/core/task';

import type { SideInsertPanelItem } from '../src/types';
import { SideInsertPanel } from '../src/ui/SideInsertPanel';

const items = [
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Create and assing action items',
		categories: [], // will be defined for each QuickInsert item
		icon: () => <span />, // Do not use. This one is an old Quick Insert Icon
		iconModern: () => <TaskIcon label="Actions" />, // Editor Controls icon, to be added to each QuickInsert item
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
		icon: () => <span />, // Old Quick Insert Icon
		iconModern: () => <DecisionIcon label="Decision" />,
		id: 'decision' as QuickInsertItemId,
		keyshortcut: '<>',
		priority: 900,
		title: 'Decision',
	},
];

const SidePanelWrapper = () => {
	return (
		<SideInsertPanel items={items as unknown as SideInsertPanelItem[]} onItemInsert={() => {}} />
	);
};

export default function SideInsertPanelExample() {
	return <SidePanelWrapper />;
}
