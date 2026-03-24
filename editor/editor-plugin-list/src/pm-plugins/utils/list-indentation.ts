import {
	type BuildResult,
	buildReplacementFragment as buildReplacementFragmentBase,
	type FlattenedItem,
	type FlattenListOptions,
	type FlattenListResult,
	flattenList as flattenListBase,
} from '@atlaskit/editor-common/lists';
import { isListItemNode, isListNode } from '@atlaskit/editor-common/utils';
import type { Attrs, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns true if a listItem has at least one non-list child (paragraph, etc.).
 */
function hasContentChildren(listItem: PMNode): boolean {
	return listItem.children.some((child) => !isListNode(child));
}

/**
 * Compute the size of non-list (content) children of a listItem, which
 * represents the "visible" bounds of the item for selection purposes.
 */
function contentSize(listItem: PMNode): number {
	return listItem.children.reduce((size, child) => {
		return size + (isListNode(child) ? 0 : child.nodeSize);
	}, 0);
}

/**
 * Flatten a root list into a flat array of content-bearing items
 * and simultaneously determine which elements intersect the user's selection.
 *
 * Delegates to the shared `flattenListLike` with list-specific callbacks.
 * Selection intersection is checked against each item's content-only
 * span (excluding nested lists).
 */
export function flattenList(options: FlattenListOptions): FlattenListResult | null {
	return flattenListBase(options, {
		isContentNode: (node, parent) =>
			isListItemNode(node) && hasContentChildren(node) && isListNode(parent),
		// +1 shifts from the listItem node boundary to the start of its content children
		getSelectionBounds: (node, pos) => ({
			start: pos + 1,
			end: pos + 1 + contentSize(node),
		}),
		getDepth: (resolvedDepth, rootDepth) => (resolvedDepth - rootDepth - 1) / 2,
	});
}

/**
 * Extract non-list (content) children from a listItem node.
 */
function extractContentChildren(listItem: PMNode): PMNode[] {
	const children: PMNode[] = [];
	for (let i = 0; i < listItem.childCount; i++) {
		const child = listItem.child(i);
		if (!isListNode(child)) {
			children.push(child);
		}
	}
	return children;
}

/**
 * Rebuild a ProseMirror list tree from a flat array of `FlattenedItem` objects
 * using a bottom-up stack approach.
 *
 * The algorithm tracks open list/listItem wrappers on a stack. As depth
 * transitions occur between consecutive elements, wrapper nodes are opened
 * (depth increase) or closed (depth decrease).
 */
function rebuildPMList(
	elements: FlattenedItem[],
	schema: Schema,
): { contentStartOffsets: number[]; node: PMNode } | null {
	if (elements.length === 0) {
		return null;
	}

	// Each stack frame represents an open list at a given depth.
	// items[] accumulates the PMNode children (listItem nodes) for that list.
	interface StackFrame {
		items: PMNode[];
		listAttrs: Attrs | null;
		listType: string;
	}

	const stack: StackFrame[] = [];

	function openList(listType: string, listAttrs: Attrs | null): void {
		stack.push({ listType, listAttrs, items: [] });
	}

	/**
	 * Close lists on the stack down to `targetDepth`, wrapping each closed
	 * list into the last listItem of its parent.
	 */
	function closeToDepth(targetDepth: number): void {
		while (stack.length > targetDepth + 1) {
			const closed = stack.pop();
			if (!closed) {
				break;
			}
			const listNode = schema.nodes[closed.listType].create(closed.listAttrs, closed.items);

			// Attach the closed list to the last listItem on the parent frame
			const parentFrame = stack[stack.length - 1];
			const lastItem = parentFrame.items[parentFrame.items.length - 1];

			if (lastItem) {
				// Append the nested list to this listItem's children
				const newContent: PMNode[] = [];
				lastItem.forEach((child) => newContent.push(child));
				newContent.push(listNode);
				parentFrame.items[parentFrame.items.length - 1] = schema.nodes.listItem.create(
					lastItem.attrs,
					newContent,
				);
			} else {
				// Edge case: no listItem to attach to. Create a wrapper.
				const wrapperItem = schema.nodes.listItem.create(null, [listNode]);
				parentFrame.items.push(wrapperItem);
			}
		}
	}

	// Seed the root list with the first element's parent list attributes
	openList(elements[0].listType, elements[0].parentListAttrs);

	for (const el of elements) {
		const targetDepth = el.depth;

		// Close lists if we're going shallower
		if (stack.length > targetDepth + 1) {
			closeToDepth(targetDepth);
		}

		// Open lists if we need to go deeper.
		// We do NOT create wrapper listItems here — closeToDepth handles
		// creating wrappers that contain only the nested list (no empty paragraph).
		// For unselected elements, the list structure already existed so we
		// preserve the parent list's attributes. For selected (moved) elements,
		// this is a new nesting level so we use null (the localId plugin will
		// backfill a fresh UUID).
		while (stack.length < targetDepth + 1) {
			openList(el.listType, el.isSelected ? null : el.parentListAttrs);
		}

		// Build the listItem for this element using its content children
		const contentChildren = extractContentChildren(el.node);
		const listItem = schema.nodes.listItem.create(el.node.attrs, contentChildren);
		stack[stack.length - 1].items.push(listItem);
	}

	// Close all remaining open lists
	closeToDepth(0);

	const root = stack[0];
	const rebuilt = schema.nodes[root.listType].create(root.listAttrs, root.items);

	// Compute content start offsets by walking the rebuilt tree.
	const contentStartOffsets: number[] = new Array(elements.length);
	let segIdx = 0;
	rebuilt.descendants((node, pos) => {
		if (isListItemNode(node) && hasContentChildren(node)) {
			// +1 for rebuilt's opening tag, +1 for listItem's opening tag
			contentStartOffsets[segIdx] = 1 + pos + 1;
			segIdx++;
		}
		return true;
	});

	return { node: rebuilt, contentStartOffsets };
}

/**
 * Build a replacement Fragment from a flat array of `FlattenedItem` objects.
 *
 * Elements with depth >= 0 are grouped into consecutive list segments
 * and rebuilt via `rebuildPMList`. Elements with depth < 0 (extracted
 * past the root) are converted to their content children (paragraphs).
 * The result interleaves list nodes and extracted content in document order.
 *
 * Delegates to the shared `buildReplacementFragment` with list-specific
 * rebuild and extraction functions.
 */
export function buildReplacementFragment(elements: FlattenedItem[], schema: Schema): BuildResult {
	return buildReplacementFragmentBase({
		items: elements,
		schema,
		rebuildFn: rebuildPMList,
		extractContentFn: (item) => extractContentChildren(item.node),
	});
}
