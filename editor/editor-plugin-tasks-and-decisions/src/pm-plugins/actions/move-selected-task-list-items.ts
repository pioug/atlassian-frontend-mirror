import {
	buildReplacementFragment,
	computeSelectionOffsets,
	restoreSelection,
} from '@atlaskit/editor-common/lists';
import { findFarthestParentNode } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { flattenTaskList, rebuildTaskList } from '../task-list-indentation';

const MAX_TASK_LIST_DEPTH = 6;

export function moveSelectedTaskListItems(
	tr: Transaction,
	indentDelta: number,
): Transaction | null {
	const { doc, selection } = tr;
	const { schema } = doc.type;
	const { taskList } = schema.nodes;

	const { $from, $to } = selection;

	const rootListResult = findFarthestParentNode((node) => node.type === taskList)($from);
	if (!rootListResult) {
		return null;
	}

	const rootListStart = rootListResult.pos;
	const rootListEnd = rootListStart + rootListResult.node.nodeSize;

	const flattenResult = flattenTaskList({
		doc,
		rootListStart,
		rootListEnd,
		selectionFrom: $from.pos,
		selectionTo: $to.pos,
		indentDelta,
		maxDepth: MAX_TASK_LIST_DEPTH,
	});

	if (!flattenResult) {
		return null;
	}

	const { items: flattenedItems, startIndex, endIndex } = flattenResult;

	const { fragment, contentStartOffsets } = buildReplacementFragment({
		items: flattenedItems,
		schema,
		rebuildFn: rebuildTaskList,
		extractContentFn: (item, s) => {
			// Extract task item content for breakout.
			// taskItem has inline content, so wrap in a paragraph.
			// blockTaskItem already has paragraph children.
			const { blockTaskItem } = s.nodes;
			if (blockTaskItem != null && item.node.type === blockTaskItem) {
				// blockTaskItem children are already paragraphs/extensions
				const children: PMNode[] = [];
				item.node.forEach((child: PMNode) => children.push(child));
				return children;
			}
			// Regular taskItem — wrap inline content in a paragraph
			return [s.nodes.paragraph.create(null, item.node.content)];
		},
	});

	if (fragment.size === 0) {
		return null;
	}

	tr.replaceWith(rootListStart, rootListEnd, fragment);

	const { from, to } = computeSelectionOffsets({
		items: flattenedItems,
		startIndex,
		endIndex,
		originalFrom: $from.pos,
		originalTo: $to.pos,
		contentStartOffsets,
		rootListStart,
		docSize: tr.doc.content.size,
	});

	restoreSelection({ tr, originalSelection: selection, from, to });

	tr.scrollIntoView();

	return tr;
}
