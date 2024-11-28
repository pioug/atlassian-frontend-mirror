import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type BetterTypeHistoryAPI = {
	flagPasteEvent: (transaction: Transaction) => Transaction;
};

export type BetterTypeHistoryPlugin = NextEditorPlugin<
	'betterTypeHistory',
	{
		actions: BetterTypeHistoryAPI;
	}
>;
