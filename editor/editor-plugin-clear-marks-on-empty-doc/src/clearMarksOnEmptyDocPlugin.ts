import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type ClearMarksOnEmptyDocPlugin } from './clearMarksOnEmptyDocPluginType';

const pluginKey = new PluginKey('clearMarksOnChangeToEmptyDocumentPlugin');

function createPlugin(): SafePlugin {
	return new SafePlugin({
		key: pluginKey,
		appendTransaction: (
			_transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) => {
			// ED-2973: When a user clears the editor's content, remove the current active marks
			if (!isEmptyDocument(oldState.doc) && isEmptyDocument(newState.doc)) {
				return newState.tr.setStoredMarks([]);
			}
			return;
		},
	});
}

export const clearMarksOnEmptyDocPlugin: ClearMarksOnEmptyDocPlugin = () => ({
	name: 'clearMarksOnEmptyDoc',

	pmPlugins() {
		return [{ name: 'clearMarksOnChange', plugin: createPlugin }];
	},
});
