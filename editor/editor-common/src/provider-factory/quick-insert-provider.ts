import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { INPUT_METHOD } from '../analytics/types/enums';
import type { ExtensionApp } from '../extensions/types/extension-manifest';
import type { TypeAheadItem } from '../types/type-ahead';

export type QuickInsertActionInsert = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node?: Node | Record<string, any> | string,
	opts?: { selectInlineNode?: boolean },
) => Transaction;

export type QuickInsertItemId =
	| 'hyperlink'
	| 'table'
	| 'helpdialog'
	| 'date'
	| 'media'
	| 'media-insert'
	| 'blockquote'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'codeblock'
	| 'unorderedList'
	| 'feedbackdialog'
	| 'orderedList'
	| 'rule'
	| 'status'
	| 'mention'
	| 'emoji'
	| 'action'
	| 'decision'
	| 'infopanel'
	| 'notepanel'
	| 'successpanel'
	| 'warningpanel'
	| 'errorpanel'
	| 'custompanel'
	| 'layout'
	| 'expand'
	| 'placeholderText'
	| 'datasource'
	| 'loom'
	| 'onecolumnlayout'
	| 'twocolumnslayout'
	| 'threecolumnslayout'
	| 'fourcolumnslayout'
	| 'fivecolumnslayout'
	| 'syncBlock'
	| 'aiSpeechToText'
	| 'aiImageGeneration';

export type QuickInsertItem = TypeAheadItem & {
	/**
	 * What to do on insert
	 *
	 * @note This logic is only called if the item is accessed without a search
	 * If a search occurs -- then a separate insert action is called
	 * @see packages/editor/editor-core/src/plugins/insert-block/ui/ToolbarInsertBlock/index.tsx for details
	 */
	action: (
		insert: QuickInsertActionInsert,
		state: EditorState,
		source?:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.ELEMENT_BROWSER,
	) => Transaction | false;
	/** App contributing this item. */
	app?: ExtensionApp;
	/** categories where to find the item */
	categories?: Array<string>;
	/**
	 * The Quick Insert category for this item. Takes precedence over the
	 * legacy `categories` field while both are supported.
	 */
	category?: string;
	/** indicates if the item will be highlighted where appropriate (plus menu for now) */
	featured?: boolean;
	/** optional identifier */
	id?: QuickInsertItemId;
	/** Returns true when the item should not be shown in Quick Insert results. */
	isHidden?: () => boolean;
	/** other names used to find the item */
	keywords?: Array<string>;
};

export type QuickInsertProvider = {
	/** Registered leaf items for the Quick Insert browse menu. */
	getComponents?: () => Promise<Array<RegisterMenuItem>>;
	getItems: () => Promise<Array<QuickInsertItem>>;
};
