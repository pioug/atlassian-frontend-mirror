import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { AddRowAboveItem } from './items/AddRowAboveItem';
import { AddRowBelowItem } from './items/AddRowBelowItem';
import { DeleteRowItem } from './items/DeleteRowItem';
import { HeaderRowToggleItem } from './items/HeaderRowToggleItem';
import { MoveRowDownItem } from './items/MoveRowDownItem';
import { MoveRowUpItem } from './items/MoveRowUpItem';
import { NumberedRowsToggleItem } from './items/NumberedRowsToggleItem';
import {
	ROW_MENU,
	ROW_TOGGLE_SECTION,
	ROW_BACKGROUND_SECTION,
	ROW_ADD_SECTION,
	ROW_DANGER_SECTION,
	ROW_MENU_SECTION_RANK,
	HEADER_ROW_TOGGLE_ITEM,
	NUMBERED_ROWS_TOGGLE_ITEM,
	ADD_ROW_ABOVE_ITEM,
	ADD_ROW_BELOW_ITEM,
	MOVE_ROW_UP_ITEM,
	MOVE_ROW_DOWN_ITEM,
	DELETE_ROW_ITEM,
	ROW_TOGGLE_SECTION_RANK,
	ROW_ADD_SECTION_RANK,
	ROW_DANGER_SECTION_RANK,
} from './keys';

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
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_MENU_SECTION_RANK[ROW_TOGGLE_SECTION.key] },
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
				rank: ROW_TOGGLE_SECTION_RANK[HEADER_ROW_TOGGLE_ITEM.key],
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
				rank: ROW_TOGGLE_SECTION_RANK[NUMBERED_ROWS_TOGGLE_ITEM.key],
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
				rank: ROW_MENU_SECTION_RANK[ROW_BACKGROUND_SECTION.key],
			},
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>
				{props.children as React.ReactNode}
			</ToolbarDropdownItemSection>
		),
	},
	// --- Add / Move section ---
	{
		type: ROW_ADD_SECTION.type,
		key: ROW_ADD_SECTION.key,
		parents: [
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_MENU_SECTION_RANK[ROW_ADD_SECTION.key] },
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>
				{props.children as React.ReactNode}
			</ToolbarDropdownItemSection>
		),
	},
	{
		type: ADD_ROW_ABOVE_ITEM.type,
		key: ADD_ROW_ABOVE_ITEM.key,
		parents: [
			{
				type: ROW_ADD_SECTION.type,
				key: ROW_ADD_SECTION.key,
				rank: ROW_ADD_SECTION_RANK[ADD_ROW_ABOVE_ITEM.key],
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
				rank: ROW_ADD_SECTION_RANK[ADD_ROW_BELOW_ITEM.key],
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
				rank: ROW_ADD_SECTION_RANK[MOVE_ROW_UP_ITEM.key],
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
				rank: ROW_ADD_SECTION_RANK[MOVE_ROW_DOWN_ITEM.key],
			},
		],
		component: () => <MoveRowDownItem />,
	},
	// --- Danger section (Clear cells, Delete row) ---
	{
		type: ROW_DANGER_SECTION.type,
		key: ROW_DANGER_SECTION.key,
		parents: [
			{ type: ROW_MENU.type, key: ROW_MENU.key, rank: ROW_MENU_SECTION_RANK[ROW_DANGER_SECTION.key] },
		],
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>
				{props.children as React.ReactNode}
			</ToolbarDropdownItemSection>
		),
	},
	{
		type: DELETE_ROW_ITEM.type,
		key: DELETE_ROW_ITEM.key,
		parents: [
			{
				type: ROW_DANGER_SECTION.type,
				key: ROW_DANGER_SECTION.key,
				rank: ROW_DANGER_SECTION_RANK[DELETE_ROW_ITEM.key],
			},
		],
		component: () => <DeleteRowItem />,
	},
];
