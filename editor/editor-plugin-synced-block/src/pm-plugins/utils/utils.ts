import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	TextSelection,
	type EditorState,
	type Selection,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection, findTable } from '@atlaskit/editor-tables';

export const findSyncBlock = (
	state: EditorState,
	selection?: Selection | null,
): ContentNodeWithPos | undefined => {
	const { syncBlock } = state.schema.nodes;
	return findSelectedNodeOfType(syncBlock)(selection || state.selection);
};

export const findBodiedSyncBlock = (
	state: EditorState,
	selection?: Selection | null,
): ContentNodeWithPos | undefined => {
	const { bodiedSyncBlock } = state.schema.nodes;
	return (
		findSelectedNodeOfType(bodiedSyncBlock)(selection || state.selection) ||
		findParentNodeOfType(bodiedSyncBlock)(selection || state.selection)
	);
};

export const findSyncBlockOrBodiedSyncBlock = (
	state: EditorState,
	selection?: Selection | null,
): ContentNodeWithPos | undefined => {
	return findSyncBlock(state, selection) || findBodiedSyncBlock(state, selection);
};

export const isBodiedSyncBlockNode = (node: PMNode, bodiedSyncBlock: NodeType): boolean =>
	node.type === bodiedSyncBlock;

export interface SyncBlockConversionInfo {
	contentToInclude: Fragment;
	from: number;
	to: number;
}

const UNSUPPORTED_NODE_TYPES = new Set([
	'inlineExtension',
	'extension',
	'bodiedExtension',
	'syncBlock',
	'bodiedSyncBlock',
]);

/**
 * Checks whether the selection can be converted to sync block
 *
 * @param selection - the current editor selection to validate for sync block conversion
 * @returns A fragment containing the content to include in the synced block,
 * stripping out unsupported marks (breakout on codeblock/expand/layout), as well as from and to positions,
 * or false if conversion is not possible
 */
export const canBeConvertedToSyncBlock = (
	selection: Selection,
): SyncBlockConversionInfo | false => {
	const schema = selection.$from.doc.type.schema;
	const { nodes } = schema;

	let from = selection.from;
	let to = selection.to;
	let contentToInclude = selection.content().content;

	if (selection instanceof CellSelection) {
		const table = findTable(selection);
		if (!table) {
			return false;
		}

		contentToInclude = Fragment.from([table.node]);
		from = table.pos;
		to = table.pos + table.node.nodeSize;
	} else if (selection instanceof TextSelection) {
		const trueParent = findParentNodeOfType([
			nodes.bulletList,
			nodes.orderedList,
			nodes.taskList,
			nodes.blockquote,
		])(selection);

		if (trueParent) {
			contentToInclude = Fragment.from([trueParent.node]);
			from = trueParent.pos;
			to = trueParent.pos + trueParent.node.nodeSize;
		}
	}

	let canBeConverted = true;
	selection.$from.doc.nodesBetween(from, to, (node) => {
		if (UNSUPPORTED_NODE_TYPES.has(node.type.name)) {
			canBeConverted = false;
			return false;
		}
	});
	if (!canBeConverted) {
		return false;
	}

	contentToInclude = removeBreakoutMarks(contentToInclude);

	return {
		contentToInclude,
		from,
		to,
	};
};

const removeBreakoutMarks = (content: Fragment): Fragment => {
	const nodes: PMNode[] = [];

	// we only need to recurse at the top level, because breakout has to be on a top level
	content.forEach((node) => {
		const filteredMarks = node.marks.filter((mark) => mark.type.name !== 'breakout');
		const newNode = node.type.create(node.attrs, node.content, filteredMarks);
		nodes.push(newNode);
	});

	return Fragment.from(nodes);
};
