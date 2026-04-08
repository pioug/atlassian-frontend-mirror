import { uuid } from '@atlaskit/adf-schema';
import { flattenList as flattenListBase } from '@atlaskit/editor-common/lists';
import type {
	FlattenedItem,
	FlattenListOptions,
	FlattenListResult,
} from '@atlaskit/editor-common/lists';
import type { Attrs, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Flattens a taskList tree into an array of task items with computed depths.
 * Only selected items have their depth adjusted by indentDelta.
 *
 * Delegates to the shared `flattenList` with task-list-specific callbacks.
 */
export function flattenTaskList(options: FlattenListOptions): FlattenListResult | null {
	const { taskList, taskItem, blockTaskItem } = options.doc.type.schema.nodes;

	return flattenListBase(options, {
		isContentNode: (node, parent) => {
			const isTaskItemType =
				node.type === taskItem || (blockTaskItem != null && node.type === blockTaskItem);
			return isTaskItemType && parent != null && parent.type === taskList;
		},
		getSelectionBounds: (node, pos) => ({
			start: pos,
			end: pos + node.nodeSize,
		}),
		getDepth: (resolvedDepth, rootDepth) => resolvedDepth - rootDepth - 1,
	});
}

// Each stack entry collects children for a taskList at a given depth.
// The root entry (depth -1) is special: its children become the content
// of the outermost taskList directly (not wrapped in another taskList).
// Entries at depth >= 0 each produce a nested taskList when popped.
type StackEntry = {
	// Accumulated child nodes for this wrapper level.
	children: PMNode[];
	// Nesting depth this entry represents (-1 = root, 0+ = nested levels).
	depth: number;
	// True once a selected (moved) item has been added to this entry.
	// When set, the sourceParentAttrs split check is suppressed so that
	// subsequent unselected siblings merge into the same wrapper rather
	// than producing a separate sibling taskList.
	hasSelectedItems: boolean;
	// Original attrs of the parent taskList, used to preserve list identity
	// when possible. Null for entries created for moved (selected) items.
	listAttrs: Attrs | null;
	// The parentListAttrs of the first item placed in this entry.
	// Used to decide whether consecutive same-depth unselected items
	// should share this wrapper or start a new one.
	sourceParentAttrs: Attrs | null;
};

/**
 * Rebuilds a taskList tree from a flattened array of task items.
 * Uses a stack-based approach to create proper nesting.
 *
 * Preserves original taskList attributes (e.g. localId) for wrappers
 * of unselected items. Only generates fresh UUIDs for newly-created
 * nesting levels (i.e. when items were moved via indent/outdent).
 *
 * Given items with depths [A:0, B:1, C:2, D:1, E:0], produces:
 *
 * taskList
 *   taskItem 'A'
 *   taskList
 *     taskItem 'B'
 *     taskList
 *       taskItem 'C'
 *     taskItem 'D'
 *   taskItem 'E'
 *
 * Also computes `contentStartOffsets`: for each item (by index),
 * the offset within the returned fragment where the item's content
 * begins. This is used for accurate selection restoration.
 */
export function rebuildTaskList(
	items: FlattenedItem[],
	schema: Schema,
): { contentStartOffsets: number[]; node: PMNode } | null {
	const { taskList } = schema.nodes;
	const contentStartOffsets: number[] = new Array(items.length);

	if (items.length === 0) {
		return null;
	}

	// Start with the root level (depth -1 represents the root taskList wrapper)
	const stack: StackEntry[] = [
		{
			depth: -1,
			children: [],
			hasSelectedItems: false,
			listAttrs: items[0].parentListAttrs,
			sourceParentAttrs: items[0].parentListAttrs,
		},
	];

	for (const item of items) {
		const targetDepth = item.depth;

		// Pop stack entries strictly deeper than target, wrapping them into taskLists
		while (stack.length > 1 && stack[stack.length - 1].depth > targetDepth) {
			const popped = stack.pop();
			if (!popped) {
				break;
			}
			const attrs = popped.listAttrs ?? { localId: uuid.generate() };
			const wrappedList = taskList.create(attrs, popped.children);
			stack[stack.length - 1].children.push(wrappedList);
		}

		// If the stack top is at the same depth as the target, decide whether
		// to merge into the existing entry or close it and start a new one.
		// Unselected items from different original parent taskLists get
		// separate wrappers (preserving original nesting). Selected (moved)
		// items always merge with whatever is already at the target depth,
		// since they're being placed into a new structural context.
		// However, if the current entry already contains selected (moved) items,
		// we do NOT split — the unselected sibling should join the same wrapper
		// because the selected item established the new structural context.
		if (stack.length > 1 && stack[stack.length - 1].depth === targetDepth && !item.isSelected) {
			const top = stack[stack.length - 1];
			if (top.sourceParentAttrs !== item.parentListAttrs && !top.hasSelectedItems) {
				const popped = stack.pop();
				if (!popped) {
					break;
				}
				const attrs = popped.listAttrs ?? { localId: uuid.generate() };
				const wrappedList = taskList.create(attrs, popped.children);
				stack[stack.length - 1].children.push(wrappedList);
			}
		}

		// Push new stack entries to reach the target depth.
		// Skip intermediate entries at depth 0 — depth-0 items belong
		// directly in the root entry (depth -1), so we only need
		// intermediates for depths > 1.
		while (stack[stack.length - 1].depth < targetDepth - 1) {
			const nextDepth = Math.max(stack[stack.length - 1].depth + 1, 1);
			stack.push({
				depth: nextDepth,
				children: [],
				hasSelectedItems: false,
				listAttrs: item.isSelected ? null : item.parentListAttrs,
				sourceParentAttrs: item.parentListAttrs,
			});
		}

		// Add the item at the target depth
		if (targetDepth === 0) {
			// Depth 0 items go directly into the root taskList
			stack[0].children.push(item.node);
			if (item.isSelected) {
				stack[0].hasSelectedItems = true;
			}
		} else {
			// Ensure there's a stack entry at depth targetDepth to hold this item
			if (stack[stack.length - 1].depth < targetDepth) {
				stack.push({
					depth: targetDepth,
					children: [],
					hasSelectedItems: false,
					listAttrs: item.isSelected ? null : item.parentListAttrs,
					sourceParentAttrs: item.parentListAttrs,
				});
			}
			stack[stack.length - 1].children.push(item.node);
			if (item.isSelected) {
				stack[stack.length - 1].hasSelectedItems = true;
			}
		}
	}

	// Close remaining stack entries
	while (stack.length > 1) {
		const popped = stack.pop();
		if (!popped) {
			break;
		}
		const attrs = popped.listAttrs ?? { localId: uuid.generate() };
		const wrappedList = taskList.create(attrs, popped.children);
		stack[stack.length - 1].children.push(wrappedList);
	}

	// The root entry's children form the root taskList.
	// Preserve the root's original attrs when available.
	const rootChildren = stack[0].children;
	const rootAttrs = stack[0].listAttrs ?? { localId: uuid.generate() };
	const rootList = taskList.create(rootAttrs, rootChildren);

	// Compute contentStartOffsets by walking the rebuilt tree.
	// Each taskItem's content starts at (pos_within_root + 1) for the taskItem opening tag.
	// We add +1 for the root taskList's opening tag.
	const isTaskItemType = (node: PMNode): boolean => {
		const { taskItem, blockTaskItem } = schema.nodes;
		return node.type === taskItem || (blockTaskItem != null && node.type === blockTaskItem);
	};

	let itemIdx = 0;
	rootList.descendants((node, pos) => {
		if (isTaskItemType(node) && itemIdx < items.length) {
			// pos is relative to rootList content start;
			// +1 for rootList's opening tag, +1 for taskItem's opening tag
			contentStartOffsets[itemIdx] = 1 + pos + 1;
			itemIdx++;
		}
		return true;
	});

	return { node: rootList, contentStartOffsets };
}
