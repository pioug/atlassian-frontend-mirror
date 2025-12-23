import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { pluginKey } from './plugin-key';

// Workaround for a firefox issue where dom selection is off sync
// https://product-fabric.atlassian.net/browse/ED-12442
const refreshBrowserSelection = (): void => {
	const domSelection = window.getSelection();
	if (domSelection) {
		const domRange =
			domSelection && domSelection.rangeCount === 1 && domSelection.getRangeAt(0).cloneRange();
		if (domRange) {
			domSelection.removeAllRanges();
			domSelection.addRange(domRange);
		}
	}
};

const refreshBrowserSelectionOnChange = (
	transaction: Readonly<Transaction>,
	editorState: EditorState,
): void => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	if (
		browser.gecko &&
		transaction.docChanged &&
		// codeblockState.pos should be set if current selection is in a codeblock.
		typeof pluginKey.getState(editorState)?.pos === 'number'
	) {
		refreshBrowserSelection();
	}
};

export default refreshBrowserSelectionOnChange;
export { refreshBrowserSelection };
