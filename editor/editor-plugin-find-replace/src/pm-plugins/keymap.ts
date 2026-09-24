import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, find as findKeymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import type { EditorViewModeAPI } from './commands-with-analytics';
import { activateWithAnalytics } from './commands-with-analytics';

const activateFindReplace =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
		editorViewModeAPI: EditorViewModeAPI,
	): Command =>
	(state, dispatch) => {
		activateWithAnalytics(
			editorAnalyticsAPI,
			editorViewModeAPI,
		)({
			triggerMethod: TRIGGER_METHOD.SHORTCUT,
		})(state, dispatch);
		return true;
	};

const keymapPlugin = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	editorViewModeAPI: EditorViewModeAPI,
) => {
	const list = {};
	if (findKeymap.common) {
		bindKeymapWithCommand(
			findKeymap.common,
			activateFindReplace(editorAnalyticsAPI, editorViewModeAPI),
			list,
		);
	}
	return keymap(list) as SafePlugin;
};

export default keymapPlugin;
