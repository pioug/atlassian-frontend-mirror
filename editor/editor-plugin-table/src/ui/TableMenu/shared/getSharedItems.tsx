import React from 'react';

import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	CELL_ACTION_SECTION,
	CELL_ADD_SECTION,
	CELL_DANGER_SECTION,
	CELL_ACTION_SECTION_RANK,
	CELL_ADD_SECTION_RANK,
	CELL_DANGER_SECTION_RANK,
} from '../cell/keys';
import { AddColumnRightItem } from '../column/items/AddColumnRightItem';
import { DeleteColumnItem } from '../column/items/DeleteColumnItem';
import { DistributeColumnsItem } from '../column/items/DistributeColumnsItem';
import {
	ADD_COLUMN_RIGHT_ITEM,
	COLUMN_ADD_SECTION,
	COLUMN_BACKGROUND_SECTION,
	COLUMN_DANGER_SECTION,
	COLUMN_ADD_SECTION_RANK,
	COLUMN_BACKGROUND_SECTION_RANK,
	COLUMN_DANGER_SECTION_RANK,
	DELETE_COLUMN_ITEM,
	DISTRIBUTE_COLUMNS_ITEM,
} from '../column/keys';
import { AddRowBelowItem } from '../row/items/AddRowBelowItem';
import { DeleteRowItem } from '../row/items/DeleteRowItem';
import {
	ADD_ROW_BELOW_ITEM,
	DELETE_ROW_ITEM,
	ROW_ADD_SECTION,
	ROW_BACKGROUND_SECTION,
	ROW_DANGER_SECTION,
	ROW_ADD_SECTION_RANK,
	ROW_BACKGROUND_SECTION_RANK,
	ROW_DANGER_SECTION_RANK,
} from '../row/keys';

import { BackgroundColorItem } from './items/BackgroundColorItem';
import { ClearCellsItem } from './items/ClearCellsItem';
import { BACKGROUND_COLOR_ITEM, CLEAR_CELLS_ITEM } from './keys';
import type { TableMenuComponentsParams } from './types';

export const getSharedItems = ({ api }: TableMenuComponentsParams): RegisterComponent[] =>
	fg('platform_editor_table_cell_menu_update')
		? [
				// --- Cell menu update ON ---
				// The add/delete items move out of the row/column menu files and are registered here
				// once with an additional cell parent, so they render inside the cell menu too.
				{
					type: BACKGROUND_COLOR_ITEM.type,
					key: BACKGROUND_COLOR_ITEM.key,
					parents: [
						{
							type: ROW_BACKGROUND_SECTION.type,
							key: ROW_BACKGROUND_SECTION.key,
							rank: ROW_BACKGROUND_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
						{
							type: COLUMN_BACKGROUND_SECTION.type,
							key: COLUMN_BACKGROUND_SECTION.key,
							rank: COLUMN_BACKGROUND_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
						{
							type: CELL_ACTION_SECTION.type,
							key: CELL_ACTION_SECTION.key,
							rank: CELL_ACTION_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
					],
					component: () => <BackgroundColorItem api={api} />,
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
						{
							type: CELL_ADD_SECTION.type,
							key: CELL_ADD_SECTION.key,
							rank: CELL_ADD_SECTION_RANK[ADD_COLUMN_RIGHT_ITEM.key],
						},
					],
					component: () => <AddColumnRightItem api={api} />,
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
						{
							type: CELL_ADD_SECTION.type,
							key: CELL_ADD_SECTION.key,
							rank: CELL_ADD_SECTION_RANK[ADD_ROW_BELOW_ITEM.key],
						},
					],
					component: () => <AddRowBelowItem api={api} />,
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
						{
							type: CELL_ADD_SECTION.type,
							key: CELL_ADD_SECTION.key,
							rank: CELL_ADD_SECTION_RANK[DISTRIBUTE_COLUMNS_ITEM.key],
						},
					],
					component: () => <DistributeColumnsItem api={api} />,
				},
				{
					type: CLEAR_CELLS_ITEM.type,
					key: CLEAR_CELLS_ITEM.key,
					parents: [
						{
							type: ROW_DANGER_SECTION.type,
							key: ROW_DANGER_SECTION.key,
							rank: ROW_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
						{
							type: COLUMN_DANGER_SECTION.type,
							key: COLUMN_DANGER_SECTION.key,
							rank: COLUMN_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
						{
							type: CELL_DANGER_SECTION.type,
							key: CELL_DANGER_SECTION.key,
							rank: CELL_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
					],
					component: () => <ClearCellsItem api={api} />,
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
						{
							type: CELL_DANGER_SECTION.type,
							key: CELL_DANGER_SECTION.key,
							rank: CELL_DANGER_SECTION_RANK[DELETE_COLUMN_ITEM.key],
						},
					],
					component: () => <DeleteColumnItem api={api} />,
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
						{
							type: CELL_DANGER_SECTION.type,
							key: CELL_DANGER_SECTION.key,
							rank: CELL_DANGER_SECTION_RANK[DELETE_ROW_ITEM.key],
						},
					],
					component: () => <DeleteRowItem api={api} />,
				},
			]
		: [
				// --- Cell menu update OFF: legacy shared items (background color + clear cells only).
				// The add/delete items are registered by the row/column menu files in this mode.
				{
					type: BACKGROUND_COLOR_ITEM.type,
					key: BACKGROUND_COLOR_ITEM.key,
					parents: [
						{
							type: ROW_BACKGROUND_SECTION.type,
							key: ROW_BACKGROUND_SECTION.key,
							rank: ROW_BACKGROUND_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
						{
							type: COLUMN_BACKGROUND_SECTION.type,
							key: COLUMN_BACKGROUND_SECTION.key,
							rank: COLUMN_BACKGROUND_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
						{
							type: CELL_ACTION_SECTION.type,
							key: CELL_ACTION_SECTION.key,
							rank: CELL_ACTION_SECTION_RANK[BACKGROUND_COLOR_ITEM.key],
						},
					],
					component: () => <BackgroundColorItem api={api} />,
				},
				{
					type: CLEAR_CELLS_ITEM.type,
					key: CLEAR_CELLS_ITEM.key,
					parents: [
						{
							type: ROW_DANGER_SECTION.type,
							key: ROW_DANGER_SECTION.key,
							rank: ROW_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
						{
							type: COLUMN_DANGER_SECTION.type,
							key: COLUMN_DANGER_SECTION.key,
							rank: COLUMN_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
						{
							type: CELL_DANGER_SECTION.type,
							key: CELL_DANGER_SECTION.key,
							rank: CELL_DANGER_SECTION_RANK[CLEAR_CELLS_ITEM.key],
						},
					],
					component: () => <ClearCellsItem api={api} />,
				},
			];
