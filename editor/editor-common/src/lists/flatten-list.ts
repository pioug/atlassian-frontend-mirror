import type { Attrs, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export interface FlattenedItem {
	depth: number;
	isSelected: boolean;
	listType: string;
	node: PMNode;
	parentListAttrs: Attrs | null;
	pos: number;
}

export interface FlattenListOptions {
	doc: PMNode;
	indentDelta: number;
	maxDepth?: number;
	rootListStart: number;
	rootListEnd: number;
	selectionFrom: number;
	selectionTo: number;
}

/**
 * Type-specific predicates that vary between regular lists and task lists.
 */
interface FlattenListPredicates {
	/** Returns true if `node` is a content-bearing item to include in the flattened output. */
	isContentNode: (node: PMNode, parent: PMNode | null) => boolean;

	/** Returns the selection bounds for an item, used to check selection intersection. */
	getSelectionBounds: (node: PMNode, pos: number) => { start: number; end: number };

	/** Computes the nesting depth for a node given its resolved depth and the root's depth. */
	getDepth: (resolvedDepth: number, rootDepth: number) => number;
}

export interface FlattenListResult {
	items: FlattenedItem[];
	startIndex: number;
	endIndex: number;
}

/**
 * Flattens a list-like PM structure (regular list or task list) into an
 * array of content-bearing items with computed depths.
 *
 * Uses `doc.nodesBetween` to walk the tree and delegates type-specific
 * decisions to the provided predicates. The core algorithm — selection
 * intersection, depth adjustment, index tracking — is shared.
 */
export function flattenList(
	options: FlattenListOptions,
	predicates: FlattenListPredicates,
): FlattenListResult | null {
	const { doc, rootListStart, rootListEnd, selectionFrom, selectionTo, indentDelta, maxDepth } =
		options;
	const { isContentNode, getSelectionBounds, getDepth } = predicates;

	const items: FlattenedItem[] = [];
	let startIndex = -1;
	let endIndex = -1;
	let exceedsMaxDepth = false;

	const rootDepth = doc.resolve(rootListStart).depth;

	doc.nodesBetween(rootListStart, rootListEnd, (node, pos, parent) => {
		if (!isContentNode(node, parent) || parent == null) {
			return true;
		}

		const { start, end } = getSelectionBounds(node, pos);

		const isSelected =
			selectionFrom === selectionTo
				? selectionFrom >= start && selectionFrom <= end
				: start < selectionTo && end > selectionFrom;

		const resolvedDepth = doc.resolve(pos).depth;
		const depth = getDepth(resolvedDepth, rootDepth) + (isSelected ? indentDelta : 0);

		items.push({
			node,
			pos,
			depth,
			isSelected,
			listType: parent.type.name,
			parentListAttrs: parent.attrs,
		});

		if (isSelected) {
			const index = items.length - 1;
			if (startIndex === -1) {
				startIndex = index;
			}
			endIndex = index;
			if (maxDepth != null && depth >= maxDepth) {
				exceedsMaxDepth = true;
			}
		}

		return true;
	});

	if (items.length === 0 || startIndex === -1 || exceedsMaxDepth) {
		return null;
	}

	return { items, startIndex, endIndex };
}
