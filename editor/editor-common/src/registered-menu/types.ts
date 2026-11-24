import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceIdentifier } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type {
	RegisterComponent,
	RegisterMenuItem,
	RegisterMenuSection,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import type { InsertContentCallback } from '../insert';
import type { RegisteredItemRankResolver } from './item-rank';

export type RegisteredMenuSection = [RegisterMenuSection, ...RegisterMenuItem[]];

/** Whether the keyboard or the pointer made the current menu selection. */
export type RegisteredMenuSelectionSource = 'keyboard' | 'pointer';

export type RegisteredMenuModel = {
	fallbackItems: RegisterMenuItem[];
	footer: RegisterMenuItem | undefined;
	root: RegisterComponent | undefined;
	sections: RegisteredMenuSection[];
};

export type RegisteredMenuItemProps = {
	id: string;
	isActive: boolean;
	isSelected: boolean;
	registration: RegisterMenuItem;
};

/**
 * A menu exposes its navigation and accessibility state so the host can connect
 * the element that has focus. The menu does not need to know whether that element is an input.
 */
export type RegisteredMenuInteraction = {
	activeDescendantId?: string;
	/** Includes any interactive portals owned by this menu. */
	containsTarget: (target: Node) => boolean;
	expanded: boolean;
	label: string;
	listId: string;
	onClose?: () => void;
	/** Return true when handled so the controlling input can suppress its default behavior. */
	onKeyDown: (event: KeyboardEvent) => boolean;
	optionCount: number;
	selectNext: () => void;
	selectPrevious: () => void;
};

export type RegisteredMenuSelection = (insert: InsertContentCallback) => Transaction | false | void;

/** How a menu item was selected, for hosts that report the selection to analytics. */
export type RegisteredMenuSelectionMeta = {
	inputMethod: 'keyboard' | 'mouse';
	/** Whether the selected item opens the full element browser, such as "View more". */
	isViewMore: boolean;
};

/**
 * Reports that the menu list rendered, for hosts that send `typeAhead rendered`. Memoise it: each
 * change of identity reports again.
 */
export type RegisteredMenuListRenderedHandler = (info: { itemCount: number; time: number }) => void;

/**
 * Reports the item the user highlights by keyboard, pointer or focus, for hosts that send
 * `typeAheadItem viewed`. Opening the menu, changing the query and reordering items do not report.
 * `itemCount` excludes the footer, so `index === itemCount` when the footer is highlighted.
 */
export type RegisteredMenuActiveItemChangeHandler = (info: {
	index: number;
	itemCount: number;
}) => void;

/** Editor and session values supplied by the host to the registered menu root. */
export type RegisteredMenuContextValue = {
	components: RegisterComponent[];
	editorView: EditorView;
	getItemRank?: RegisteredItemRankResolver;
	isOffline: boolean;
	maxHeight?: number;
	menuOpenId: symbol;
	/**
	 * Called when the user moves the highlight to another item. Roots that do not use
	 * `useRegisteredMenu` must call this themselves.
	 */
	onActiveItemChange?: RegisteredMenuActiveItemChangeHandler;
	onClose: () => void;
	/**
	 * Called each time the list renders a model. Roots that do not use `useRegisteredMenu` must call
	 * this themselves.
	 */
	onListRendered?: RegisteredMenuListRenderedHandler;
	/** Mount point for auxiliary portals such as item previews. The host owns the menu popup. */
	portalMountPoint?: HTMLElement;
	query?: string;
	registerInteraction: (interaction: RegisteredMenuInteraction) => () => void;
	rootComponent: SurfaceIdentifier;
	select?: (selection: RegisteredMenuSelection, meta: RegisteredMenuSelectionMeta) => void;
	surfaceContext: SurfaceContext;
};
