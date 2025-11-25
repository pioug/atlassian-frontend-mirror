import { getSelectedNodeOrNodeParentByNodeType } from '@atlaskit/editor-common/copy-button';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const copySelectionPluginKey = new PluginKey('codeBlockCopySelectionPlugin');

type CodeBlockCopySelectionPluginState = {
	codeBlockNode?: PMNode;
	decorationStartAndEnd?: [start: number, end: number];
};

function getSelectionDecorationStartAndEnd({
	state,
	transaction,
}: {
	state: EditorState;
	transaction: ReadonlyTransaction;
}) {
	const codeBlockNode = getSelectedNodeOrNodeParentByNodeType({
		nodeType: state.schema.nodes.codeBlock,
		selection: transaction.selection,
	});

	if (!codeBlockNode) {
		return { decorationStartAndEnd: undefined, codeBlockNode: undefined };
	}

	const decorationStartAndEnd: CodeBlockCopySelectionPluginState['decorationStartAndEnd'] = [
		codeBlockNode.start,
		codeBlockNode.start + codeBlockNode.node.nodeSize,
	];

	return { decorationStartAndEnd, codeBlockNode: codeBlockNode.node };
}

export function codeBlockCopySelectionPlugin() {
	return new SafePlugin({
		key: copySelectionPluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init(): CodeBlockCopySelectionPluginState {
				return { decorationStartAndEnd: undefined };
			},
			// @ts-ignore - Workaround for help-center local consumption

			// @ts-ignore - Workaround for help-center local consumption
			apply(
				// @ts-ignore - Workaround for help-center local consumption
				transaction,
				currentCodeBlockCopySelectionPluginState: CodeBlockCopySelectionPluginState,
				// @ts-ignore - Workaround for help-center local consumption
				_oldState,
				// @ts-ignore - Workaround for help-center local consumption
				newState,
			): CodeBlockCopySelectionPluginState {
				switch (transaction.getMeta(copySelectionPluginKey)) {
					case 'show-selection': {
						return getSelectionDecorationStartAndEnd({
							state: newState,
							transaction,
						});
					}
					case 'remove-selection':
						return { decorationStartAndEnd: undefined };
					default:
						// The contents of the code block can change while the selection is being shown
						// (either from collab edits -- or from the user continuing to type while hovering
						// the mouse over the copy button).
						// This ensures the selection is updated in these cases.
						if (currentCodeBlockCopySelectionPluginState.decorationStartAndEnd !== undefined) {
							return getSelectionDecorationStartAndEnd({
								state: newState,
								transaction,
							});
						}
						return currentCodeBlockCopySelectionPluginState;
				}
			},
		},
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			decorations(state) {
				if (copySelectionPluginKey.getState(state).decorationStartAndEnd) {
					const [start, end] = copySelectionPluginKey.getState(state).decorationStartAndEnd;

					return DecorationSet.create(state.doc, [
						Decoration.inline(start, end, {
							class: 'ProseMirror-fake-text-selection',
						}),
					]);
				}

				return DecorationSet.empty;
			},
		},
	});
}

export function provideVisualFeedbackForCopyButton(
	state: EditorState,
	dispatch?: (tr: Transaction) => void,
) {
	const tr = state.tr;
	tr.setMeta(copySelectionPluginKey, 'show-selection');

	// note: dispatch should always be defined when called from the
	// floating toolbar. Howver the Command type which the floating toolbar
	// uses suggests it's optional.
	// Using the type here to protect against future refactors of the
	// floating toolbar
	if (dispatch) {
		dispatch(tr);
	}

	return true;
}

export function removeVisualFeedbackForCopyButton(
	state: EditorState,
	dispatch?: (tr: Transaction) => void,
) {
	const tr = state.tr;
	tr.setMeta(copySelectionPluginKey, 'remove-selection');

	// note: dispatch should always be defined when called from the
	// floating toolbar. Howver the Command type which the floating toolbar
	// uses suggests it's optional.
	// Using the type here to protect against future refactors of the
	// floating toolbar
	if (dispatch) {
		dispatch(tr);
	}

	return true;
}
