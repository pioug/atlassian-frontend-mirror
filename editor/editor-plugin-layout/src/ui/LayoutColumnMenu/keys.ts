import type {
	MenuItemType,
	MenuSectionType,
	MenuType,
	NestedMenuType,
} from '@atlaskit/editor-ui-control-model';

// --- Menu surface ---

export const LAYOUT_COLUMN_MENU: MenuType = {
	type: 'menu',
	key: 'layout-column-menu',
};

// --- Sections ---

export const LAYOUT_COLUMN_MENU_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'layout-column-menu-section',
};

export const LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION: MenuSectionType = {
	type: 'menu-section',
	key: 'layout-column-vertical-align-menu-section',
};

export const LAYOUT_COLUMN_MENU_RANK: Record<string, number> = {
	[LAYOUT_COLUMN_MENU_SECTION.key]: 100,
};

// --- Menus ---

export const VERTICAL_ALIGN_MENU: NestedMenuType = {
	type: 'nested-menu',
	key: 'layout-column-menu-vertical-align-menu',
};

// --- Items ---

export const INSERT_COLUMN_LEFT_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-insert-left-item',
};

export const INSERT_COLUMN_RIGHT_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-insert-right-item',
};

export const DISTRIBUTE_COLUMNS_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-distribute-columns-item',
};

export const VERTICAL_ALIGN_TOP_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-vertical-align-top-item',
};

export const VERTICAL_ALIGN_MIDDLE_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-vertical-align-middle-item',
};

export const VERTICAL_ALIGN_BOTTOM_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-vertical-align-bottom-item',
};

export const DELETE_COLUMN_MENU_ITEM: MenuItemType = {
	type: 'menu-item',
	key: 'layout-column-menu-delete-item',
};

// --- Item ranks within sections ---

export const LAYOUT_COLUMN_MENU_SECTION_RANK: Record<string, number> = {
	[VERTICAL_ALIGN_MENU.key]: 100,
	[INSERT_COLUMN_LEFT_MENU_ITEM.key]: 200,
	[INSERT_COLUMN_RIGHT_MENU_ITEM.key]: 300,
	[DISTRIBUTE_COLUMNS_MENU_ITEM.key]: 400,
	[DELETE_COLUMN_MENU_ITEM.key]: 500,
};

export const VERTICAL_ALIGN_MENU_RANK: Record<string, number> = {
	[LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION.key]: 100,
};

export const VERTICAL_ALIGN_MENU_SECTION_RANK: Record<string, number> = {
	[VERTICAL_ALIGN_TOP_MENU_ITEM.key]: 100,
	[VERTICAL_ALIGN_MIDDLE_MENU_ITEM.key]: 200,
	[VERTICAL_ALIGN_BOTTOM_MENU_ITEM.key]: 300,
};
