import type { ReactElement, ReactNode } from 'react';

import type { IntlShape } from 'react-intl';

import type { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TypeAheadPayload } from '../analytics/types/type-ahead';
import type { SelectItemMode, TypeAheadAvailableNodes } from '../type-ahead';
import type { EditorCommand } from '../types';

type TypeAheadForceSelectProps = {
	editorState: EditorState;
	items: Array<TypeAheadItem>;
	query: string;
};

export interface TypeAheadStats {
	endedAt: number;
	keyCount: {
		arrowDown: number;
		arrowUp: number;
	};
	startedAt: number;
}

export type TypeAheadItemRenderProps = {
	isSelected: boolean;
	onClick: () => void;
	onHover: () => void;
};

export type TypeAheadInsert = (
	node?: PMNode | Object | string | Fragment,
	opts?: { selectInlineNode?: boolean },
) => Transaction;

export type TypeAheadSelectItem = (
	state: EditorState,
	item: TypeAheadItem,
	insert: TypeAheadInsert,
	meta: {
		mode: SelectItemMode;
		query: string;
		sourceListItem: Array<TypeAheadItem>;
		stats: TypeAheadStats;
	},
) => Transaction | false;

export type TypeAheadItem = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	description?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: () => ReactElement<any>;
	// Offline editing work - when we move away from `PluginOptions` (to be deprecated) for editor we need to avoid this
	// but for now this greatly simplifies our work
	isDisabledOffline?: boolean;
	key?: string | number;
	keyshortcut?: string;
	lozenge?: ReactNode;
	priority?: number;
	render?: (props: TypeAheadItemRenderProps) => React.ReactElement<TypeAheadItemRenderProps> | null;
	testId?: string;
	title: string;
};

export type TypeAheadSection = {
	filter: (item: TypeAheadItem) => boolean;
	id: string;
	limit?: number;
	sectionTitleDisplay?: TypeAheadSectionTitleDisplay;
	title: string;
};

export type TypeAheadSectionTitleDisplay = {
	/**
	 * Keeps this section's title visible when it is the only section with matching items.
	 * Does not render the title for an empty section and does not override
	 * `showWhenQueryPresent: false`.
	 */
	showWhenOnlySection?: boolean;
	/**
	 * Controls whether this section's title stays visible once the typeahead query is non-empty.
	 * Defaults to true. Grouping, ordering, and section limits still apply when false.
	 */
	showWhenQueryPresent?: boolean;
};

export type TypeAheadSectionTitleUpdate = {
	id: string;
	/**
	 * Updates display rules for this section title in the current typeahead session.
	 */
	sectionTitleDisplay?: TypeAheadSectionTitleDisplay;
	title: string;
};

export type TypeAheadForceSelect = (props: TypeAheadForceSelectProps) => TypeAheadItem | undefined;

export type MoreOptionsButtonConfig = {
	ariaLabel?: string;
	iconBefore?: ReactNode;
	onClick: EditorCommand;
	title: string;
};

export type TypeAheadHandler = {
	/** Custom regex must have a capture group around trigger so it's possible to
	 * use it without needing to scan through all triggers again */
	customRegex?: string;

	/** Handler executes logic when TypeAhead is dismissed */
	dismiss?: (props: {
		editorState: EditorState;
		query: string;
		stats: TypeAheadStats;
		wasItemInserted?: boolean;
	}) => void;

	/** Handler returns typeahead item based on query. Used to find which item to insert. */
	forceSelect?: TypeAheadForceSelect;

	/**
	 * Optional handler that returns an item (Ask Rovo) to display in the typeahead's
	 * empty-results state.
	 */
	getEmptyItem?: (props: { editorState: EditorState }) => TypeAheadItem | undefined;

	getHighlight?: (state: EditorState) => JSX.Element | null;

	/** Handler returns an array of TypeAheadItem based on query to be displayed in the TypeAhead */
	getItems: (props: { editorState: EditorState; query: string }) => Promise<Array<TypeAheadItem>>;

	getMoreOptionsButtonConfig?: (intl: IntlShape) => MoreOptionsButtonConfig;

	/** Optional section definitions used by type-ahead menu to group items */
	getSections?: (props: { intl: IntlShape }) => Array<TypeAheadSection>;

	headless?: boolean;

	id: TypeAheadAvailableNodes;

	onInvokeAnalytics?: TypeAheadPayload;

	/** Handler executes logic when TypeAhead opens */
	onOpen?: (editorState: EditorState) => void;

	/** Handler returns a transaction which inserts the TypeAheadItem into the doc */
	selectItem: TypeAheadSelectItem;

	/** Pattern that will trigger the TypeAhead */
	trigger: string;
};
