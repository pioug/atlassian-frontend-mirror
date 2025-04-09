import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, Step } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet, Decoration, DecorationSource } from '@atlaskit/editor-prosemirror/view';

export const firstNodeDecPluginKey = new PluginKey<DecorationSet>('firstNodeDec');

const createFirstNodeDecSet = (state: EditorState): DecorationSet => {
	const firstNode = state.doc.firstChild;
	if (!firstNode) {
		return DecorationSet.empty;
	}

	return DecorationSet.create(state.doc, [
		Decoration.node(0, firstNode.nodeSize, {
			style: 'margin-top: 0',
		}),
	]);
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
