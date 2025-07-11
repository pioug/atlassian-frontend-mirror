import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	type EditorState,
	PluginKey,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';
import {
	DecorationSet,
	Decoration,
	type DecorationSource,
} from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const firstNodeDecPluginKey = new PluginKey<DecorationSet>('firstNodeDec');

const createFirstNodeDecSet = (state: EditorState): DecorationSet => {
	const firstNode = state.doc.firstChild;
	if (!firstNode) {
		return DecorationSet.empty;
	}

	const firstNodeDecoration = expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)
		? Decoration.node(0, firstNode.nodeSize, {
				style: 'margin-top: 0;',
				class: 'first-node-in-document',
			})
		: Decoration.node(0, firstNode.nodeSize, {
				style: 'margin-top: 0',
			});

	return DecorationSet.create(state.doc, [firstNodeDecoration]);
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export const firstNodeDecPlugin = () =>
	new SafePlugin({
		key: firstNodeDecPluginKey,
		state: {
			init(_: EditorStateConfig, state: EditorState) {
				return createFirstNodeDecSet(state);
			},
			apply(
				tr: ReadonlyTransaction,
				currentState: DecorationSet,
				_: EditorState,
				newState: EditorState,
			) {
				const isDocChanged =
					tr.docChanged &&
					tr.steps.some(
						(step: Step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
					);
				// Reapply decorations if there are any steps that modify the document
				if (isDocChanged) {
					return createFirstNodeDecSet(newState);
				}
				return currentState;
			},
		},
		props: {
			decorations(state: EditorState): DecorationSource | null | undefined {
				return firstNodeDecPluginKey.getState(state);
			},
		},
	});
