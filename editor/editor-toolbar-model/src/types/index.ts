type WithRank<T> = T & { rank: number };

type Parents<T> = Array<WithRank<T>>;

export type ToolbarComponentType =
	| ToolbarType
	| ToolbarSectionType
	| ToolbarGroupType
	| ToolbarButtonType
	| ToolbarMenuType
	| ToolbarNestedMenuType
	| ToolbarMenuSectionType
	| ToolbarMenuItemType;

export type ToolbarComponentTypes = Array<ToolbarComponentType>;

type CommonComponentProps = {
	/**
	 * Array of parent information including both keys and types
	 * Ordered from immediate parent to root parent
	 */
	parents: ToolbarComponentTypes;
};

export type ToolbarComponent = (props: { children: React.ReactNode }) => React.ReactNode;

export type ToolbarSectionComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarGroupComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarMenuComponent = (
	props: {
		children: React.ReactNode;
	} & CommonComponentProps,
) => React.ReactNode;

export type ToolbarNestedMenuComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarButtonComponent = (props: {} & CommonComponentProps) => React.ReactNode;

export type ToolbarMenuSectionComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarMenuItemComponent = (props: {} & CommonComponentProps) => React.ReactNode;

export type ToolbarType = {
	key: string;
	type: 'toolbar';
};

type ToolbarSectionType = {
	key: string;
	type: 'section';
};

type ToolbarGroupType = {
	key: string;
	type: 'group';
};

type ToolbarButtonType = {
	key: string;
	type: 'button';
};

type ToolbarMenuItemType = {
	key: string;
	type: 'menu-item';
};

type ToolbarMenuSectionType = {
	key: string;
	type: 'menu-section';
};

type ToolbarMenuType = {
	key: string;
	type: 'menu';
};

type ToolbarNestedMenuType = {
	key: string;
	type: 'nested-menu';
};

export type RegisterToolbar = ToolbarType & {
	component?: ToolbarComponent;
};

export type RegisterToolbarSection = ToolbarSectionType & {
	parents: Parents<ToolbarType>;
	component?: ToolbarSectionComponent;
};

export type RegisterToolbarGroup = ToolbarGroupType & {
	parents: Parents<ToolbarSectionType>;
	component?: ToolbarGroupComponent;
};

export type RegisterToolbarButton = ToolbarButtonType & {
	parents: Parents<ToolbarGroupType>;
	component?: ToolbarButtonComponent;
};

export type RegisterToolbarMenu = ToolbarMenuType & {
	parents: Parents<ToolbarGroupType>;
	component?: ToolbarMenuComponent;
};

export type RegisterToolbarNestedMenu = ToolbarNestedMenuType & {
	parents: Parents<ToolbarMenuSectionType>;
	component: ToolbarNestedMenuComponent;
};

export type RegisterToolbarMenuSection = ToolbarMenuSectionType & {
	parents: Parents<ToolbarMenuType | ToolbarNestedMenuType>;
	component?: ToolbarMenuSectionComponent;
};

export type RegisterToolbarMenuItem = ToolbarMenuItemType & {
	parents: Parents<ToolbarMenuSectionType>;
	component?: ToolbarMenuItemComponent;
};

export type RegisterComponent =
	| RegisterToolbar
	| RegisterToolbarSection
	| RegisterToolbarGroup
	| RegisterToolbarButton
	| RegisterToolbarMenu
	| RegisterToolbarNestedMenu
	| RegisterToolbarMenuSection
	| RegisterToolbarMenuItem;
