import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { isPreRelease1, isPreRelease2 } from '../utils/advanced-layouts-flags';

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
	if (
		['tableCell', 'tableHeader'].includes(node.type.name) &&
		!editorExperiment('table-nested-dnd', true) &&
		fg('platform_editor_element_dnd_nested_fix_patch_3')
	) {
		if (node.childCount === 1 && node.firstChild?.type.name === 'paragraph') {
			return false;
		}
	}

	if (isPreRelease1()) {
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
	const isEmbedCard =
		'embedCard' === node.type.name && fg('platform_editor_element_dnd_nested_fix_patch_3');

	// TODO use isWrappedMedia when clean up the feature flag
	const isMediaSingle =
		'mediaSingle' === node.type.name && fg('platform_editor_element_dnd_nested_fix_patch_1');

	const isFirstTableRow =
		parent?.type.name === 'table' &&
		depth === 1 &&
		node === parent.firstChild &&
		'tableRow' === node.type.name &&
		isPreRelease1();

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
		return new Array<Decoration>();
	}

	return decorations.find(newfrom, newTo, (spec) => spec.type === TYPE_NODE_DEC);
};

export const nodeDecorations = (newState: EditorState, from?: number, to?: number) => {
	const decs: Decoration[] = [];
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > newState.doc.nodeSize - 2 ? newState.doc.nodeSize - 2 : to;

	const ignore_nodes = isPreRelease2() ? IGNORE_NODES_NEXT : IGNORE_NODES;
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

		const anchorStyles = ['tableRow', 'media'].includes(node.type.name)
			? `anchor-name: ${anchorName};`
			: `anchor-name: ${anchorName}; ${pos === 0 && !fg('platform_editor_element_dnd_nested_fix_patch_3') ? 'margin-top: 0px;' : ''} ${fg('platform_editor_element_dnd_nested_fix_patch_3') ? '' : 'position: relative; z-index: 1;'}`;

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
