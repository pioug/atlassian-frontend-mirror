/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
import DecisionIcon from '@atlaskit/icon/core/decision';
import TaskIcon from '@atlaskit/icon/core/task';

import type { SideInsertPanelItem } from '../src/types';
import { SideInsertPanel } from '../src/ui/SideInsertPanel';

// import { css } from '@compiled/react';

// import { cssMap, cx, jsx } from '@atlaskit/css';
// import { Anchor, Box, Text } from '@atlaskit/primitives/compiled';
// import { token } from '@atlaskit/tokens';

// const styles = cssMap({
// 	container: {
// 		marginTop: token('space.200'),
// 		marginRight: token('space.200'),
// 		marginBottom: token('space.200'),
// 		marginLeft: token('space.200'),
// 		paddingTop: token('space.200'),
// 		paddingRight: token('space.200'),
// 		paddingBottom: token('space.200'),
// 		paddingLeft: token('space.200'),
// 	},
// 	selected: {
// 		backgroundColor: token('color.background.selected'),
// 		borderColor: token('color.border.selected'),
// 		color: token('color.text.selected'),
// 		'&:hover': {
// 			backgroundColor: token('color.background.selected.hovered'),
// 		},
// 	},
// 	unselected: {
// 		borderColor: token('color.border'),
// 		'&:hover': {
// 			backgroundColor: token('color.background.neutral.hovered'),
// 		},
// 	},
// 	progressBarContainer: {
// 		marginTop: token('space.200'),
// 		marginLeft: 0,
// 		marginRight: 0,
// 		marginBottom: 0,
// 		paddingTop: token('space.200'),
// 		paddingRight: token('space.200'),
// 		paddingBottom: token('space.200'),
// 		paddingLeft: token('space.200'),
// 		color: token('color.text'),
// 	},
// });

// const progressBarStyles = css({
// 	marginLeft: token('space.100'),
// });

// NOTE: You can still use raw `css` from `@compiled/react` if you need to.
// In this case, we use it because `borderRadius` doesn't match our interface.
// const containerWithBorder = css({
// 	borderStyle: 'solid',
// 	borderWidth: token('border.width.outline'),
// 	borderRadius: '8px',
// });

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
