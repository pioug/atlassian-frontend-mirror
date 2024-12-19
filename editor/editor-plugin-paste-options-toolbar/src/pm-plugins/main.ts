import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { checkAndHideToolbar } from '../editor-commands/commands';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from '../types/types';

import { PASTE_HIGHLIGHT_DECORATION_KEY, TEXT_HIGHLIGHT_CLASS } from './constants';
import { createPluginState } from './plugin-factory';

export function createPlugin(dispatch: Dispatch) {
	return new SafePlugin({
		key: pasteOptionsPluginKey,
		state: createPluginState(dispatch, {
			showToolbar: false,
			pasteStartPos: 0,
			pasteEndPos: 0,
			plaintext: '',
			isPlainText: false,
			highlightContent: false,
			highlightDecorationSet: DecorationSet.empty,
			richTextSlice: Slice.empty,
			selectedOption: ToolbarDropdownOption.None,
		}),

		view(editorView: EditorView) {
			return {
				update(view: EditorView, prevState: EditorState) {
					return prevState;
				},
			};
		},
		props: {
			handleDOMEvents: {
				// Hide toolbar when clicked outside the editor
				blur: checkAndHideToolbar,
				// Hide toolbar when clicked anywhere within the editor, tr.getMeta('pointer') does not work if clicked on the same line after pasting so relying on mousedown event
				mousedown: checkAndHideToolbar,
			},
			handleKeyDown: (view) => {
				checkAndHideToolbar(view);
				return false;
			},
			decorations: (state: EditorState) => {
				const { highlightContent, pasteStartPos } = pasteOptionsPluginKey.getState(state) || {};
				let decorationSet =
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
