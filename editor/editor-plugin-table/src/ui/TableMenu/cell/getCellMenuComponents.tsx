import React, { type PropsWithChildren } from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { MergeCellsItem } from './items/MergeCellsItem';
import { SplitCellItem } from './items/SplitCellItem';
import {
	CELL_MENU,
	CELL_ACTION_SECTION,
	CELL_DANGER_SECTION,
	CELL_MENU_RANK,
	MERGE_CELLS_ITEM,
	SPLIT_CELL_ITEM,
	CELL_ACTION_SECTION_RANK,
} from './keys';

export const getCellMenuComponents = (): RegisterComponent[] => [
	// --- Menu surface ---
	{
		type: CELL_MENU.type,
		key: CELL_MENU.key,
	},

	// --- Main action section (Background color, Merge cells, Split cell) ---
	{
		type: CELL_ACTION_SECTION.type,
		key: CELL_ACTION_SECTION.key,
		parents: [
			{
				type: CELL_MENU.type,
				key: CELL_MENU.key,
				rank: CELL_MENU_RANK[CELL_ACTION_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection>{props.children}</ToolbarDropdownItemSection>
		),
	},
	{
		type: MERGE_CELLS_ITEM.type,
		key: MERGE_CELLS_ITEM.key,
		parents: [
			{
				type: CELL_ACTION_SECTION.type,
				key: CELL_ACTION_SECTION.key,
				rank: CELL_ACTION_SECTION_RANK[MERGE_CELLS_ITEM.key],
			},
		],
		component: () => <MergeCellsItem />,
	},
	{
		type: SPLIT_CELL_ITEM.type,
		key: SPLIT_CELL_ITEM.key,
		parents: [
			{
				type: CELL_ACTION_SECTION.type,
				key: CELL_ACTION_SECTION.key,
				rank: CELL_ACTION_SECTION_RANK[SPLIT_CELL_ITEM.key],
			},
		],
		component: () => <SplitCellItem />,
	},

	// --- Danger section (Clear cell) ---
	{
		type: CELL_DANGER_SECTION.type,
		key: CELL_DANGER_SECTION.key,
		parents: [
			{
				type: CELL_MENU.type,
				key: CELL_MENU.key,
				rank: CELL_MENU_RANK[CELL_DANGER_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection hasSeparator>{props.children}</ToolbarDropdownItemSection>
		),
	},
];
