import type { MenuItemType, MenuSectionType, MenuType } from '@atlaskit/editor-ui-control-model';

import { BACKGROUND_COLOR_ITEM, CLEAR_CELLS_ITEM } from '../shared/keys';

// --- Menu surface ---

export const CELL_MENU: MenuType = { type: 'menu', key: 'cell-contextual-menu' };

// --- Sections ---

export const CELL_ACTION_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'cell-action-section',
};

export const CELL_DANGER_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'cell-danger-section',
};

export const CELL_MENU_RANK: Record<string, number> = {
	[CELL_ACTION_SECTION.key]: 100,
	[CELL_DANGER_SECTION.key]: 200,
};

export const MERGE_CELLS_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'merge-cells',
};

export const SPLIT_CELL_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'split-cell',
};

// --- Item ranks within their sections ---

export const CELL_ACTION_SECTION_RANK: Record<string, number> = {
	[BACKGROUND_COLOR_ITEM.key]: 100,
	[MERGE_CELLS_ITEM.key]: 200,
	[SPLIT_CELL_ITEM.key]: 300,
};

export const CELL_DANGER_SECTION_RANK: Record<string, number> = {
	[CLEAR_CELLS_ITEM.key]: 100,
};
