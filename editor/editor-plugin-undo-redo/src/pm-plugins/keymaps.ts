import {
	bindKeymapWithCommand,
	findKeyMapForBrowser,
	isCapsLockOnAndModifyKeyboardEvent,
	redo,
	redoAlt,
	undo,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { redoFromKeyboard, undoFromKeyboard } from './commands';

export function keymapPlugin(): SafePlugin {
	const list = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(findKeyMapForBrowser(redo)!, redoFromKeyboard, list);

	if (fg('platform_editor_cmd_y_mac_redo_shortcut')) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		bindKeymapWithCommand(findKeyMapForBrowser(redoAlt)!, redoFromKeyboard, list);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(undo.common!, undoFromKeyboard, list);

	return new SafePlugin({
		props: {
			handleKeyDown(view: EditorView, event: KeyboardEvent) {
				const keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
				return keydownHandler(list)(view, keyboardEvent);
			},
		},
	});
}
