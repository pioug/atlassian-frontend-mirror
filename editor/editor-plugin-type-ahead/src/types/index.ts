import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	TypeAheadHandler,
	TypeAheadItem,
	TypeAheadStats,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

/*
 We currently can't easily move the type-ahead type declarations to this package
 because of circular dependencies with the editor-common package, as well
 as with the element-browser package.
 This was attempted in ED-26054 but was determined to be infeasible for this package.
*/
// eslint-disable-next-line @atlaskit/editor/no-re-export
export type { TypeAheadHandler } from '@atlaskit/editor-common/types';

import type { CloseSelectionOptions } from '../pm-plugins/constants';

export type TypeAheadError = 'FETCH_ERROR';

export type TypeAheadErrorInfo = {
	error: TypeAheadError;
} | null;

export type OnSelectItem = (props: { index: number; item: TypeAheadItem }) => void;

export interface TypeAheadStatsSerializable extends TypeAheadStats {
	serialize: () => TypeAheadStats;
}

export interface TypeAheadStatsModifier extends TypeAheadStatsSerializable {
	increaseArrowUp: () => void;
	increaseArrowDown: () => void;
}

export interface TypeAheadStatsMobileModifier extends TypeAheadStatsSerializable {
	resetTime: () => void;
	closeTime: () => void;
}

export type TypeAheadPluginState = {
	decorationSet: DecorationSet;
	decorationElement: HTMLElement | null;
	typeAheadHandlers: Array<TypeAheadHandler>;
	query: string;
	items: Array<TypeAheadItem>;
	errorInfo: TypeAheadErrorInfo;
	triggerHandler?: TypeAheadHandler;
	selectedIndex: number;
	stats: TypeAheadStatsSerializable | null;
	inputMethod: TypeAheadInputMethod | null;
	/**
	 * If true, removes the trigger character from query when typeahead is closed
	 */
	removePrefixTriggerOnCancel?: boolean;
};

export type OnInsertSelectedItemProps = {
	mode: SelectItemMode;
	index: number;
	query: string;
};

export type OnItemMatchProps = {
	mode: SelectItemMode;
	query: string;
};
export type OnInsertSelectedItem = (props: OnInsertSelectedItemProps) => void;
export type OnItemMatch = (props: OnItemMatchProps) => boolean;

export type OnTextInsertProps = {
	forceFocusOnEditor: boolean;
	setSelectionAt: CloseSelectionOptions;
	text: string;
};
export type OnTextInsert = (props: OnTextInsertProps) => void;

export type InsertionTransactionMeta = (editorState: EditorState) => Transaction | false;

type PopupMountPoints = Pick<
	UiComponentFactoryParams,
	'popupsMountPoint' | 'popupsBoundariesElement' | 'popupsScrollableElement'
>;
export type PopupMountPointReference = Record<'current', PopupMountPoints | null>;

export type CreateTypeAheadDecorations = (
	tr: ReadonlyTransaction,
	options: {
		triggerHandler: TypeAheadHandler;
		inputMethod: TypeAheadInputMethod;
		reopenQuery?: string;
	},
) => {
	decorationSet: DecorationSet;
	decorationElement: HTMLElement | null;
	stats: TypeAheadStatsSerializable | null;
};

export type RemoveTypeAheadDecorations = (decorationSet?: DecorationSet) => boolean;

export type TypeAheadInputMethod =
	| INPUT_METHOD.INSERT_MENU
	| INPUT_METHOD.KEYBOARD
	| INPUT_METHOD.QUICK_INSERT
	| INPUT_METHOD.TOOLBAR
	/**
	 * For Typeahead - Empty line prompt experiment
	 * Clean up ticket ED-24824
	 */
	| 'blockControl';

export type TypeAheadPluginOptions = {
	isMobile?: boolean;
};

export interface TypeAheadPluginSharedState {
	query: string;
	isOpen: boolean;
	isAllowed: boolean;
	currentHandler?: TypeAheadHandler;
	decorationSet: DecorationSet;
	decorationElement: HTMLElement | null;
	triggerHandler?: TypeAheadHandler;
	items: Array<TypeAheadItem>;
	errorInfo: TypeAheadErrorInfo;
	selectedIndex: number;
}

export type OpenTypeAheadProps = {
	triggerHandler: TypeAheadHandler;
	inputMethod: TypeAheadInputMethod;
	query?: string;
	removePrefixTriggerOnCancel?: boolean;
};
