type WithRank<T> = T & { rank: number };

type Parents<T> = Array<WithRank<T>>;

type ComponentType =
	| Toolbar
	| ToolbarSection
	| ToolbarGroup
	| ToolbarButton
	| ToolbarMenu
	| ToolbarMenuSection
	| ToolbarMenuItem;

export type ComponentTypes = Array<ComponentType>;

type CommonComponentProps = {
	/**
	 * Array of parent information including both keys and types
	 * Ordered from immediate parent to root parent
	 */
	parents: ComponentTypes;
};

export type ToolbarButtonGroupLocation = 'start' | 'middle' | 'end';

export type ToolbarComponent = (props: { children: React.ReactNode }) => React.ReactNode;

export type ToolbarSectionComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarGroupComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarMenuComponent = (
	props: {
		groupLocation?: ToolbarButtonGroupLocation;
		children: React.ReactNode;
	} & CommonComponentProps,
) => React.ReactNode;

export type ToolbarButtonComponent = (
	props: {
		groupLocation?: ToolbarButtonGroupLocation;
	} & CommonComponentProps,
) => React.ReactNode;

export type ToolbarMenuSectionComponent = (
	props: { children: React.ReactNode } & CommonComponentProps,
) => React.ReactNode;

export type ToolbarMenuItemComponent = (props: {} & CommonComponentProps) => React.ReactNode;

type Toolbar = {
	type: 'toolbar';
	key: string;
};

type ToolbarSection = {
	key: string;
	type: 'section';
};

type ToolbarGroup = {
	key: string;
	type: 'group';
};

type ToolbarButton = {
	key: string;
	type: 'button';
};

type ToolbarMenuItem = {
	key: string;
	type: 'menu-item';
};

type ToolbarMenuSection = {
	key: string;
	type: 'menu-section';
};

type ToolbarMenu = {
	key: string;
	type: 'menu';
};

export type RegisterToolbar = Toolbar & {
	component?: ToolbarComponent;
};

export type RegisterToolbarSection = ToolbarSection & {
	parents: Parents<Toolbar>;
	component?: ToolbarSectionComponent;
};

export type RegisterToolbarGroup = ToolbarGroup & {
	parents: Parents<ToolbarSection>;
	component?: ToolbarGroupComponent;
};

export type RegisterToolbarButton = ToolbarButton & {
	parents: Parents<ToolbarGroup>;
	component?: ToolbarButtonComponent;
};

export type RegisterToolbarMenu = ToolbarMenu & {
	parents: Parents<ToolbarGroup>;
	component?: ToolbarMenuComponent;
};

export type RegisterToolbarMenuSection = ToolbarMenuSection & {
	parents: Parents<ToolbarMenu>;
	component?: ToolbarMenuSectionComponent;
};

export type RegisterToolbarMenuItem = ToolbarMenuItem & {
	parents: Parents<ToolbarMenuSection>;
	component?: ToolbarMenuItemComponent;
};

export type RegisterComponent =
	| RegisterToolbar
	| RegisterToolbarSection
	| RegisterToolbarGroup
	| RegisterToolbarButton
	| RegisterToolbarMenu
	| RegisterToolbarMenuSection
	| RegisterToolbarMenuItem;
