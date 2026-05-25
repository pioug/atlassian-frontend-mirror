import type { Node, Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * Structural container nodes are nodes whose children are determined by
 * document structure (e.g. list items inside a list, rows inside a table)
 * rather than by content choice. Having different child types inside these
 * nodes does NOT indicate mixed content.
 *
 * All other container nodes (blockTaskItem, blockquote, panel,
 * expand, layoutColumn, tableCell, tableHeader, bodiedExtension, etc.) hold
 * rich block content, so mixed block children inside them IS mixing.
 */
const STRUCTURAL_CONTAINERS = new Set([
	'bulletList',
	'orderedList',
	'listItem',
	'taskList',
	'decisionList',
	'table',
	'tableRow',
]);

/**
 * Returns true if a node's direct block-level children include more than one
 * distinct node type — i.e. the children are "mixed".
 */
const hasBlockSiblings = (node: Node): boolean => {
	const types = new Set<string>();
	node.forEach((child) => {
		if (child.isBlock) {
			types.add(child.type.name);
		}
	});
	return types.size > 1;
};

/**
 * Returns true if the slice contains sibling block nodes of different types
 * at the same level anywhere in the document tree.
 *
 * Structural container nodes (bulletList, orderedList, taskList, decisionList,
 * table, tableRow) are excluded from the sibling check because their children
 * are typed by structure, not content. All other container nodes are checked.
 */
export const hasMixedNodes = (slice: Slice | undefined): boolean => {
	if (!slice?.content?.size) {
		return false;
	}

	// Check the top-level children of the slice (Fragment has no parent Node,
	// so we construct a synthetic check by iterating slice.content directly).
	const topLevelTypes = new Set<string>();
	slice.content.forEach((node) => {
		if (node.isBlock) {
			topLevelTypes.add(node.type.name);
		}
	});
	if (topLevelTypes.size > 1) {
		return true;
	}

	// Walk every descendant node and check its direct block children for mixing,
	// skipping structural containers (their children are structural, not content).
	let mixed = false;
	slice.content.descendants((node) => {
		if (mixed) {
			return false; // short-circuit once found
		}
		if (STRUCTURAL_CONTAINERS.has(node.type.name)) {
			return true; // recurse into but don't check children for mixing
		}
		if (hasBlockSiblings(node)) {
			mixed = true;
			return false;
		}
		return true;
	});

	return mixed;
};
