import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

// function to check whether the selected node is the sole decision item in the decision list
const isSelectedNodeSoleDecisionItem = (state: EditorState): boolean => {
	const isDecisionItemNodeSelected =
		state.selection instanceof NodeSelection && state.selection.node.type.name === 'decisionItem';

	if (!isDecisionItemNodeSelected) {
		return false;
	}

	const decisionList = findParentNodeOfType([state.schema.nodes.decisionList])(
		state.selection,
	)?.node;

	return decisionList?.childCount === 1;
};

const isSelectedNodeMediaGroup = (state: EditorState): boolean => {
	return Boolean(
		state.selection instanceof NodeSelection &&
		state.selection.node.type.name === 'media' &&
		state.selection.$head.parent.type.name === 'mediaGroup',
	);
};

/**
 * Prevent removing the block when deleting block content
 *
 * @param state EditorState
 * @param dispatch CommandDispatch
 * @returns boolean
 */
export function deleteBlockContent(
	isNodeAWrappingBlockNode: (node?: PMNode | null) => boolean,
): Command {
	return (state, dispatch) => {
		const {
			tr,
			selection: { $from, $to },
			doc,
		} = state;

		if ($from.pos === $to.pos) {
			return false;
		}

		let selectionCrossesWrappingBlockNode = false;

		doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
			// Optimisation. If selection crosses wrapping block node
			// short circuit the loop by returning false
			if (isNodeAWrappingBlockNode(node)) {
				selectionCrossesWrappingBlockNode = true;
				return false;
			}
		});

		if (!selectionCrossesWrappingBlockNode) {
			return false;
		}

		const isParentNodeOfTypePanel = hasParentNodeOfType([state.schema.nodes.panel])(
			state.selection,
		);
		const isParentNodeOfTypeBlockQuote = hasParentNodeOfType([state.schema.nodes.blockquote])(
			state.selection,
		);

		if (
			((isParentNodeOfTypePanel || isParentNodeOfTypeBlockQuote) &&
				isSelectedNodeMediaGroup(state)) ||
			(isParentNodeOfTypePanel && isSelectedNodeSoleDecisionItem(state))
		) {
			tr.setSelection(new TextSelection(tr.doc.resolve($from.before())));
			tr.delete($from.before(), $from.after());
		} else {
			tr.delete($from.pos, $to.pos);
		}

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
}
