import React, { type PropsWithChildren } from 'react';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';
import AlignPositionBottomIcon from '@atlaskit/icon-lab/core/align-position-bottom';
import AlignPositionCenterVerticalIcon from '@atlaskit/icon-lab/core/align-position-center-vertical';
import AlignPositionTopIcon from '@atlaskit/icon-lab/core/align-position-top';

import type { TableMenuComponentsParams } from '../shared/types';

import { MergeCellsItem } from './items/MergeCellsItem';
import { SplitCellItem } from './items/SplitCellItem';
import { VerticalAlignDropdownItem } from './items/VerticalAlignDropdownItem';
import { VerticalAlignNestedMenu } from './items/VerticalAlignNestedMenu';
import {
	CELL_MENU,
	CELL_ACTION_SECTION,
	CELL_DANGER_SECTION,
	CELL_MENU_RANK,
	MERGE_CELLS_ITEM,
	SPLIT_CELL_ITEM,
	CELL_ACTION_SECTION_RANK,
	VERTICAL_ALIGN_BOTTOM_ITEM,
	VERTICAL_ALIGN_MENU,
	VERTICAL_ALIGN_MENU_RANK,
	VERTICAL_ALIGN_MENU_SECTION,
	VERTICAL_ALIGN_MENU_SECTION_RANK,
	VERTICAL_ALIGN_MIDDLE_ITEM,
	VERTICAL_ALIGN_TOP_ITEM,
} from './keys';

export const getCellMenuComponents = ({ api }: TableMenuComponentsParams): RegisterComponent[] => [
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
		type: VERTICAL_ALIGN_MENU.type,
		key: VERTICAL_ALIGN_MENU.key,
		parents: [
			{
				type: CELL_ACTION_SECTION.type,
				key: CELL_ACTION_SECTION.key,
				rank: CELL_ACTION_SECTION_RANK[VERTICAL_ALIGN_MENU.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<VerticalAlignNestedMenu>{props.children}</VerticalAlignNestedMenu>
		),
	},
	{
		type: VERTICAL_ALIGN_MENU_SECTION.type,
		key: VERTICAL_ALIGN_MENU_SECTION.key,
		parents: [
			{
				type: VERTICAL_ALIGN_MENU.type,
				key: VERTICAL_ALIGN_MENU.key,
				rank: VERTICAL_ALIGN_MENU_RANK[VERTICAL_ALIGN_MENU_SECTION.key],
			},
		],
		component: (props: PropsWithChildren) => (
			<ToolbarDropdownItemSection>{props.children}</ToolbarDropdownItemSection>
		),
	},
	{
		type: VERTICAL_ALIGN_TOP_ITEM.type,
		key: VERTICAL_ALIGN_TOP_ITEM.key,
		parents: [
			{
				type: VERTICAL_ALIGN_MENU_SECTION.type,
				key: VERTICAL_ALIGN_MENU_SECTION.key,
				rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_TOP_ITEM.key],
			},
		],
		component: () => (
			<VerticalAlignDropdownItem
				api={api}
				icon={AlignPositionTopIcon}
				label={messages.cellAlignmentTop}
				value="top"
			/>
		),
	},
	{
		type: VERTICAL_ALIGN_MIDDLE_ITEM.type,
		key: VERTICAL_ALIGN_MIDDLE_ITEM.key,
		parents: [
			{
				type: VERTICAL_ALIGN_MENU_SECTION.type,
				key: VERTICAL_ALIGN_MENU_SECTION.key,
				rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_MIDDLE_ITEM.key],
			},
		],
		component: () => (
			<VerticalAlignDropdownItem
				api={api}
				icon={AlignPositionCenterVerticalIcon}
				label={messages.cellAlignmentMiddle}
				value="middle"
			/>
		),
	},
	{
		type: VERTICAL_ALIGN_BOTTOM_ITEM.type,
		key: VERTICAL_ALIGN_BOTTOM_ITEM.key,
		parents: [
			{
				type: VERTICAL_ALIGN_MENU_SECTION.type,
				key: VERTICAL_ALIGN_MENU_SECTION.key,
				rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_BOTTOM_ITEM.key],
			},
		],
		component: () => (
			<VerticalAlignDropdownItem
				api={api}
				icon={AlignPositionBottomIcon}
				label={messages.cellAlignmentBottom}
				value="bottom"
			/>
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
		component: () => <MergeCellsItem api={api} />,
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
		component: () => <SplitCellItem api={api} />,
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
