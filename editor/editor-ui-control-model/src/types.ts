import type React from 'react';

type WithRank<T> = T & { rank: number };

type Parents<T> = Array<WithRank<T>>;

// --- Component type identifiers ---

export type ToolbarType = {
	key: string;
	type: 'toolbar';
};

export type MenuType = {
	key: string;
	type: 'menu';
};

export type SectionType = {
	key: string;
	type: 'section';
};

export type GroupType = {
	key: string;
	type: 'group';
};

export type ButtonType = {
	key: string;
	type: 'button';
};

export type MenuSectionType = {
	key: string;
	type: 'menu-section';
};

export type MenuItemType = {
	key: string;
	type: 'menu-item';
};

export type NestedMenuType = {
	key: string;
	type: 'nested-menu';
};

export type ComponentType =
	| ToolbarType
	| MenuType
	| SectionType
	| GroupType
	| ButtonType
	| MenuSectionType
	| MenuItemType
	| NestedMenuType;

export type ComponentTypes = Array<ComponentType>;

export type CommonComponentProps = {
	parents: ComponentTypes;
};

// --- Registration types ---

/**
 * Toolbar surface root. No parents — this is a top-level surface.
 *
 * toolbar (surface)
 *   └── section → group → button | menu → …
 */
export type RegisterToolbar = ToolbarType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents?: undefined;
};

/**
 * Menu surface root. No parents — this is a top-level surface.
 *
 * menu (surface)
 *   └── menu-section → menu-item | nested-menu → …
 */
export type RegisterMenuSurface = MenuType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents?: undefined;
};

/** Section within a toolbar surface. */
export type RegisterSection = SectionType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<ToolbarType>;
};

/** Group within a toolbar section. */
export type RegisterGroup = GroupType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<SectionType>;
};

/** Button within a toolbar group. Leaf node. */
export type RegisterButton = ButtonType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<GroupType>;
};

/** Menu (dropdown) within a toolbar group. */
export type RegisterMenu = MenuType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<GroupType>;
};

/** Section within a menu or nested-menu. */
export type RegisterMenuSection = MenuSectionType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<MenuType | NestedMenuType>;
};

/** Menu item within a menu-section. Leaf node. */
export type RegisterMenuItem = MenuItemType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<MenuSectionType>;
};

/** Nested sub-menu within a menu-section. */
export type RegisterNestedMenu = NestedMenuType & {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	parents: Parents<MenuSectionType>;
};

// --- Discriminated union ---

export type RegisterComponent =
	| RegisterToolbar
	| RegisterMenuSurface
	| RegisterSection
	| RegisterGroup
	| RegisterButton
	| RegisterMenu
	| RegisterMenuSection
	| RegisterMenuItem
	| RegisterNestedMenu;

export type RegisterComponentParent = WithRank<ComponentType>;
