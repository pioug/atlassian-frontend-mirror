import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getNestedDepth, getNodeAnchor, TYPE_NODE_DEC } from './decorations-common';

const IGNORE_NODES = [
	'tableCell',
	'tableHeader',
	'tableRow',
	'listItem',
	'caption',
	'layoutColumn',
];

const IGNORE_NODES_NEXT = ['tableCell', 'tableHeader', 'tableRow', 'listItem', 'caption'];

const IGNORE_NODE_DESCENDANTS = ['listItem', 'taskList', 'decisionList', 'mediaSingle'];
const IGNORE_NODE_DESCENDANTS_ADVANCED_LAYOUT = ['listItem', 'taskList', 'decisionList'];

export const shouldDescendIntoNode = (node: PMNode) => {
	// Optimisation to avoid drawing node decorations for empty table cells
	if (['tableCell', 'tableHeader'].includes(node.type.name)) {
		if (
			node.childCount === 1 &&
			node.firstChild?.type.name === 'paragraph' &&
			(fg('platform_editor_element_dnd_nested_fix_patch_6')
				? node.firstChild.childCount === 0
				: true)
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
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const isEmbedCard = node.type.name === 'embedCard';

	const isMediaSingle = node.type.name === 'mediaSingle';

	const isFirstTableRow =
		parent?.type.name === 'table' &&
		depth === 1 &&
		node === parent.firstChild &&
		'tableRow' === node.type.name &&
		editorExperiment('advanced_layouts', true);

	if (isFirstTableRow) {
		return false;
	}

	return (isEmbedCard || isMediaSingle) && ['wrap-right', 'wrap-left'].includes(node.attrs.layout)
		? true
		: ignore_nodes.includes(node.type.name);
};

/**
 * Find node decorations in the pos range between from and to (non-inclusive)
 * @param decorations
 * @param from
 * @param to
 * @returns
 */
export const findNodeDecs = (decorations: DecorationSet, from?: number, to?: number) => {
	let newfrom = from;
	let newTo = to;

	// make it non-inclusive
	if (newfrom !== undefined) {
		newfrom++;
	}

	// make it non-inclusive
	if (newTo !== undefined) {
		newTo--;
	}

	// return empty array if range reversed
	if (newfrom !== undefined && newTo !== undefined && newfrom > newTo) {
		return [];
	}

	return decorations.find(newfrom, newTo, (spec) => spec.type === TYPE_NODE_DEC);
};

export const nodeDecorations = (newState: EditorState, from?: number, to?: number) => {
	const decs: Decoration[] = [];
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > newState.doc.nodeSize - 2 ? newState.doc.nodeSize - 2 : to;

	const ignore_nodes = editorExperiment('advanced_layouts', true)
		? IGNORE_NODES_NEXT
		: IGNORE_NODES;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
	newState.doc.nodesBetween(docFrom, docTo, (node, pos, parent, index) => {
		let depth = 0;
		let anchorName;
		const shouldDescend = shouldDescendIntoNode(node);
		anchorName = getNodeAnchor(node);

		if (editorExperiment('nested-dnd', true)) {
			// Doesn't descend into a node
			if (node.isInline) {
				return false;
			}
			depth = newState.doc.resolve(pos).depth;

			if (shouldIgnoreNode(node, ignore_nodes, depth, parent)) {
				return shouldDescend; //skip over, don't consider it a valid depth
			}

			anchorName = anchorName ?? `--node-anchor-${node.type.name}-${pos}`;
		} else {
			anchorName = anchorName ?? `--node-anchor-${node.type.name}-${index}`;
		}

		const anchorStyles = `anchor-name: ${anchorName};`;

		const subType = node.attrs.level ? `-${node.attrs.level}` : '';

		decs.push(
			Decoration.node(
				pos,
				pos + node.nodeSize,
				{
					style: anchorStyles,
					['data-drag-handler-anchor-name']: anchorName,
					['data-drag-handler-node-type']: node.type.name + subType,
					['data-drag-handler-anchor-depth']: `${depth}`,
				},
				{
					type: TYPE_NODE_DEC,
					anchorName,
					nodeType: node.type.name,
				},
			),
		);

		return shouldDescend && depth < getNestedDepth();
	});
	return decs;
};
