import type React from 'react';

import type { MessageDescriptor } from 'react-intl';

type WithRank<T> = T & { rank: number };

type Parents<T> = Array<WithRank<T>>;

/** An opaque, typed key for a value transported through a surface renderer. */
export type ContextToken<TValue> = symbol & { readonly __type?: TValue };

export type SurfaceContext = {
	get: <TValue>(token: ContextToken<TValue>) => TValue | undefined;
};

export const createContextToken = <TValue>(description: string): ContextToken<TValue> =>
	Symbol(description) as ContextToken<TValue>;

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
	children?: React.ReactNode;
	parents?: ComponentTypes;
	surfaceContext?: SurfaceContext;
};

export type RegisteredComponent<TProps extends CommonComponentProps = CommonComponentProps> = {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- Method syntax intentionally makes consumer-specific component props bivariant within the heterogeneous registry.
	bivarianceHack(props: TProps): React.ReactNode;
}['bivarianceHack'];

export type IsHiddenOptions = {
	surfaceContext?: SurfaceContext;
};

/**
 * A synchronous, pure visibility predicate.
 *
 * It must not read layout, mutate editor state, perform I/O, or otherwise cause side effects.
 */
export type IsComponentHidden = (options?: IsHiddenOptions) => boolean;

// --- Registration types ---

/**
 * Context passed to `isAsyncHidden` callbacks for async visibility checks.
 */
export type AsyncHiddenContext = {
	/** The URL of a single pasted smart link, if the paste event contained one. */
	pastedUrl?: string;
};

/** Toolbar surface root. No parents — this is a top-level surface.
 *
 * toolbar (surface)
 *   └── section → group → button | menu → …
 */
export type RegisterToolbar<TProps extends CommonComponentProps = CommonComponentProps> =
	ToolbarType & {
		component?: RegisteredComponent<TProps>;
		/**
		 * Optional async visibility check. When present, the paste menu will run
		 * this function in parallel with other async checks and hide this component
		 * if it resolves to `true`. Wrapped in a 3-second timeout — on timeout or
		 * error the component is hidden (safe default).
		 */
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents?: undefined;
	};

/**
 * Menu surface root. No parents — this is a top-level surface.
 *
 * menu (surface)
 *   └── menu-section → menu-item | nested-menu → …
 */
export type RegisterMenuSurface<TProps extends CommonComponentProps = CommonComponentProps> =
	MenuType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents?: undefined;
	};

/** Section within a toolbar surface. */
export type RegisterSection<TProps extends CommonComponentProps = CommonComponentProps> =
	SectionType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents: Parents<ToolbarType>;
	};

/** Group within a toolbar section. */
export type RegisterGroup<TProps extends CommonComponentProps = CommonComponentProps> =
	GroupType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents: Parents<SectionType>;
	};

/** Button within a toolbar group. Leaf node. */
export type RegisterButton<TProps extends CommonComponentProps = CommonComponentProps> =
	ButtonType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents: Parents<GroupType>;
	};

/** Menu (dropdown) within a toolbar group. */
export type RegisterMenu<TProps extends CommonComponentProps = CommonComponentProps> = MenuType & {
	component?: RegisteredComponent<TProps>;
	isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
	isHidden?: IsComponentHidden;
	parents: Parents<GroupType>;
};

/** Section within a menu or nested-menu. */
export type RegisterMenuSection<TProps extends CommonComponentProps = CommonComponentProps> =
	MenuSectionType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents: Parents<MenuType | NestedMenuType>;
	};

export type MenuItemMatchContext = {
	formatMessage: (
		descriptor: MessageDescriptor,
		values?: Record<string, string | number | boolean | Date>,
	) => string;
	query: string;
};

/** A successful menu-item match. Matchers return `null` when an item does not match. */
export type MenuItemMatchResult = {
	/** Relevance for the current query, normalized from 0 (best) to 1 (worst). */
	score: number;
};

export type RegisterMenuItemMatch = (context: MenuItemMatchContext) => MenuItemMatchResult | null;

/** Menu item within a menu-section. Leaf node. */
export type RegisterMenuItem<TProps extends CommonComponentProps = CommonComponentProps> =
	MenuItemType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		match?: RegisterMenuItemMatch;
		parents: Parents<MenuSectionType>;
	};

/** Nested sub-menu within a menu-section. */
export type RegisterNestedMenu<TProps extends CommonComponentProps = CommonComponentProps> =
	NestedMenuType & {
		component?: RegisteredComponent<TProps>;
		isAsyncHidden?: (context: AsyncHiddenContext) => Promise<boolean>;
		isHidden?: IsComponentHidden;
		parents: Parents<MenuSectionType>;
	};

// --- Discriminated union ---

export type RegisterComponent<TProps extends CommonComponentProps = CommonComponentProps> =
	| RegisterToolbar<TProps>
	| RegisterMenuSurface<TProps>
	| RegisterSection<TProps>
	| RegisterGroup<TProps>
	| RegisterButton<TProps>
	| RegisterMenu<TProps>
	| RegisterMenuSection<TProps>
	| RegisterMenuItem<TProps>
	| RegisterNestedMenu<TProps>;

export type ComponentIdentifier = Pick<RegisterComponent, 'key' | 'type'>;

export type RegisterComponentParent = WithRank<ComponentType>;
