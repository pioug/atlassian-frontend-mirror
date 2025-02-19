/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
import DecisionIcon from '@atlaskit/icon/core/decision';
import TaskIcon from '@atlaskit/icon/core/task';

import type { QuickInsertPanelItem } from '../src/types';
import { QuickInsertPanel } from '../src/ui/QuickInsertPanel';

// new design system icons https://atlassian.design/components/icon/icon-explorer

// platform/packages/editor/editor-plugin-tasks-and-decisions/src/tasksAndDecisionsPlugin.tsx pluginsOptions.quickInsert
const items = [
	{
		action: (insert: any, state: any): any => {
			return false;
		},
		description: 'Create and assing action items',
		icon: () => <TaskIcon label="Actions" />,
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
		icon: () => <DecisionIcon label="Decision" />,
		id: 'decision' as QuickInsertItemId,
		keyshortcut: '<>',
		priority: 900,
		title: 'Decision',
	},
];

export default function QuickInsertPanelExample() {
	return (
		<QuickInsertPanel
			query=""
			items={items as unknown as QuickInsertPanelItem[]}
			onItemInsert={() => {}}
		/>
	);
}
