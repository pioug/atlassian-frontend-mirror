import React, { type PropsWithChildren } from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { AddColumnLeftItem } from './items/AddColumnLeftItem';
import { AddColumnRightItem } from './items/AddColumnRightItem';
import { ColumnBackgroundSection } from './items/ColumnBackgroundSection';
import { ColumnToggleSection } from './items/ColumnToggleSection';
import { DeleteColumnItem } from './items/DeleteColumnItem';
import { DistributeColumnsItem } from './items/DistributeColumnsItem';
import { HeaderColumnToggleItem } from './items/HeaderColumnToggleItem';
import { MoveColumnRightItem } from './items/MoveColumnRightItem';
import { SortDecreasingItem } from './items/SortDecreasingItem';
import { SortIncreasingItem } from './items/SortIncreasingItem';
import {
	COLUMN_MENU,
	COLUMN_TOGGLE_SECTION,
	COLUMN_BACKGROUND_SECTION,
	COLUMN_SORT_SECTION,
	COLUMN_ADD_SECTION,
	COLUMN_DANGER_SECTION,
	COLUMN_SECTION_RANK,
	HEADER_COLUMN_TOGGLE_ITEM,
	SORT_INCREASING_ITEM,
	SORT_DECREASING_ITEM,
	ADD_COLUMN_LEFT_ITEM,
	ADD_COLUMN_RIGHT_ITEM,
	MOVE_COLUMN_RIGHT_ITEM,
	DISTRIBUTE_COLUMNS_ITEM,
	DELETE_COLUMN_ITEM,
	COLUMN_TOGGLE_SECTION_RANK,
	COLUMN_SORT_SECTION_RANK,
	COLUMN_ADD_SECTION_RANK,
	COLUMN_DANGER_SECTION_RANK,
} from './keys';

export const getColumnMenuComponents = (): RegisterComponent[] => [
	// --- Menu surface ---
	{
		type: COLUMN_MENU.type,
		key: COLUMN_MENU.key,
	},

	// --- Toggle section (Header column) ---
	{
		type: COLUMN_TOGGLE_SECTION.type,
		key: COLUMN_TOGGLE_SECTION.key,
		parents: [
			{
				type: COLUMN_MENU.type,
				key: COLUMN_MENU.key,
				rank: COLUMN_SECTION_RANK[COLUMN_TOGGLE_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ColumnToggleSection>{props.children}</ColumnToggleSection>
		),
	},
	{
		type: HEADER_COLUMN_TOGGLE_ITEM.type,
		key: HEADER_COLUMN_TOGGLE_ITEM.key,
		parents: [
			{
				type: COLUMN_TOGGLE_SECTION.type,
				key: COLUMN_TOGGLE_SECTION.key,
				rank: COLUMN_TOGGLE_SECTION_RANK[HEADER_COLUMN_TOGGLE_ITEM.key],
			},
		],
		component: () => <HeaderColumnToggleItem />,
	},

	// --- Background color section ---
	{
		type: COLUMN_BACKGROUND_SECTION.type,
		key: COLUMN_BACKGROUND_SECTION.key,
		parents: [
			{
				type: COLUMN_MENU.type,
				key: COLUMN_MENU.key,
				rank: COLUMN_SECTION_RANK[COLUMN_BACKGROUND_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ColumnBackgroundSection>{props.children}</ColumnBackgroundSection>
		),
	},

	// --- Sort section ---
	{
		type: COLUMN_SORT_SECTION.type,
		key: COLUMN_SORT_SECTION.key,
		parents: [
			{
				type: COLUMN_MENU.type,
				key: COLUMN_MENU.key,
				rank: COLUMN_SECTION_RANK[COLUMN_SORT_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children}</ToolbarDropdownItemSection>
		),
	},
	{
		type: SORT_INCREASING_ITEM.type,
		key: SORT_INCREASING_ITEM.key,
		parents: [
			{
				type: COLUMN_SORT_SECTION.type,
				key: COLUMN_SORT_SECTION.key,
				rank: COLUMN_SORT_SECTION_RANK[SORT_INCREASING_ITEM.key],
			},
		],
		component: () => <SortIncreasingItem />,
	},
	{
		type: SORT_DECREASING_ITEM.type,
		key: SORT_DECREASING_ITEM.key,
		parents: [
			{
				type: COLUMN_SORT_SECTION.type,
				key: COLUMN_SORT_SECTION.key,
				rank: COLUMN_SORT_SECTION_RANK[SORT_DECREASING_ITEM.key],
			},
		],
		component: () => <SortDecreasingItem />,
	},

	// --- Add / Move section ---
	{
		type: COLUMN_ADD_SECTION.type,
		key: COLUMN_ADD_SECTION.key,
		parents: [
			{
				type: COLUMN_MENU.type,
				key: COLUMN_MENU.key,
				rank: COLUMN_SECTION_RANK[COLUMN_ADD_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children}</ToolbarDropdownItemSection>
		),
	},
	{
		type: ADD_COLUMN_LEFT_ITEM.type,
		key: ADD_COLUMN_LEFT_ITEM.key,
		parents: [
			{
				type: COLUMN_ADD_SECTION.type,
				key: COLUMN_ADD_SECTION.key,
				rank: COLUMN_ADD_SECTION_RANK[ADD_COLUMN_LEFT_ITEM.key],
			},
		],
		component: () => <AddColumnLeftItem />,
	},
	{
		type: ADD_COLUMN_RIGHT_ITEM.type,
		key: ADD_COLUMN_RIGHT_ITEM.key,
		parents: [
			{
				type: COLUMN_ADD_SECTION.type,
				key: COLUMN_ADD_SECTION.key,
				rank: COLUMN_ADD_SECTION_RANK[ADD_COLUMN_RIGHT_ITEM.key],
			},
		],
		component: () => <AddColumnRightItem />,
	},
	{
		type: MOVE_COLUMN_RIGHT_ITEM.type,
		key: MOVE_COLUMN_RIGHT_ITEM.key,
		parents: [
			{
				type: COLUMN_ADD_SECTION.type,
				key: COLUMN_ADD_SECTION.key,
				rank: COLUMN_ADD_SECTION_RANK[MOVE_COLUMN_RIGHT_ITEM.key],
			},
		],
		component: () => <MoveColumnRightItem />,
	},
	{
		type: DISTRIBUTE_COLUMNS_ITEM.type,
		key: DISTRIBUTE_COLUMNS_ITEM.key,
		parents: [
			{
				type: COLUMN_ADD_SECTION.type,
				key: COLUMN_ADD_SECTION.key,
				rank: COLUMN_ADD_SECTION_RANK[DISTRIBUTE_COLUMNS_ITEM.key],
			},
		],
		component: () => <DistributeColumnsItem />,
	},

	// --- Danger section (Clear cells, Delete column) ---
	{
		type: COLUMN_DANGER_SECTION.type,
		key: COLUMN_DANGER_SECTION.key,
		parents: [
			{
				type: COLUMN_MENU.type,
				key: COLUMN_MENU.key,
				rank: COLUMN_SECTION_RANK[COLUMN_DANGER_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children}</ToolbarDropdownItemSection>
		),
	},
	{
		type: DELETE_COLUMN_ITEM.type,
		key: DELETE_COLUMN_ITEM.key,
		parents: [
			{
				type: COLUMN_DANGER_SECTION.type,
				key: COLUMN_DANGER_SECTION.key,
				rank: COLUMN_DANGER_SECTION_RANK[DELETE_COLUMN_ITEM.key],
			},
		],
		component: () => <DeleteColumnItem />,
	},
];
