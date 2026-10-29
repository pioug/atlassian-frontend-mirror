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

/** Editor and session values supplied by the host to the registered menu root. */
export type RegisteredMenuContextValue = {
	components: RegisterComponent[];
	editorView: EditorView;
	getItemRank?: RegisteredItemRankResolver;
	isOffline: boolean;
	maxHeight?: number;
	menuOpenId: symbol;
	onClose: () => void;
	/** Mount point for auxiliary portals such as item previews. The host owns the menu popup. */
	portalMountPoint?: HTMLElement;
	query?: string;
	registerInteraction: (interaction: RegisteredMenuInteraction) => () => void;
	rootComponent: SurfaceIdentifier;
	select?: (selection: RegisteredMenuSelection) => void;
	surfaceContext: SurfaceContext;
};
