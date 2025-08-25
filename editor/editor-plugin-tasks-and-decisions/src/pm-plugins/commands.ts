import { findCutBefore } from '@atlaskit/editor-common/commands';
import type { Command } from '@atlaskit/editor-common/types';
import { findFarthestParentNode } from '@atlaskit/editor-common/utils';
import { type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findWrapping, ReplaceAroundStep } from '@atlaskit/editor-prosemirror/transform';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import {
	getBlockRange,
	isActionOrDecisionItem,
	isActionOrDecisionList,
	liftBlock,
	subtreeHeight,
} from './helpers';
import { normalizeTaskItemsSelection } from './utils';

export const liftSelection: Command = (state, dispatch) => {
	const normalizedSelection = normalizeTaskItemsSelection(state.selection);
	const { $from, $to } = normalizedSelection;

	const tr = liftBlock(state.tr, $from, $to);

	if (dispatch && tr) {
		dispatch(tr);
	}

	return !!tr;
};

/**
 * Wraps the current selection in a task list, respecting a maximum indentation depth of 6 levels.
 *
 * - Normalizes the selection to ensure it covers complete task items.
 * - Determines the maximum depth of task list nesting within the selection.
 * - If the selection is already nested at or beyond the maximum depth, the command does nothing.
 * - Calculates the block range to wrap, handling both regular and block task items.
 * - Wraps the block in a task list to increase indentation or create a new task list if necessary.
 *
 * @param state - The current editor state.
 * @param dispatch - The dispatch function to apply the transaction.
 * @returns `true` if the command was handled (even if no changes were made), otherwise `false`.
 * @example
 * ```typescript
 * autoJoin(wrapSelectionInTaskList, ['taskList']))(state, dispatch);
 * ```
 */
export const wrapSelectionInTaskList: Command = (state, dispatch) => {
	const { $from, $to } = normalizeTaskItemsSelection(state.selection);

	// limit ui indentation to 6 levels
	const { taskList, taskItem, blockTaskItem } = state.schema.nodes;
	let maxDepth = subtreeHeight($from, $to, [taskList, taskItem]);

	const isBlockTaskItem = hasParentNodeOfType([blockTaskItem])(state.selection);
	const blockTaskItemNode = findFarthestParentNode((node) => node.type === blockTaskItem)($from);

	if (blockTaskItem && isBlockTaskItem && blockTaskItemNode) {
		// If the selection is inside a nested node inside the blockTaskItem
		// Remove the difference in depth between the selection and the blockTaskItemNode
		if ($from.depth > blockTaskItemNode.depth) {
			maxDepth =
				subtreeHeight($from, $to, [taskList, blockTaskItem]) -
				($from.depth - blockTaskItemNode.depth);
		} else {
			maxDepth = subtreeHeight($from, $to, [taskList, blockTaskItem]);
		}
	}

	if (maxDepth >= 6) {
		return true;
	}

	const blockRange = getBlockRange($from, $to);

	if (!blockRange) {
		return true;
	}

	const wrapping = findWrapping(blockRange, state.schema.nodes.taskList);
	if (!wrapping) {
		return true;
	}

	if (dispatch) {
		dispatch(state.tr.wrap(blockRange, wrapping).scrollIntoView());
	}

	return true;
};

/**
 * Tries to move the paragraph content near the given position into the taskItem or decisionItem
 * before it.
 *
 * Looks backwards from the given position to find the "cut point" between the last taskItem and the
 * following paragraph. Then tries to move the content from that paragraph into the taskItem.
 *
 * @param $pos Position at the end of, or anywhere in paragraph following, the last taskItem
 * @see {joinToPreviousListItem}
 */
export const joinAtCut =
	($pos: ResolvedPos): Command =>
	(state, dispatch) => {
		const $cut = findCutBefore($pos);
		if (!$cut) {
			return false;
		}
		const { paragraph } = $cut.doc.type.schema.nodes;

		// find the boundary between the taskList and paragraph
		if (
			$cut.nodeBefore &&
			isActionOrDecisionList($cut.nodeBefore) &&
			$cut.nodeAfter &&
			$cut.nodeAfter.type === paragraph
		) {
			// we'll find the boundary of a taskList
			// so resolve -1 to find the inside end of the last taskItem
			let $lastNode = $cut.doc.resolve($cut.pos - 1);

			// might have deeply nested taskList, keep trying to find it
			while (!isActionOrDecisionItem($lastNode.parent)) {
				$lastNode = state.doc.resolve($lastNode.pos - 1);
			}

			// grab the structure between the taskItem and the paragraph
			// note: structure = true in ReplaceAroundStep
			const slice = state.tr.doc.slice($lastNode.pos, $cut.pos);

			// collapse the range between end of last taskItem and after the paragraph
			// with the gap being the paragraph's content (i.e. take that content)
			//
			// we pass the structure we found earlier to join the p and taskItem nodes
			//
			// see https://prosemirror.net/docs/ref/#transform.ReplaceStep.constructor
			// see https://prosemirror.net/docs/ref/#transform.ReplaceAroundStep.constructor
			const tr = state.tr.step(
				new ReplaceAroundStep(
					$lastNode.pos,
					$cut.pos + $cut.nodeAfter.nodeSize,
					$cut.pos + 1,
					$cut.pos + $cut.nodeAfter.nodeSize - 1,
					slice,
					0,
					true,
				),
			);

			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
