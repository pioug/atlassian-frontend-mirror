import type {
	MenuItemType,
	MenuSectionType,
	MenuType,
	NestedMenuType,
} from '@atlaskit/editor-ui-control-model';

import { ADD_COLUMN_RIGHT_ITEM, DELETE_COLUMN_ITEM, DISTRIBUTE_COLUMNS_ITEM } from '../column/keys';
import { ADD_ROW_BELOW_ITEM, DELETE_ROW_ITEM } from '../row/keys';
import { BACKGROUND_COLOR_ITEM, CLEAR_CELLS_ITEM } from '../shared/keys';

// --- Menu surface ---

export const CELL_MENU: MenuType = { type: 'menu', key: 'cell-contextual-menu' };

// --- Sections ---

export const CELL_ACTION_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'cell-action-section',
};

export const CELL_ADD_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'cell-add-section',
};

export const CELL_DANGER_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'cell-danger-section',
};

export const CELL_MENU_RANK: Record<string, number> = {
	[CELL_ACTION_SECTION.key]: 100,
	[CELL_ADD_SECTION.key]: 200,
	[CELL_DANGER_SECTION.key]: 300,
};

export const MERGE_CELLS_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'merge-cells',
};

export const SPLIT_CELL_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'split-cell',
};

export const VERTICAL_ALIGN_MENU: NestedMenuType = {
	type: 'nested-menu',
	key: 'vertical-align',
};

export const VERTICAL_ALIGN_MENU_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'vertical-align-section',
};

export const VERTICAL_ALIGN_TOP_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'vertical-align-top',
};

export const VERTICAL_ALIGN_MIDDLE_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'vertical-align-middle',
};

export const VERTICAL_ALIGN_BOTTOM_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'vertical-align-bottom',
};

// --- Item ranks within their sections ---
//
// The add/delete items rendered in the cell menu are shared with the row/column
// menus (registered once in `../shared/getSharedItems` with multiple parents), so
// we reuse their existing keys here rather than declaring cell-specific ones.

export const CELL_ACTION_SECTION_RANK: Record<string, number> = {
	[BACKGROUND_COLOR_ITEM.key]: 100,
	[VERTICAL_ALIGN_MENU.key]: 200,
	[MERGE_CELLS_ITEM.key]: 300,
	[SPLIT_CELL_ITEM.key]: 400,
};

export const VERTICAL_ALIGN_MENU_RANK: Record<string, number> = {
	[VERTICAL_ALIGN_MENU_SECTION.key]: 100,
};

export const VERTICAL_ALIGN_MENU_SECTION_RANK: Record<string, number> = {
	[VERTICAL_ALIGN_TOP_ITEM.key]: 100,
	[VERTICAL_ALIGN_MIDDLE_ITEM.key]: 200,
	[VERTICAL_ALIGN_BOTTOM_ITEM.key]: 300,
};

// Merge/Split cells are relocated from the action section into the add section when the
// cell menu update gate is on; they sit at the top of the section.
export const CELL_ADD_SECTION_RANK: Record<string, number> = {
	[MERGE_CELLS_ITEM.key]: 100,
	[SPLIT_CELL_ITEM.key]: 200,
	[ADD_COLUMN_RIGHT_ITEM.key]: 300,
	[ADD_ROW_BELOW_ITEM.key]: 400,
	[DISTRIBUTE_COLUMNS_ITEM.key]: 500,
};

export const CELL_DANGER_SECTION_RANK: Record<string, number> = {
	[CLEAR_CELLS_ITEM.key]: 100,
	[DELETE_COLUMN_ITEM.key]: 200,
	[DELETE_ROW_ITEM.key]: 300,
};
