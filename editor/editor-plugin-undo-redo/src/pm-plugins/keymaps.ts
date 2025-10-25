import {
	bindKeymapWithCommand,
	findKeyMapForBrowser,
	isCapsLockOnAndModifyKeyboardEvent,
	redo,
	redoAlt,
	undo,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { UndoRedoPlugin } from '../undoRedoPluginType';

import { redoFromKeyboardWithAnalytics, undoFromKeyboardWithAnalytics } from './commands';

/**
 *
 * @param api
 * @example
 */
export function keymapPlugin(api?: ExtractInjectionAPI<UndoRedoPlugin>): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findKeyMapForBrowser(redo)!,
		redoFromKeyboardWithAnalytics(api?.analytics?.actions),
		list,
	);

	bindKeymapWithCommand(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findKeyMapForBrowser(redoAlt)!,
		redoFromKeyboardWithAnalytics(api?.analytics?.actions),
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		undo.common!,
		undoFromKeyboardWithAnalytics(api?.analytics?.actions),
		list,
	);

	return new SafePlugin({
		props: {
			handleKeyDown(view: EditorView, event: KeyboardEvent) {
				const keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
				return keydownHandler(list)(view, keyboardEvent);
			},
		},
	});
}
