import type { MenuItemType, MenuSectionType, MenuType } from '@atlaskit/editor-ui-control-model';

import { BACKGROUND_COLOR_ITEM, CLEAR_CELLS_ITEM } from '../shared/keys';

// --- Menu surface ---

export const COLUMN_MENU: MenuType = { type: 'menu', key: 'column-handle-menu' };

// --- Sections ---

export const COLUMN_TOGGLE_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'column-toggle-section',
};
export const COLUMN_BACKGROUND_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'column-background-section',
};
export const COLUMN_SORT_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'column-sort-section',
};
export const COLUMN_ADD_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'column-add-section',
};
export const COLUMN_DANGER_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'column-danger-section',
};

export const COLUMN_SECTION_RANK: Record<string, number> = {
	[COLUMN_TOGGLE_SECTION.key]: 100,
	[COLUMN_BACKGROUND_SECTION.key]: 200,
	[COLUMN_SORT_SECTION.key]: 300,
	[COLUMN_ADD_SECTION.key]: 400,
	[COLUMN_DANGER_SECTION.key]: 500,
};

export const HEADER_COLUMN_TOGGLE_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'header-column-toggle',
};
export const SORT_INCREASING_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'sort-increasing',
};
export const SORT_DECREASING_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'sort-decreasing',
};
export const ADD_COLUMN_LEFT_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'add-column-left',
};
export const ADD_COLUMN_RIGHT_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'add-column-right',
};
export const MOVE_COLUMN_LEFT_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'move-column-left',
};
export const MOVE_COLUMN_RIGHT_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'move-column-right',
};
export const DISTRIBUTE_COLUMNS_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'distribute-columns',
};
export const DELETE_COLUMN_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'delete-column',
};

// --- Item ranks within their sections ---

export const COLUMN_TOGGLE_SECTION_RANK: Record<string, number> = {
	[HEADER_COLUMN_TOGGLE_ITEM.key]: 100,
};

export const COLUMN_BACKGROUND_SECTION_RANK: Record<string, number> = {
	[BACKGROUND_COLOR_ITEM.key]: 100,
};

export const COLUMN_SORT_SECTION_RANK: Record<string, number> = {
	[SORT_INCREASING_ITEM.key]: 100,
	[SORT_DECREASING_ITEM.key]: 200,
};

export const COLUMN_ADD_SECTION_RANK: Record<string, number> = {
	[ADD_COLUMN_LEFT_ITEM.key]: 100,
	[ADD_COLUMN_RIGHT_ITEM.key]: 200,
	[MOVE_COLUMN_LEFT_ITEM.key]: 300,
	[MOVE_COLUMN_RIGHT_ITEM.key]: 400,
	[DISTRIBUTE_COLUMNS_ITEM.key]: 500,
};

export const COLUMN_DANGER_SECTION_RANK: Record<string, number> = {
	[CLEAR_CELLS_ITEM.key]: 100,
	[DELETE_COLUMN_ITEM.key]: 200,
};
