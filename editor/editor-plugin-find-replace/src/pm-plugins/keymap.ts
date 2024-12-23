import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, find as findKeymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { activateWithAnalytics } from './commands-with-analytics';

const activateFindReplace =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		activateWithAnalytics(editorAnalyticsAPI)({
			triggerMethod: TRIGGER_METHOD.SHORTCUT,
		})(state, dispatch);
		return true;
	};

const keymapPlugin = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
	const list = {};
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(findKeymap.common!, activateFindReplace(editorAnalyticsAPI), list);
	return keymap(list) as SafePlugin;
};

export default keymapPlugin;
