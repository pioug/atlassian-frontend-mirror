import type { ReactElement } from 'react';

import { type Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TypeAheadPayload } from '../analytics/types/type-ahead';
import type { SelectItemMode, TypeAheadAvailableNodes } from '../type-ahead';

type TypeAheadForceSelectProps = {
	query: string;
	items: Array<TypeAheadItem>;
	editorState: EditorState;
};

export interface TypeAheadStats {
	startedAt: number;
	endedAt: number;
	keyCount: {
		arrowUp: number;
		arrowDown: number;
	};
}

export type TypeAheadItemRenderProps = {
	onClick: () => void;
	onHover: () => void;
	isSelected: boolean;
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
		stats: TypeAheadStats;
		query: string;
		sourceListItem: Array<TypeAheadItem>;
	},
) => Transaction | false;

export type TypeAheadItem = {
	title: string;
	description?: string;
	keyshortcut?: string;
	key?: string | number;
	icon?: () => ReactElement<any>;
	render?: (props: TypeAheadItemRenderProps) => React.ReactElement<TypeAheadItemRenderProps> | null;
	// Offline editing work - when we move away from `PluginOptions` (to be deprecated) for editor we need to avoid this
	// but for now this greatly simplifies our work
	isDisabledOffline?: boolean;
	[key: string]: any;
};

export type TypeAheadForceSelect = (props: TypeAheadForceSelectProps) => TypeAheadItem | undefined;

export type TypeAheadHandler = {
	id: TypeAheadAvailableNodes;

	/** Pattern that will trigger the TypeAhead */
	trigger: string;

	/** Custom regex must have a capture group around trigger so it's possible to
	 * use it without needing to scan through all triggers again */
	customRegex?: string;

	headless?: boolean;

	/** Handler returns typeahead item based on query. Used to find which item to insert. */
	forceSelect?: TypeAheadForceSelect;

	onInvokeAnalytics?: TypeAheadPayload;

	/** Handler executes logic when TypeAhead opens */
	onOpen?: (editorState: EditorState) => void;

	/** Handler returns an array of TypeAheadItem based on query to be displayed in the TypeAhead */
	getItems: (props: { query: string; editorState: EditorState }) => Promise<Array<TypeAheadItem>>;

	/** Handler returns a transaction which inserts the TypeAheadItem into the doc */
	selectItem: TypeAheadSelectItem;

	/** Handler executes logic when TypeAhead is dismissed */
	dismiss?: (props: {
		editorState: EditorState;
		query: string;
		stats: TypeAheadStats;
		wasItemInserted?: boolean;
	}) => void;

	getHighlight?: (state: EditorState) => JSX.Element | null;
};
