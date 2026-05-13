import type { MenuItemType, MenuSectionType, MenuType } from '@atlaskit/editor-ui-control-model';

// --- Menu surface ---

export const ROW_MENU: MenuType = { type: 'menu', key: 'row-handle-menu' };

// --- Sections ---

export const ROW_TOGGLE_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'row-toggle-section',
};
export const ROW_BACKGROUND_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'row-background-section',
};
export const ROW_ADD_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'row-add-section',
};
export const ROW_DANGER_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'row-danger-section',
};

export const ROW_SECTION_RANK: Record<string, number> = {
	[ROW_TOGGLE_SECTION.key]: 100,
	[ROW_BACKGROUND_SECTION.key]: 200,
	[ROW_ADD_SECTION.key]: 300,
	[ROW_DANGER_SECTION.key]: 400,
};

export const HEADER_ROW_TOGGLE_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'header-row-toggle',
};
export const NUMBERED_ROWS_TOGGLE_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'numbered-rows-toggle',
};
export const BACKGROUND_COLOR_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'background-color',
};
export const ADD_ROW_ABOVE_ITEM: MenuItemType = { type: 'menu-item', key: 'add-row-above' };
export const ADD_ROW_BELOW_ITEM: MenuItemType = { type: 'menu-item', key: 'add-row-below' };
export const MOVE_ROW_UP_ITEM: MenuItemType = { type: 'menu-item', key: 'move-row-up' };
export const MOVE_ROW_DOWN_ITEM: MenuItemType = { type: 'menu-item', key: 'move-row-down' };
export const CLEAR_CELLS_ITEM: MenuItemType = { type: 'menu-item', key: 'clear-cells' };
export const DELETE_ROW_ITEM: MenuItemType = { type: 'menu-item', key: 'delete-row' };

// --- Item ranks within their sections ---

export const TOGGLE_SECTION_ITEM_RANK: Record<string, number> = {
	[HEADER_ROW_TOGGLE_ITEM.key]: 100,
	[NUMBERED_ROWS_TOGGLE_ITEM.key]: 200,
};

export const BACKGROUND_SECTION_ITEM_RANK: Record<string, number> = {
	[BACKGROUND_COLOR_ITEM.key]: 100,
};

export const ADD_SECTION_ITEM_RANK: Record<string, number> = {
	[ADD_ROW_ABOVE_ITEM.key]: 100,
	[ADD_ROW_BELOW_ITEM.key]: 200,
	[MOVE_ROW_UP_ITEM.key]: 300,
	[MOVE_ROW_DOWN_ITEM.key]: 400,
};

export const DANGER_SECTION_ITEM_RANK: Record<string, number> = {
	[CLEAR_CELLS_ITEM.key]: 100,
	[DELETE_ROW_ITEM.key]: 200,
};
