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

export type CommonComponentProps = {
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
	component?: ToolbarSectionComponent;
	parents: Parents<ToolbarType>;
};

export type RegisterToolbarGroup = ToolbarGroupType & {
	component?: ToolbarGroupComponent;
	parents: Parents<ToolbarSectionType>;
};

export type RegisterToolbarButton = ToolbarButtonType & {
	component?: ToolbarButtonComponent;
	parents: Parents<ToolbarGroupType>;
};

export type RegisterToolbarMenu = ToolbarMenuType & {
	component?: ToolbarMenuComponent;
	parents: Parents<ToolbarGroupType>;
};

export type RegisterToolbarNestedMenu = ToolbarNestedMenuType & {
	component: ToolbarNestedMenuComponent;
	parents: Parents<ToolbarMenuSectionType>;
};

export type RegisterToolbarMenuSection = ToolbarMenuSectionType & {
	component?: ToolbarMenuSectionComponent;
	parents: Parents<ToolbarMenuType | ToolbarNestedMenuType>;
};

export type RegisterToolbarMenuItem = ToolbarMenuItemType & {
	component?: ToolbarMenuItemComponent;
	isHidden?: () => boolean;
	parents: Parents<ToolbarMenuSectionType>;
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
