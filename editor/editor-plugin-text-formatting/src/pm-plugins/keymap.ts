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
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleBold)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleBold.common!,
			toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.em) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleItalic)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleItalic.common!,
			toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.code) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleCode)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleCode.common!,
			toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.strike) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleStrikethrough)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleStrikethrough.common!,
			toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleSubscript)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleSubscript.common!,
			toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.subsup) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleSuperscript)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleSuperscript.common!,
			toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	if (schema.marks.underline) {
		bindKeymapWithEditorCommand(
			expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					findShortcutByKeymap(toggleUnderline)!
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					toggleUnderline.common!,
			toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
			list,
		);
	}

	const getEnabledKeylist = (view: EditorView) => {
		const textFormattingState = pluginKey.getState(view.state);
		const list = {};

		if (schema.marks.strong && !textFormattingState?.strongDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleBold)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleBold.common!,
				toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.em && !textFormattingState?.emDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleItalic)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleItalic.common!,
				toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.code && !textFormattingState?.codeDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleCode)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleCode.common!,
				toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.strike && !textFormattingState?.strikeDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleStrikethrough)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleStrikethrough.common!,
				toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.subsup && !textFormattingState?.subscriptDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleSubscript)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleSubscript.common!,
				toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.subsup && !textFormattingState?.superscriptDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleSuperscript)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleSuperscript.common!,
				toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}

		if (schema.marks.underline && !textFormattingState?.underlineDisabled) {
			bindKeymapWithEditorCommand(
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						findShortcutByKeymap(toggleUnderline)!
					: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						toggleUnderline.common!,
				toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
				list,
			);
		}
		return list;
	};

	return new SafePlugin({
		props: {
			// @ts-ignore - Workaround for help-center local consumption

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
