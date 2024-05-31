import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	backspace,
	bindKeymapWithCommand,
	findShortcutByKeymap,
	indent,
	outdent,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isTextSelection } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { getIndentCommand, getOutdentCommand } from '../commands';

export function keymapPlugin(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
	const list = {};

	bindKeymapWithCommand(
		findShortcutByKeymap(indent)!,
		getIndentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
		list,
	);

	bindKeymapWithCommand(
		findShortcutByKeymap(outdent)!,
		getOutdentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
		list,
	);

	bindKeymapWithCommand(
		findShortcutByKeymap(backspace)!,
		(state, dispatch) => {
			const { selection } = state;
			if (isTextSelection(selection) && selection.$cursor && selection.$cursor.parentOffset === 0) {
				return dispatch
					? getOutdentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD)(state, dispatch)
					: false;
			}
			return false;
		},
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
