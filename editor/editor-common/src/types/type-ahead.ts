import type { ReactElement, ReactNode } from 'react';

import type { IntlShape } from 'react-intl-next';

import { type Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
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
	render?: (props: TypeAheadItemRenderProps) => React.ReactElement<TypeAheadItemRenderProps> | null;
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

	getHighlight?: (state: EditorState) => JSX.Element | null;

	/** Handler returns an array of TypeAheadItem based on query to be displayed in the TypeAhead */
	getItems: (props: { editorState: EditorState; query: string }) => Promise<Array<TypeAheadItem>>;

	getMoreOptionsButtonConfig?: (intl: IntlShape) => MoreOptionsButtonConfig;

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
