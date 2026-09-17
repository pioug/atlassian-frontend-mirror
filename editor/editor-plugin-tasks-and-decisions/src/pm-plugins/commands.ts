import type { FontSizeMarkAttrs } from '@atlaskit/adf-schema/font-size';
import { findCutBefore } from '@atlaskit/editor-common/commands';
import { getFirstParagraphBlockMarkAttrs } from '@atlaskit/editor-common/lists';
import { isTaskList } from '@atlaskit/editor-common/transforms';
import type { Command } from '@atlaskit/editor-common/types';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { ReplaceAroundStep } from '@atlaskit/editor-prosemirror/transform';

import { isActionOrDecisionItem, isActionOrDecisionList } from './helpers';
import { normalizeNodeForTaskTextSize } from './utils/paste';

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
		const { blockTaskItem } = state.schema.nodes;
		const { fontSize } = state.schema.marks;
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
			let slice = state.tr.doc.slice($lastNode.pos, $cut.pos);

			let from = $lastNode.pos;
			const to = $cut.pos + $cut.nodeAfter.nodeSize;
			let gapFrom = $cut.pos + 1;
			let gapTo = $cut.pos + $cut.nodeAfter.nodeSize - 1;
			const insert = 0;

			if (blockTaskItem) {
				if ($lastNode.parent.type === blockTaskItem) {
					const childOfLastNode = state.doc.resolve($lastNode.pos - 1);
					if (childOfLastNode.parent.type === paragraph) {
						// Recalculate the slice to include the full blockTaskItem structure
						slice = state.tr.doc.slice(childOfLastNode.pos, $cut.pos);
						// Need to move one pos in to get to the text node of the paragraph
						from = $lastNode.pos - 1;
					} else {
						// If the blockTaskItem last node is not a paragraph
						// Expand the gap to include the paragraph being merged
						gapFrom = $cut.pos; // To get the actual paragraph node
						gapTo = $cut.pos + $cut.nodeAfter.nodeSize - 1;
					}
				}
			}

			// collapse the range between end of last taskItem and after the paragraph
			// with the gap being the paragraph's content (i.e. take that content)
			//
			// we pass the structure we found earlier to join the p and taskItem nodes
			//
			// see https://prosemirror.net/docs/ref/#transform.ReplaceStep.constructor
			// see https://prosemirror.net/docs/ref/#transform.ReplaceAroundStep.constructor
			let tr = state.tr.step(new ReplaceAroundStep(from, to, gapFrom, gapTo, slice, insert, true));

			if (fontSize) {
				const targetTaskListSmallTextAttrs = getFirstParagraphBlockMarkAttrs<FontSizeMarkAttrs>(
					$cut.nodeBefore,
					fontSize,
				);

				const followingListPos = $cut.pos + $cut.nodeAfter.nodeSize;
				const followingListNode = state.doc.resolve(followingListPos).nodeAfter;

				if (followingListNode && isTaskList(followingListNode.type)) {
					const normalizedListNode = normalizeNodeForTaskTextSize(
						followingListNode,
						state.schema,
						targetTaskListSmallTextAttrs,
					)[0];
					if (normalizedListNode && normalizedListNode !== followingListNode) {
						const mappedFollowingListPos = tr.mapping.map(followingListPos);
						const currentFollowingListNode = tr.doc.nodeAt(mappedFollowingListPos);
						if (currentFollowingListNode) {
							tr = tr.replaceWith(
								mappedFollowingListPos,
								mappedFollowingListPos + currentFollowingListNode.nodeSize,
								normalizedListNode,
							);
						}
					}
				}
			}

			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
