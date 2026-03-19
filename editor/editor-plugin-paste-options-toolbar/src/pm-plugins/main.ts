import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { checkAndHideToolbar } from '../editor-commands/commands';
import {
	pasteOptionsPluginKey,
	ToolbarDropdownOption,
	type PasteOptionsPluginState,
} from '../types/types';

import { PASTE_HIGHLIGHT_DECORATION_KEY, TEXT_HIGHLIGHT_CLASS } from './constants';
import { createPluginState } from './plugin-factory';

const MODIFIER_KEYS = new Set([
	'Shift',
	'Control',
	'Alt',
	'Meta', // Cmd on Mac, Win on Windows
	'CapsLock',
	'NumLock',
	'ScrollLock',
	'Fn',
	'FnLock',
]);

function isModifierKey(event: KeyboardEvent): boolean {
	return MODIFIER_KEYS.has(event.key);
}

export function createPlugin(
	dispatch: Dispatch,
	options?: { useNewPasteMenu?: boolean },
): SafePlugin<PasteOptionsPluginState> {
	return new SafePlugin({
		key: pasteOptionsPluginKey,
		state: createPluginState(dispatch, {
			showToolbar: false,
			showLegacyOptions: false,
			pasteAncestorNodeNames: [],
			pasteStartPos: 0,
			pasteEndPos: 0,
			plaintext: '',
			isPlainText: false,
			highlightContent: false,
			highlightDecorationSet: DecorationSet.empty,
			richTextSlice: Slice.empty,
			selectedOption: ToolbarDropdownOption.None,
		}),

		view(_editorView: EditorView) {
			return {
				update(_view: EditorView, prevState: EditorState) {
					return prevState;
				},
			};
		},
		props: {
			handleDOMEvents: {
				blur: (view: EditorView) => {
					if (options?.useNewPasteMenu) {
						return false;
					}
					checkAndHideToolbar(view);
					return false;
				},
				// Hide toolbar when clicked anywhere within the editor, tr.getMeta('pointer') does not work if clicked on the same line after pasting so relying on mousedown event
				mousedown: checkAndHideToolbar,
			},
			handleKeyDown: (view, event) => {
				// Don't hide toolbar when pressing modifier keys alone (Ctrl, Shift, Alt, Meta/Cmd)
				if (isModifierKey(event) && fg('platform_editor_paste_actions_keypress_fix')) {
					return false;
				}
				checkAndHideToolbar(view);
				return false;
			},
			decorations: (state: EditorState) => {
				const { highlightContent, pasteStartPos } = pasteOptionsPluginKey.getState(state) || {};
				const decorationSet =
					pasteOptionsPluginKey.getState(state)?.highlightDecorationSet ?? DecorationSet.empty;

				if (!highlightContent) {
					return decorationSet;
				}

				const { selection } = state.tr;
				const pasteEndPos = selection.$anchor.pos;
				const highlightDecoration = Decoration.inline(
					pasteStartPos,
					pasteEndPos,
					{
						class: TEXT_HIGHLIGHT_CLASS,
					},
					{
						key: PASTE_HIGHLIGHT_DECORATION_KEY,
					},
				);

				return decorationSet.add(state.doc, [highlightDecoration]);
			},
		},
	});
}
