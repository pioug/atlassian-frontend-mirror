import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	getNodeAnchor,
	getNodeTypeWithLevel,
	NESTED_DEPTH,
	TYPE_NODE_DEC,
} from './decorations-common';

const IGNORE_NODES = [
	'tableCell',
	'tableHeader',
	'tableRow',
	'listItem',
	'caption',
	'layoutColumn',
];

export const IGNORE_NODES_NEXT: string[] = [
	'tableCell',
	'tableHeader',
	'tableRow',
	'listItem',
	'caption',
];

const IGNORE_NODE_DESCENDANTS = ['listItem', 'taskList', 'decisionList', 'mediaSingle'];
export const IGNORE_NODE_DESCENDANTS_ADVANCED_LAYOUT: string[] = [
	'listItem',
	'taskList',
	'decisionList',
];

export const shouldDescendIntoNode = (node: PMNode): boolean => {
	// Optimisation to avoid drawing node decorations for empty table cells
	if (['tableCell', 'tableHeader'].includes(node.type.name)) {
		if (
			node.childCount === 1 &&
			node.firstChild?.type.name === 'paragraph' &&
			node.firstChild.childCount === 0
		) {
			return false;
		}
	}

	if (editorExperiment('advanced_layouts', true)) {
		return !IGNORE_NODE_DESCENDANTS_ADVANCED_LAYOUT.includes(node.type.name);
	}

	return !IGNORE_NODE_DESCENDANTS.includes(node.type.name);
};

const shouldIgnoreNode = (
	node: PMNode,
	ignore_nodes: string[],
	depth: number,
	parent?: PMNode | null,
) => {
	const nodeTypes = node.type.schema.nodes;

	const isTable = node.type.name === nodeTypes?.table?.name;

	const parentIsTable =
		parent && [nodeTypes.tableHeader, nodeTypes.tableCell].includes(parent.type);

	const isNestedTable = isTable && parentIsTable;

	if (isNestedTable) {
		return true;
	}

	const isFirstTableRow =
		parent?.type.name === 'table' &&
		depth === 1 &&
		node === parent.firstChild &&
		'tableRow' === node.type.name &&
		editorExperiment('advanced_layouts', true);

	if (isFirstTableRow) {
		return false;
	}

	const isLegacyContentMacroExtension =
		node.type.name === 'extension' &&
		node.attrs?.extensionType === 'com.atlassian.confluence.migration' &&
		node.attrs?.extensionKey === 'legacy-content';
	if (isLegacyContentMacroExtension) {
		return true;
	}

	return ignore_nodes.includes(node.type.name);
};

/**
 * Find node decorations corresponding to nodes with starting position between from and to (non-inclusive)
 * @param from Position to start search from (inclusive)
 * @param to Position to end search at (non-inclusive)
 * @returns
 */
export const findNodeDecs = (
	state: EditorState,
	decorations: DecorationSet,
	from?: number,
	to?: number,
): Decoration[] => {
	let newFrom = from;

	let newTo = to;

	// make it non-inclusive
	if (newFrom !== undefined) {
		newFrom++;
	}

	// make it non-inclusive
	if (newTo !== undefined) {
		newTo--;
	}

	// return empty array if range reversed
	if (newFrom !== undefined && newTo !== undefined && newFrom > newTo) {
		return [];
	}

	return decorations.find(newFrom, newTo, (spec) => spec.type === TYPE_NODE_DEC);
};

export const nodeDecorations = (
	newState: EditorState,
	from?: number,
	to?: number,
): Decoration[] => {
	const decs: Decoration[] = [];

	if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		return [];
	}

	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > newState.doc.nodeSize - 2 ? newState.doc.nodeSize - 2 : to;

	const ignore_nodes = editorExperiment('advanced_layouts', true)
		? IGNORE_NODES_NEXT
		: IGNORE_NODES;
	newState.doc.nodesBetween(docFrom, docTo, (node, pos, parent, _) => {
		let depth = 0;
		const shouldDescend = shouldDescendIntoNode(node);
		const anchorName = getNodeAnchor(node);
		const nodeTypeWithLevel = getNodeTypeWithLevel(node);

		// Doesn't descend into a node
		if (node.isInline) {
			return false;
		}
		depth = newState.doc.resolve(pos).depth;

		if (shouldIgnoreNode(node, ignore_nodes, depth, parent)) {
			return shouldDescend; //skip over, don't consider it a valid depth
		}

		const anchorStyles = `anchor-name: ${anchorName};`;

		decs.push(
			Decoration.node(
				pos,
				pos + node.nodeSize,
				{
					style: anchorStyles,
					['data-drag-handler-anchor-name']: anchorName,
					['data-drag-handler-node-type']: nodeTypeWithLevel,
					['data-drag-handler-anchor-depth']: `${depth}`,
				},
				{
					type: TYPE_NODE_DEC,
					anchorName,
					nodeType: node.type.name,
					nodeTypeWithLevel,
				},
			),
		);

		return shouldDescend && depth < NESTED_DEPTH;
	});
	return decs;
};
