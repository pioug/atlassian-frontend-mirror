import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithEditorCommand,
	findShortcutByKeymap,
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
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	toggleCodeWithAnalytics,
	toggleEmWithAnalytics,
	toggleStrikeWithAnalytics,
	toggleStrongWithAnalytics,
	toggleSubscriptWithAnalytics,
	toggleSuperscriptWithAnalytics,
	toggleUnderlineWithAnalytics,
} from '../editor-commands/toggle-mark';

import { pluginKey } from './plugin-key';

export default function keymapPlugin(
	schema: Schema,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
	const list = {};

	if (schema.marks.strong) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleBold)!,
			toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.em) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleItalic)!,
			toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.code) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleCode)!,
			toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.strike) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleStrikethrough)!,
			toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleSubscript)!,
			toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleSuperscript)!,
			toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.underline) {
		bindKeymapWithEditorCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleUnderline)!,
			toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	const getEnabledKeylist = (view: EditorView) => {
		const textFormattingState = pluginKey.getState(view.state);
		const list = {};

		if (schema.marks.strong && !textFormattingState?.strongDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleBold)!,
				toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.em && !textFormattingState?.emDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleItalic)!,
				toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.code && !textFormattingState?.codeDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleCode)!,
				toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.strike && !textFormattingState?.strikeDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleStrikethrough)!,
				toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.subsup && !textFormattingState?.subscriptDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleSubscript)!,
				toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.subsup && !textFormattingState?.superscriptDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleSuperscript)!,
				toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.underline && !textFormattingState?.underlineDisabled) {
			bindKeymapWithEditorCommand(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(toggleUnderline)!,
				toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}
		return list;
	};

	return new SafePlugin({
		props: {
			handleKeyDown(view, event) {
				const keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);

				const keymapList = editorExperiment('platform_editor_controls', 'variant1')
					? getEnabledKeylist(view)
					: list;
				return keydownHandler(keymapList)(view, keyboardEvent);
			},
		},
	});
}
