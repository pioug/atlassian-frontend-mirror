import React from 'react';

import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

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

export const getSharedItems = (): RegisterComponent[] => [
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
		],
		component: () => <ClearCellsItem />,
	},
];
