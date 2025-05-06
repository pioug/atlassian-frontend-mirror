import {
	bindKeymapWithCommand,
	findKeyMapForBrowser,
	isCapsLockOnAndModifyKeyboardEvent,
	redo,
	redoAlt,
	undo,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { UndoRedoPlugin } from '../undoRedoPluginType';

import {
	redoFromKeyboard,
	redoFromKeyboardWithAnalytics,
	undoFromKeyboard,
	undoFromKeyboardWithAnalytics,
} from './commands';

export function keymapPlugin(api?: ExtractInjectionAPI<UndoRedoPlugin>): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findKeyMapForBrowser(redo)!,
		fg('platform_editor_controls_patch_analytics')
			? redoFromKeyboardWithAnalytics(api?.analytics?.actions)
			: redoFromKeyboard,
		list,
	);

	if (fg('platform_editor_cmd_y_mac_redo_shortcut')) {
		bindKeymapWithCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findKeyMapForBrowser(redoAlt)!,
			fg('platform_editor_controls_patch_analytics')
				? redoFromKeyboardWithAnalytics(api?.analytics?.actions)
				: redoFromKeyboard,
			list,
		);
	}

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		undo.common!,
		fg('platform_editor_controls_patch_analytics')
			? undoFromKeyboardWithAnalytics(api?.analytics?.actions)
			: undoFromKeyboard,
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
