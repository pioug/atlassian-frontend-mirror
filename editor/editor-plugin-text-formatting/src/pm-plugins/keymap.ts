import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithEditorCommand,
	isCapsLockOnAndModifyKeyboardEvent,
	toggleBold,
	toggleCode,
	toggleItalic,
	toggleStrikethrough,
	toggleSubscript,
	toggleSuperscript,
	toggleUnderline,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import {
	toggleCodeWithAnalytics,
	toggleEmWithAnalytics,
	toggleStrikeWithAnalytics,
	toggleStrongWithAnalytics,
	toggleSubscriptWithAnalytics,
	toggleSuperscriptWithAnalytics,
	toggleUnderlineWithAnalytics,
} from '../commands';

export default function keymapPlugin(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
	const list = {};

	if (schema.marks.strong) {
		bindKeymapWithEditorCommand(
			toggleBold.common!,
			toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.em) {
		bindKeymapWithEditorCommand(
			toggleItalic.common!,
			toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.code) {
		bindKeymapWithEditorCommand(
			toggleCode.common!,
			toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.strike) {
		bindKeymapWithEditorCommand(
			toggleStrikethrough.common!,
			toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			toggleSubscript.common!,
			toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			toggleSuperscript.common!,
			toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.underline) {
		bindKeymapWithEditorCommand(
			toggleUnderline.common!,
			toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	return new SafePlugin({
		props: {
			handleKeyDown(view, event) {
				let keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
				return keydownHandler(list)(view, keyboardEvent);
			},
		},
	});
}
