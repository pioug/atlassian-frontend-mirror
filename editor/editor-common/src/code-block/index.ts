import type { CodeBlockAttrs } from '@atlaskit/adf-schema';
import type { Node as PmNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { mapSlice } from '../utils/slice';

export const defaultWordWrapState = false;

// Remove the wrap WeakMap fallback when cleaning up platform_editor_code_block_q4_lovability
export const codeBlockWrappedStates: WeakMap<PmNode, boolean | undefined> = new WeakMap();

type OptionalCodeBlockAttrs = CodeBlockAttrs | undefined;

export const getDefaultCodeBlockAttrs = (attrs?: CodeBlockAttrs): OptionalCodeBlockAttrs => {
	if (!expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)) {
		return attrs;
	}

	// Only boolean wrap values represent caller intent. null/undefined means unset.
	if (attrs?.wrap === true || attrs?.wrap === false) {
		return attrs;
	}

	return {
		...attrs,
		wrap: true,
	};
};

export const defaultWrapForMarkdownCodeBlocksInSlice = (slice: Slice, schema: Schema): Slice => {
	if (!expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)) {
		return slice;
	}

	return mapSlice(slice, (node) => {
		if (node.type !== schema.nodes.codeBlock || node.attrs.wrap === true) {
			return node;
		}

		// Markdown conversion uses MarkdownParser token mappings and creates code block nodes
		// with the schema-default wrap:false. Since Markdown has no wrap syntax, treat that
		// default as missing user intent and change it to wrap:true.
		return node.type.create({ ...node.attrs, wrap: true }, node.content, node.marks);
	});
};

// Code folding state management - similar to word wrapping
export interface FoldRange {
	from: number;
	to: number;
}

const codeBlockFoldStates: WeakMap<PmNode, FoldRange[] | undefined> = new WeakMap();

export const isCodeBlockWordWrapEnabled = (codeBlockNode: PmNode): boolean => {
	if (expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)) {
		return Boolean(codeBlockNode.attrs.wrap);
	}

	const currentNodeWordWrapState = codeBlockWrappedStates.get(codeBlockNode);

	return currentNodeWordWrapState !== undefined ? currentNodeWordWrapState : defaultWordWrapState;
};

export const areCodeBlockLineNumbersHidden = (codeBlockNode: PmNode): boolean => {
	if (!expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)) {
		return false;
	}

	return Boolean(codeBlockNode.attrs.hideLineNumbers);
};

export const areCodeBlockLineNumbersVisible = (codeBlockNode: PmNode): boolean =>
	!areCodeBlockLineNumbersHidden(codeBlockNode);

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
