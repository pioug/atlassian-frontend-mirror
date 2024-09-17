import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, openHelp } from '@atlaskit/editor-common/keymaps';
import { type SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { openHelpCommand } from './commands';
import { pluginKey } from './plugin-key';

export const keymapPlugin = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): SafePlugin => {
	const list = {};
	bindKeymapWithCommand(
		openHelp.common!,
		(state, dispatch) => {
			let { tr } = state;
			const isVisible = tr.getMeta(pluginKey);
			if (!isVisible) {
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
					attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
					eventType: EVENT_TYPE.UI,
				})(tr);
				openHelpCommand(tr, dispatch);
			}
			return true;
		},
		list,
	);
	return keymap(list) as SafePlugin;
};
