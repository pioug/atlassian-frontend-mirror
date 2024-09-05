import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	Command,
	NextEditorPlugin,
	OptionalPlugin,
	TypeAheadForceSelect,
	TypeAheadHandler,
	TypeAheadInsert,
	TypeAheadItem,
	TypeAheadItemRenderProps,
	TypeAheadSelectItem,
	TypeAheadStats,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { CloseSelectionOptions } from './constants';

export type {
	TypeAheadStats,
	TypeAheadItemRenderProps,
	TypeAheadInsert,
	TypeAheadSelectItem,
	TypeAheadItem,
	TypeAheadForceSelect,
	TypeAheadHandler,
};

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
	triggerHandler?: TypeAheadHandler;
	selectedIndex: number;
	stats: TypeAheadStatsSerializable | null;
	inputMethod: TypeAheadInputMethod | null;
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

type OpenTypeAheadProps = {
	triggerHandler: TypeAheadHandler;
	inputMethod: TypeAheadInputMethod;
	query?: string;
};
type InsertTypeAheadItemProps = {
	triggerHandler: TypeAheadHandler;
	contentItem: TypeAheadItem;
	query: string;
	sourceListItem: TypeAheadItem[];
	mode?: SelectItemMode;
};

type CloseTypeAheadProps = {
	insertCurrentQueryAsRawText: boolean;
	attachCommand?: Command;
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
	selectedIndex: number;
}

/**
 * Type ahead plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type TypeAheadPlugin = NextEditorPlugin<
	'typeAhead',
	{
		pluginConfiguration: TypeAheadPluginOptions | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<FeatureFlagsPlugin>];
		sharedState: TypeAheadPluginSharedState;
		actions: {
			isOpen: (editorState: EditorState) => boolean;
			isAllowed: (editorState: EditorState) => boolean;
			insert: (props: InsertTypeAheadItemProps) => boolean;
			findHandlerByTrigger: (trigger: string) => TypeAheadHandler | null;
			open: (props: OpenTypeAheadProps) => boolean;
			close: (props: CloseTypeAheadProps) => boolean;
			openAtTransaction: (props: OpenTypeAheadProps) => (tr: Transaction) => boolean;
		};
	}
>;
