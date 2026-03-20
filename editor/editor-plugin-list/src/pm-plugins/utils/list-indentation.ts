import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { isListItemNode, isListNode } from '@atlaskit/editor-common/utils';
import type { Attrs, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

/**
 * A single content-bearing list element extracted from the PM tree.
 * Wrapper `listItem` nodes (those with no non-list children) are discarded;
 * only items the user can actually see and select are represented.
 */
export interface ListElement {
	depth: number;
	/** Whether this element was within the user's selection (and had its depth adjusted). */
	isSelected: boolean;
	listType: 'bulletList' | 'orderedList';
	node: PMNode;
	/** Attributes of the immediate parent list node (bulletList/orderedList). */
	parentListAttrs: Attrs | null;
	pos: number;
}

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

export interface FlattenListResult {
	elements: ListElement[];
	endIndex: number;
	maxDepth: number;
	startIndex: number;
}

export interface FlattenListOptions {
	delta: number;
	doc: PMNode;
	rootListEnd: number;
	rootListStart: number;
	selectionFrom: number;
	selectionTo: number;
}

/**
 * Flatten a root list into a flat array of content-bearing `ListElement`
 * objects and simultaneously determine which elements intersect the user's
 * selection.
 * Selection intersection is checked against each item's content-only
 * span (excluding nested lists).
 */
export function flattenList({
	doc,
	rootListStart,
	rootListEnd,
	selectionFrom,
	selectionTo,
	delta,
}: FlattenListOptions): FlattenListResult | null {
	const elements: ListElement[] = [];
	let startIndex = -1;
	let endIndex = -1;
	let maxDepth = 0;

	const rootDepth = doc.resolve(rootListStart).depth;

	doc.nodesBetween(rootListStart, rootListEnd, (node, pos, parent) => {
		if (!isListItemNode(node) || !hasContentChildren(node) || !isListNode(parent)) {
			return true;
		}

		// Check selection intersection using content-only bounds
		const cStart = pos + 1;
		const cEnd = cStart + contentSize(node);
		const isSelected = cStart < selectionTo && cEnd > selectionFrom;

		const depth = (doc.resolve(pos).depth - rootDepth - 1) / 2 + (isSelected ? delta : 0);
		elements.push({
			node,
			pos,
			depth,
			listType: parent.type.name,
			parentListAttrs: parent.attrs,
			isSelected,
		});

		if (isSelected) {
			const index = elements.length - 1;
			if (startIndex === -1) {
				startIndex = index;
			}
			endIndex = index;
			maxDepth = Math.max(maxDepth, depth);
		}

		return true;
	});

	if (elements.length === 0 || startIndex === -1) {
		return null;
	}

	return { elements, startIndex, endIndex, maxDepth };
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
 * Rebuild a ProseMirror list tree from a flat array of `ListElement` objects
 * using a bottom-up stack approach.
 *
 * The algorithm tracks open list/listItem wrappers on a stack. As depth
 * transitions occur between consecutive elements, wrapper nodes are opened
 * (depth increase) or closed (depth decrease).
 */
function rebuildPMList(elements: ListElement[], schema: Schema): PMNode | null {
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
	return schema.nodes[root.listType].create(root.listAttrs, root.items);
}

export interface BuildResult {
	/**
	 * For each element (by index), the offset within the fragment where the
	 * element's content begins. For list elements this is the position just
	 * inside the listItem (pos + 1); for extracted elements it is the position
	 * of the first extracted content child.
	 *
	 * To get the absolute document position after `tr.replaceWith(rangeStart, …)`,
	 * add `rangeStart` to the offset.
	 */
	contentStartOffsets: number[];
	fragment: Fragment;
}

/**
 * Build a replacement Fragment from a flat array of `ListElement` objects.
 *
 * Elements with depth >= 0 are grouped into consecutive list segments
 * and rebuilt via `rebuildPMList`. Elements with depth < 0 (extracted
 * past the root) are converted to their content children (paragraphs).
 * The result interleaves list nodes and extracted content in document order.
 */
export function buildReplacementFragment(elements: ListElement[], schema: Schema): BuildResult {
	let fragment = Fragment.empty;
	let pendingListSegment: ListElement[] = [];
	let pendingStartIdx = 0;
	const contentStartOffsets: number[] = new Array(elements.length);

	const flushListSegment = () => {
		if (pendingListSegment.length > 0) {
			const fragmentOffset = fragment.size;
			const rebuilt = rebuildPMList(pendingListSegment, schema);
			if (rebuilt) {
				// Walk the rebuilt tree to find content-bearing listItem positions.
				// descendants() visits in document order matching the element order.
				let segIdx = 0;
				rebuilt.descendants((node, pos) => {
					if (isListItemNode(node) && hasContentChildren(node)) {
						// pos is relative to rebuilt's content start;
						// +1 for rebuilt's opening tag, +1 for listItem's opening tag
						contentStartOffsets[pendingStartIdx + segIdx] = fragmentOffset + 1 + pos + 1;
						segIdx++;
					}
					return true;
				});
				fragment = fragment.addToEnd(rebuilt);
			}
			pendingListSegment = [];
		}
	};

	let elIdx = 0;
	for (const el of elements) {
		if (el.depth < 0) {
			flushListSegment();
			// Extracted element — content children become top-level nodes.
			// Record offset of first content child.
			contentStartOffsets[elIdx] = fragment.size;
			for (const node of extractContentChildren(el.node)) {
				fragment = fragment.addToEnd(node);
			}
		} else {
			if (pendingListSegment.length === 0) {
				pendingStartIdx = elIdx;
			}
			pendingListSegment.push(el);
		}
		elIdx++;
	}
	flushListSegment();

	return { fragment, contentStartOffsets };
}

export interface RestoreSelectionOptions {
	from: number;
	originalSelection: Selection;
	to: number;
	tr: Transaction;
}

/**
 * Restore the transaction's selection after a list structural change.
 *
 * Uses the content start offsets computed during fragment rebuild to
 * map each selection endpoint to its new absolute position.
 */
export function restoreSelection({
	tr,
	originalSelection,
	from,
	to,
}: RestoreSelectionOptions): void {
	const maxPos = tr.doc.content.size;

	if (originalSelection instanceof NodeSelection) {
		try {
			tr.setSelection(NodeSelection.create(tr.doc, Math.min(from, maxPos - 1)));
		} catch {
			tr.setSelection(Selection.near(tr.doc.resolve(from)));
		}
	} else if (originalSelection instanceof GapCursorSelection) {
		tr.setSelection(new GapCursorSelection(tr.doc.resolve(from), originalSelection.side));
	} else {
		tr.setSelection(TextSelection.create(tr.doc, from, to));
	}
}
