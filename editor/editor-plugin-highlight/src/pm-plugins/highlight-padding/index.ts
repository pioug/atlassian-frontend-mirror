import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	type EditorState,
	PluginKey,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import type { StepMap } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { addPaddingDecorations } from './add-padding-decorations';
import { updatePaddingDecorations } from './update-padding-decorations';

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

type HighlightPaddingPluginState = {
	decorationSet: DecorationSet;
};

export const highlightPaddingPluginKey = new PluginKey('highlightPaddingPluginKey');

/**
 * Plugin to add padding decorations around highlighted text.
 *
 * Padding is added to the left and/or right of highlighted text
 * only when it is at the start or end of a block, or when it is adjacent
 * to whitespace.
 */
export const createHighlightPaddingPlugin = () => {
	return new SafePlugin<HighlightPaddingPluginState>({
		key: highlightPaddingPluginKey,
		state: {
			init: (_: EditorStateConfig, state: EditorState) => {
				// Initially scan the entire doc to create all highlight padding decorations
				// after which updates will only apply to changed ranges
				const initialDecorationSet = DecorationSet.empty;
				const decorationSet = addPaddingDecorations({
					decorationSet: initialDecorationSet,
					state,
					from: 0,
					to: state.doc.content.size,
				});
				return { decorationSet };
			},
			apply: (
				tr: ReadonlyTransaction,
				pluginState: HighlightPaddingPluginState,
				_oldState: EditorState,
				state: EditorState,
			) => {
				if (!tr.docChanged) {
					return pluginState;
				}

				let decorationSet = pluginState.decorationSet.map(tr.mapping, tr.doc);
				tr.mapping.maps.forEach((stepMap: StepMap) => {
					stepMap.forEach((_oldStart: number, _oldEnd: number, start: number, end: number) => {
						decorationSet = updatePaddingDecorations({ decorationSet, state, start, end });
					});
				});

				return { decorationSet };
			},
		},
		props: {
			decorations: (state: EditorState) => {
				return highlightPaddingPluginKey.getState(state).decorationSet;
			},
		},
	});
};
