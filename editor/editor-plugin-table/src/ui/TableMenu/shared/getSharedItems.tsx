import React from 'react';

import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import {
	CELL_ACTION_SECTION,
	CELL_DANGER_SECTION,
	CELL_ACTION_SECTION_RANK,
	CELL_DANGER_SECTION_RANK,
} from '../cell/keys';
import {
	COLUMN_BACKGROUND_SECTION,
	COLUMN_DANGER_SECTION,
	COLUMN_BACKGROUND_SECTION_RANK,
	COLUMN_DANGER_SECTION_RANK,
} from '../column/keys';
import {
	ROW_BACKGROUND_SECTION,
	ROW_DANGER_SECTION,
	ROW_BACKGROUND_SECTION_RANK,
	ROW_DANGER_SECTION_RANK,
} from '../row/keys';

import { BackgroundColorItem } from './items/BackgroundColorItem';
import { ClearCellsItem } from './items/ClearCellsItem';
import { BACKGROUND_COLOR_ITEM, CLEAR_CELLS_ITEM } from './keys';
import type { TableMenuComponentsParams } from './types';

export const getSharedItems = ({ api }: TableMenuComponentsParams): RegisterComponent[] => [
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
		component: () => <BackgroundColorItem />,
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
