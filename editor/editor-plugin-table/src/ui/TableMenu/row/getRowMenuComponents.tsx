import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { BackgroundColorItem } from '../shared/items/BackgroundColorItem';
import { ClearCellsItem } from '../shared/items/ClearCellsItem';

import {
	ROW_MENU,
	ROW_TOGGLE_SECTION,
	ROW_BACKGROUND_SECTION,
	ROW_ADD_SECTION,
	ROW_DANGER_SECTION,
	ROW_SECTION_RANK,
	HEADER_ROW_TOGGLE_ITEM,
	NUMBERED_ROWS_TOGGLE_ITEM,
	BACKGROUND_COLOR_ITEM,
	ADD_ROW_ABOVE_ITEM,
	ADD_ROW_BELOW_ITEM,
	MOVE_ROW_UP_ITEM,
	MOVE_ROW_DOWN_ITEM,
	CLEAR_CELLS_ITEM,
	DELETE_ROW_ITEM,
	TOGGLE_SECTION_ITEM_RANK,
	BACKGROUND_SECTION_ITEM_RANK,
	ADD_SECTION_ITEM_RANK,
	DANGER_SECTION_ITEM_RANK,
} from './keys';
import {
	HeaderRowToggleItem,
	NumberedRowsToggleItem,
	AddRowAboveItem,
	AddRowBelowItem,
	MoveRowUpItem,
	MoveRowDownItem,
	DeleteRowItem,
} from './RowMenuItems';

/**
 * Returns the RegisterComponent[] array defining the row menu surface.
 *
 * This is a **UI-only stub** — all items are always visible with no conditional
 * logic and no wired actions. Functional behaviour (actions, conditional visibility)
 * will be connected in follow-up tickets.
 */
export const getRowMenuComponents = (): RegisterComponent[] => [
	// --- Menu surface ---
	{
		type: ROW_MENU.type,
		key: ROW_MENU.key,
	},

	// --- Toggle section (Header row, Numbered rows) ---
	{
		type: ROW_TOGGLE_SECTION.type,
		key: ROW_TOGGLE_SECTION.key,
		parents: [
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_SECTION_RANK[ROW_TOGGLE_SECTION.key] },
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection>{props.children as React.ReactNode}</ToolbarDropdownItemSection>
		),
	},
	{
		type: HEADER_ROW_TOGGLE_ITEM.type,
		key: HEADER_ROW_TOGGLE_ITEM.key,
		parents: [
			{
				type: ROW_TOGGLE_SECTION.type,
				key: ROW_TOGGLE_SECTION.key,
				rank: TOGGLE_SECTION_ITEM_RANK[HEADER_ROW_TOGGLE_ITEM.key],
			},
		],
		component: () => <HeaderRowToggleItem />,
	},
	{
		type: NUMBERED_ROWS_TOGGLE_ITEM.type,
		key: NUMBERED_ROWS_TOGGLE_ITEM.key,
		parents: [
			{
				type: ROW_TOGGLE_SECTION.type,
				key: ROW_TOGGLE_SECTION.key,
				rank: TOGGLE_SECTION_ITEM_RANK[NUMBERED_ROWS_TOGGLE_ITEM.key],
			},
		],
		component: () => <NumberedRowsToggleItem />,
	},
	// --- Background color section ---
	{
		type: ROW_BACKGROUND_SECTION.type,
		key: ROW_BACKGROUND_SECTION.key,
		parents: [
			{
				type: ROW_MENU.type,
				key: ROW_MENU.key,
				rank: ROW_SECTION_RANK[ROW_BACKGROUND_SECTION.key],
			},
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children as React.ReactNode}</ToolbarDropdownItemSection>
		),
	},
	{
		type: BACKGROUND_COLOR_ITEM.type,
		key: BACKGROUND_COLOR_ITEM.key,
		parents: [
			{
				type: ROW_BACKGROUND_SECTION.type,
				key: ROW_BACKGROUND_SECTION.key,
				rank: BACKGROUND_SECTION_ITEM_RANK[BACKGROUND_COLOR_ITEM.key],
			},
		],
		component: () => <BackgroundColorItem testId="row-menu-background-color" />,
	},
	// --- Add / Move section ---
	{
		type: ROW_ADD_SECTION.type,
		key: ROW_ADD_SECTION.key,
		parents: [
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_SECTION_RANK[ROW_ADD_SECTION.key] },
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children as React.ReactNode}</ToolbarDropdownItemSection>
		),
	},
	{
		type: ADD_ROW_ABOVE_ITEM.type,
		key: ADD_ROW_ABOVE_ITEM.key,
		parents: [
			{
				type: ROW_ADD_SECTION.type,
				key: ROW_ADD_SECTION.key,
				rank: ADD_SECTION_ITEM_RANK[ADD_ROW_ABOVE_ITEM.key],
			},
		],
		component: () => <AddRowAboveItem />,
	},
	{
		type: ADD_ROW_BELOW_ITEM.type,
		key: ADD_ROW_BELOW_ITEM.key,
		parents: [
			{
				type: ROW_ADD_SECTION.type,
				key: ROW_ADD_SECTION.key,
				rank: ADD_SECTION_ITEM_RANK[ADD_ROW_BELOW_ITEM.key],
			},
		],
		component: () => <AddRowBelowItem />,
	},
	{
		type: MOVE_ROW_UP_ITEM.type,
		key: MOVE_ROW_UP_ITEM.key,
		parents: [
			{
				type: ROW_ADD_SECTION.type,
				key: ROW_ADD_SECTION.key,
				rank: ADD_SECTION_ITEM_RANK[MOVE_ROW_UP_ITEM.key],
			},
		],
		component: () => <MoveRowUpItem />,
	},
	{
		type: MOVE_ROW_DOWN_ITEM.type,
		key: MOVE_ROW_DOWN_ITEM.key,
		parents: [
			{
				type: ROW_ADD_SECTION.type,
				key: ROW_ADD_SECTION.key,
				rank: ADD_SECTION_ITEM_RANK[MOVE_ROW_DOWN_ITEM.key],
			},
		],
		component: () => <MoveRowDownItem />,
	},
	// --- Danger section (Clear cells, Delete row) ---
	{
		type: ROW_DANGER_SECTION.type,
		key: ROW_DANGER_SECTION.key,
		parents: [
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_SECTION_RANK[ROW_DANGER_SECTION.key] },
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children as React.ReactNode}</ToolbarDropdownItemSection>
		),
	},
	{
		type: CLEAR_CELLS_ITEM.type,
		key: CLEAR_CELLS_ITEM.key,
		parents: [
			{
				type: ROW_DANGER_SECTION.type,
				key: ROW_DANGER_SECTION.key,
				rank: DANGER_SECTION_ITEM_RANK[CLEAR_CELLS_ITEM.key],
			},
		],
		component: () => <ClearCellsItem testId="row-menu-clear-cells" />,
	},
	{
		type: DELETE_ROW_ITEM.type,
		key: DELETE_ROW_ITEM.key,
		parents: [
			{
				type: ROW_DANGER_SECTION.type,
				key: ROW_DANGER_SECTION.key,
				rank: DANGER_SECTION_ITEM_RANK[DELETE_ROW_ITEM.key],
			},
		],
		component: () => <DeleteRowItem />,
	},
];
