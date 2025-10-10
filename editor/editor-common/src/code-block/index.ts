import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const defaultWordWrapState = false;

export const codeBlockWrappedStates: WeakMap<PmNode, boolean | undefined> = new WeakMap();

// Code folding state management - similar to word wrapping
export interface FoldRange {
	from: number;
	to: number;
}

const codeBlockFoldStates: WeakMap<PmNode, FoldRange[] | undefined> = new WeakMap();

export const isCodeBlockWordWrapEnabled = (codeBlockNode: PmNode): boolean => {
	const currentNodeWordWrapState = codeBlockWrappedStates.get(codeBlockNode);

	return currentNodeWordWrapState !== undefined ? currentNodeWordWrapState : defaultWordWrapState;
};

export const getCodeBlockFoldState = (codeBlockNode: PmNode): FoldRange[] => {
	const currentNodeFoldState = codeBlockFoldStates.get(codeBlockNode);

	return currentNodeFoldState || [];
};

export const setCodeBlockFoldState = (codeBlockNode: PmNode, foldRanges: FoldRange[]): void => {
	codeBlockFoldStates.set(codeBlockNode, foldRanges);
};

/**
 * Swap the old node key with the new node key in the wrapped states WeakMap.
 */
export const transferCodeBlockWrappedValue = (
	oldCodeBlockNode: PmNode,
	newCodeBlockNode: PmNode,
): void => {
	if (expValEquals('platform_editor_code_block_fold_gutter', 'isEnabled', true)) {
		transferCodeBlockFoldValue(oldCodeBlockNode, newCodeBlockNode);
	}

	// Don't overwrite the value for the new node if it already exists.
	// This can happen when a drag&drop is swapping nodes.
	if (codeBlockWrappedStates.has(newCodeBlockNode)) {
		return;
	}

	const previousValue = isCodeBlockWordWrapEnabled(oldCodeBlockNode);

	codeBlockWrappedStates.set(newCodeBlockNode, previousValue);

	codeBlockWrappedStates.delete(oldCodeBlockNode);
};

/**
 * Swap the old node key with the new node key in the fold states WeakMap.
 */
const transferCodeBlockFoldValue = (oldCodeBlockNode: PmNode, newCodeBlockNode: PmNode): void => {
	// Don't overwrite the value for the new node if it already exists.
	// This can happen when a drag&drop is swapping nodes.
	if (codeBlockFoldStates.has(newCodeBlockNode)) {
		return;
	}

	const previousValue = getCodeBlockFoldState(oldCodeBlockNode);

	codeBlockFoldStates.set(newCodeBlockNode, previousValue);

	codeBlockFoldStates.delete(oldCodeBlockNode);
};

/**
 * As the code block node is used as the wrapped state key, there is instances where the node will be destroyed & recreated and is no longer a valid key.
 * In these instances, we must get the value from that old node and set it to the value of the new node.
 * This function takes all the given nodes, finds their old nodes from the old state and updates these old node keys.
 */
export const updateCodeBlockWrappedStateNodeKeys = (
	newCodeBlockNodes: NodeWithPos[],
	oldState: EditorState,
): void => {
	newCodeBlockNodes.forEach((newCodeBlockNode) => {
		if (expValEquals('platform_editor_code_block_fold_gutter', 'isEnabled', true)) {
			updateCodeBlockFoldStateNodeKeys(newCodeBlockNode, oldState);
		}
		// Don't overwrite the value for the new node if it already exists.
		// This can happen when a drag&drop is swapping nodes.
		if (codeBlockWrappedStates.has(newCodeBlockNode.node)) {
			return;
		}

		// Do not go out of range on the oldState doc. Happens on initial load.
		if (oldState.doc.content.size <= newCodeBlockNode.pos) {
			return;
		}

		const oldCodeBlockNode = oldState.doc.nodeAt(newCodeBlockNode.pos);
		if (!oldCodeBlockNode || oldCodeBlockNode.type !== oldState.schema.nodes.codeBlock) {
			return;
		}
		const previousValue = isCodeBlockWordWrapEnabled(oldCodeBlockNode);
		codeBlockWrappedStates.set(newCodeBlockNode.node, previousValue);
	});
};

/**
 * As the code block node is used as the fold state key, there is instances where the node will be destroyed & recreated and is no longer a valid key.
 * In these instances, we must get the value from that old node and set it to the value of the new node.
 * This function takes all the given nodes, finds their old nodes from the old state and updates these old node keys.
 */
const updateCodeBlockFoldStateNodeKeys = (
	newCodeBlockNode: NodeWithPos,
	oldState: EditorState,
): void => {
	// Don't overwrite the value for the new node if it already exists.
	// This can happen when a drag&drop is swapping nodes.
	if (codeBlockFoldStates.has(newCodeBlockNode.node)) {
		return;
	}

	// Do not go out of range on the oldState doc. Happens on initial load.
	if (oldState.doc.content.size <= newCodeBlockNode.pos) {
		return;
	}

	const oldCodeBlockNode = oldState.doc.nodeAt(newCodeBlockNode.pos);
	if (!oldCodeBlockNode || oldCodeBlockNode.type !== oldState.schema.nodes.codeBlock) {
		return;
	}
	const previousValue = getCodeBlockFoldState(oldCodeBlockNode);
	codeBlockFoldStates.set(newCodeBlockNode.node, previousValue);
};
