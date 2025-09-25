import { uuid } from '@atlaskit/adf-schema';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INDENT_DIRECTION,
	INDENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { toggleTaskItemCheckbox } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	deleteEmptyParagraphAndMoveBlockUp,
	filterCommand as filter,
	isEmptySelectionAtEnd,
	isEmptySelectionAtStart,
} from '@atlaskit/editor-common/utils';
import { autoJoin, chainCommands } from '@atlaskit/editor-prosemirror/commands';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Node, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findParentNodeOfTypeClosestToPos,
	hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';
import type { GetContextIdentifier, TaskDecisionListType } from '../types';

import { joinAtCut, liftSelection, wrapSelectionInTaskList } from './commands';
import {
	findFirstParentListNode,
	getBlockRange,
	getCurrentIndentLevel,
	getTaskItemIndex,
	isActionOrDecisionItem,
	isActionOrDecisionList,
	isEmptyTaskDecision,
	isInFirstTextblockOfBlockTaskItem,
	isInLastTextblockOfBlockTaskItem,
	isInsideDecision,
	isInsideTask,
	isInsideTaskOrDecisionItem,
	isTable,
	liftBlock,
	walkOut,
} from './helpers';
import { insertTaskDecisionWithAnalytics } from './insert-commands';
import { findBlockTaskItem, normalizeTaskItemsSelection } from './utils';

type IndentationInputMethod =
	| INPUT_METHOD.KEYBOARD
	| INPUT_METHOD.TOOLBAR
	| INPUT_METHOD.FLOATING_TB;
const indentationAnalytics = (
	curIndentLevel: number,
	direction: INDENT_DIRECTION,
	inputMethod: IndentationInputMethod,
): AnalyticsEventPayload => ({
	action: ACTION.FORMATTED,
	actionSubject: ACTION_SUBJECT.TEXT,
	actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
	eventType: EVENT_TYPE.TRACK,
	attributes: {
		inputMethod,
		previousIndentationLevel: curIndentLevel,
		newIndentLevel:
			direction === INDENT_DIRECTION.OUTDENT ? curIndentLevel - 1 : curIndentLevel + 1,
		direction,
		indentType: INDENT_TYPE.TASK_LIST,
	},
});

const nodeAfter = ($pos: ResolvedPos) => $pos.doc.resolve($pos.end()).nodeAfter;

const actionDecisionFollowsOrNothing = ($pos: ResolvedPos) => {
	const after = nodeAfter($pos);
	return !after || isActionOrDecisionItem(after);
};

const joinTaskDecisionFollowing: Command = (state, dispatch) => {
	// only run if selection is at end of text, and inside a task or decision item
	if (!isEmptySelectionAtEnd(state) || !isInsideTaskOrDecisionItem(state) || !dispatch) {
		return false;
	}
	// look for the node after this current one
	const $next = walkOut(state.selection.$from);

	// if there's no taskItem or taskList following, then
	// we just do the normal behaviour
	const {
		taskList,
		taskItem,
		decisionList,
		decisionItem,
		paragraph,
		bulletList,
		orderedList,
		listItem,
	} = state.schema.nodes;
	const parentList = findParentNodeOfTypeClosestToPos($next, [
		taskList,
		taskItem,
		decisionList,
		decisionItem,
	]);
	if (!parentList) {
		if ($next.parent.type === paragraph) {
			// try to join paragraph and taskList when backspacing
			return joinAtCut($next.doc.resolve($next.pos))(state, dispatch);
		}
		// If the item we are joining is a list
		if ($next.parent.type === bulletList || $next.parent.type === orderedList) {
			// If the list has an item
			if ($next.parent.firstChild && $next.parent.firstChild.type === listItem) {
				// Place the cursor at the first listItem
				const resolvedStartPos = state.doc.resolve($next.pos + 1);
				// Unindent the first listItem.
				// As if placing your cursor just after the first dot of the list (before the text)
				// and pressing Shift-Tab.
				const tr = liftBlock(state.tr, resolvedStartPos, resolvedStartPos);

				// If autoJoin not used, two ul/ol elements appear rather than one with multiple li elements
				return autoJoin(
					(state, dispatch) => {
						if (tr) {
							if (dispatch) {
								dispatch(tr);
							}
							return true;
						}
						return false;
					},
					['bulletList', 'orderedList'],
				)(state, dispatch);
			}
		}
	}

	return false;
};

export const getUnindentCommand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD) =>
		filter(isInsideTask, (state, dispatch) => {
			const normalizedSelection = normalizeTaskItemsSelection(state.selection);

			const curIndentLevel = getCurrentIndentLevel(normalizedSelection);
			if (!curIndentLevel || curIndentLevel === 1) {
				return false;
			}
			return withAnalytics(
				editorAnalyticsAPI,
				indentationAnalytics(curIndentLevel, INDENT_DIRECTION.OUTDENT, inputMethod),
			)(autoJoin(liftSelection, ['taskList']))(state, dispatch);
		});

// if selection is decision item or first action item in table cell
// then dont consume the Tab, as table-keymap should tab to the next cell
const shouldLetTabThroughInTable = (state: EditorState) => {
	const curIndentLevel = getCurrentIndentLevel(state.selection);
	const curIndex = getTaskItemIndex(state);
	const { tableCell, tableHeader } = state.schema.nodes;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;

	if (((curIndentLevel === 1 && curIndex === 0) || isInsideDecision(state)) && cell) {
		return true;
	}
	return false;
};

export const getIndentCommand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: IndentationInputMethod = INPUT_METHOD.KEYBOARD) =>
		filter(isInsideTask, (state, dispatch) => {
			const normalizedSelection = normalizeTaskItemsSelection(state.selection);
			const curIndentLevel = getCurrentIndentLevel(normalizedSelection);
			if (!curIndentLevel || curIndentLevel >= 6) {
				return true;
			}
			return withAnalytics(
				editorAnalyticsAPI,
				indentationAnalytics(curIndentLevel, INDENT_DIRECTION.INDENT, inputMethod),
			)(autoJoin(wrapSelectionInTaskList, ['taskList']))(state, dispatch);
		});

const backspaceFrom =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	($from: ResolvedPos): Command =>
	(state, dispatch) => {
		const { taskList, blockTaskItem, paragraph } = state.schema.nodes;

		if (expValEquals('editor_refactor_backspace_task_and_decisions', 'isEnabled', true)) {
			// Check if selection is inside a blockTaskItem paragraph
			const resultOfFindBlockTaskItem = findBlockTaskItem($from);
			const isInBlockTaskItemParagraph =
				resultOfFindBlockTaskItem && resultOfFindBlockTaskItem?.hasParagraph;

			// Get the node before the current position
			const beforePos = isInBlockTaskItemParagraph ? $from.before() - 1 : $from.before();
			const nodeBefore = $from.doc.resolve(beforePos).nodeBefore;

			// Check if the node before is an empty task item
			const isEmptyActionOrDecisionItem =
				nodeBefore && isActionOrDecisionItem(nodeBefore) && nodeBefore.content.size === 0;

			const isEmptyBlockTaskItem =
				blockTaskItem &&
				nodeBefore?.type === blockTaskItem &&
				nodeBefore?.firstChild?.type === paragraph &&
				nodeBefore?.firstChild?.content?.size === 0;

			// previous was empty, just delete backwards
			if (isEmptyActionOrDecisionItem || isEmptyBlockTaskItem) {
				return false;
			}

			// If nested in a taskList, unindent
			const depthFromSelectionToBlockTaskItem = isInBlockTaskItemParagraph ? 2 : 1;
			const depthFromSelectionToNestedTaskList = depthFromSelectionToBlockTaskItem + 1;
			const parentDepth = $from.depth - depthFromSelectionToNestedTaskList;

			if ($from.node(parentDepth).type === taskList) {
				return getUnindentCommand(editorAnalyticsAPI)()(state, dispatch);
			}

			// If at the end of an item, unwrap contents into a paragraph
			// we achieve this by slicing the content out, and replacing
			if (actionDecisionFollowsOrNothing($from)) {
				if (dispatch) {
					// If we are in a blockTaskItem paragraph, we need to get the content of the whole blockTaskItem
					// So we reduce the depth by 1 to get to the blockTaskItem node content
					const taskContent = isInBlockTaskItemParagraph
						? state.doc.slice($from.start($from.depth - 1), $from.end($from.depth - 1)).content
						: state.doc.slice($from.start(), $from.end()).content;

					let slice: Fragment | Node | Node[];

					try {
						slice = taskContent.size
							? paragraph.createChecked(undefined, taskContent)
							: paragraph.createChecked();
						// might be end of document after
						const tr = splitListItemWith(state.tr, slice, $from, true);
						dispatch(tr);
						return true;
					} catch (error) {
						// If there's an error creating a paragraph, check if we are in a blockTaskItem
						// Block task item's can have non-text content that cannot be wrapped in a paragraph
						// So if the selection is in a blockTaskItem, just pass the content as is
						if (resultOfFindBlockTaskItem && resultOfFindBlockTaskItem.blockTaskItemNode) {
							// Create an array from the fragment to pass into splitListItemWith, as the `content` property is readonly
							slice = Array.from(taskContent.content);
							const tr = splitListItemWith(state.tr, slice, $from, true);
							dispatch(tr);
							return true;
						}
					}
				}
			}
		} else {
			// previous was empty, just delete backwards
			const taskBefore = $from.doc.resolve($from.before());
			if (
				taskBefore.nodeBefore &&
				isActionOrDecisionItem(taskBefore.nodeBefore) &&
				taskBefore.nodeBefore.nodeSize === 2
			) {
				return false;
			}

			// if nested, just unindent
			if ($from.node($from.depth - 2).type === taskList) {
				return getUnindentCommand(editorAnalyticsAPI)()(state, dispatch);
			}

			// If at the end of an item, unwrap contents into a paragraph
			// we achieve this by slicing the content out, and replacing
			if (actionDecisionFollowsOrNothing($from)) {
				if (dispatch) {
					const taskContent = state.doc.slice($from.start(), $from.end()).content;

					let slice: Fragment | Node | Node[];

					try {
						slice = taskContent.size
							? paragraph.createChecked(undefined, taskContent)
							: paragraph.createChecked();

						// might be end of document after
						const tr = splitListItemWith(state.tr, slice, $from, true);
						dispatch(tr);
						return true;
					} catch (error) {
						// If there's an error creating a paragraph, then just pass the content as is
						// Block task item's can have non-text content that cannot be wrapped in a paragraph
						if (blockTaskItem) {
							// Create an array from the fragment to pass into splitListItemWith, as the `content` property is readonly
							slice = Array.from(taskContent.content);
							const tr = splitListItemWith(state.tr, slice, $from, true);
							dispatch(tr);
							return true;
						}
					}
				}
			}
		}

		return false;
	};

const backspace = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	filter(
		isEmptySelectionAtStart,
		autoJoin(
			chainCommands(
				(state, dispatch) => joinAtCut(state.selection.$from)(state, dispatch),
				filter(isInsideTaskOrDecisionItem, (state, dispatch) =>
					backspaceFrom(editorAnalyticsAPI)(state.selection.$from)(state, dispatch),
				),
			),
			['taskList', 'decisionList'],
		),
	);

const unindentTaskOrUnwrapTaskDecisionFollowing: Command = (state, dispatch) => {
	const {
		selection: { $from },
		schema: {
			nodes: { taskList, doc, paragraph, blockTaskItem, taskItem },
		},
		tr,
	} = state;

	if (fg('platform_editor_blocktaskitem_patch_3')) {
		// only run if cursor is at the end of the node
		if (!isEmptySelectionAtEnd(state) || !dispatch) {
			return false;
		}

		// look for the node after this current one
		const $next = walkOut($from);

		// this is a top-level node it wont have $next.before()
		if (!$next.parent || $next.parent.type === doc) {
			return false;
		}

		// get resolved position of parent
		const $parentPos = $from.doc.resolve($from.start($from.depth - 1));

		const currentNode = $from.node();
		const parentNode = $parentPos.node();

		// if current position isn't an action or decision item, return false
		if (!isActionOrDecisionItem(currentNode) && !isActionOrDecisionItem(parentNode)) {
			return false;
		}

		const resultOfCurrentFindBlockTaskItem = findBlockTaskItem($next);

		let isCurrentEmptyBlockTaskItem = false;

		if (resultOfCurrentFindBlockTaskItem) {
			const { blockTaskItemNode } = resultOfCurrentFindBlockTaskItem;

			isCurrentEmptyBlockTaskItem =
				blockTaskItem &&
				blockTaskItemNode &&
				blockTaskItemNode.childCount === 1 &&
				blockTaskItemNode.firstChild?.type === paragraph &&
				blockTaskItemNode.firstChild.childCount === 0;
		}

		const isEmptyActionOrDecisionItem =
			currentNode && isActionOrDecisionItem(currentNode) && currentNode.childCount === 0;

		// If empty item, use default handler
		if (isEmptyActionOrDecisionItem || isCurrentEmptyBlockTaskItem) {
			return false;
		}

		// Check if next node is a blockTaskItem paragraph
		const resultOfNextFindBlockTaskItem = findBlockTaskItem($next);
		const isNextInBlockTaskItemParagraph =
			resultOfNextFindBlockTaskItem && resultOfNextFindBlockTaskItem?.hasParagraph;

		// if nested, just unindent
		if (
			$next.node($next.depth - 2).type === taskList ||
			// this is for the case when we are on a non-nested item and next one is nested
			($next.node($next.depth - 1).type === taskList && $next.parent.type === taskList)
		) {
			liftBlock(tr, $next, $next);
			dispatch(tr);

			return true;
		}

		const isNextCompatibleWithBlockTaskItem =
			blockTaskItem &&
			(($next?.node()?.type === taskItem && $from?.node()?.type === blockTaskItem) ||
				($next?.node()?.type === blockTaskItem && $from?.node()?.type === taskItem) ||
				([taskItem, blockTaskItem].includes($next?.node()?.type) &&
					resultOfCurrentFindBlockTaskItem &&
					resultOfCurrentFindBlockTaskItem.blockTaskItemNode));

		// if next node is of same type or compatible type, remove the node wrapping and create paragraph
		if (
			(!isTable($next.nodeAfter) && isActionOrDecisionItem($from.parent)) ||
			(resultOfCurrentFindBlockTaskItem &&
				resultOfCurrentFindBlockTaskItem.blockTaskItemNode &&
				actionDecisionFollowsOrNothing($from) &&
				// only forward delete if the node is same type or compatible
				($next.node().type.name === $from.node().type.name || isNextCompatibleWithBlockTaskItem))
		) {
			if (dispatch) {
				// If next node is in a blockTaskItem paragraph, we need to get the content of the whole blockTaskItem
				// So we reduce the depth by 1 to get to the blockTaskItem node content
				const taskContent = isNextInBlockTaskItemParagraph
					? state.doc.slice($next.start($next.depth - 1), $next.end($next.depth - 1)).content
					: state.doc.slice($next.start(), $next.end()).content;

				let slice: Fragment | Node | Node[];

				try {
					slice = taskContent.size
						? paragraph.createChecked(undefined, taskContent)
						: paragraph.createChecked();

					// might be end of document after
					const tr = splitListItemWith(state.tr, slice, $next, false);
					dispatch(tr);
					return true;
				} catch (error) {
					// If there's an error creating a paragraph, check if we are in a blockTaskItem
					// Block task item's can have non-text content that cannot be wrapped in a paragraph
					// So if the selection is in a blockTaskItem, just pass the content as is
					if (resultOfNextFindBlockTaskItem && resultOfNextFindBlockTaskItem.blockTaskItemNode) {
						// Create an array from the fragment to pass into splitListItemWith, as the `content` property is readonly
						slice = Array.from(taskContent.content);

						let $splitPos = $next;

						if ($next.node().firstChild?.isTextblock) {
							// set $next to the resolved position of inside the textblock
							$splitPos = $next.doc.resolve($next.pos + 1);
						}

						const tr = splitListItemWith(state.tr, slice, $splitPos, false);
						dispatch(tr);
						return true;
					}
				}
			}
		}
	} else {
		// only run if cursor is at the end of the node
		if (!isEmptySelectionAtEnd(state) || !dispatch) {
			return false;
		}

		// look for the node after this current one
		const $next = walkOut($from);

		// this is a top-level node it wont have $next.before()
		if (!$next.parent || $next.parent.type === doc) {
			return false;
		}

		// if nested, just unindent
		if (
			$next.node($next.depth - 2).type === taskList ||
			// this is for the case when we are on a non-nested item and next one is nested
			($next.node($next.depth - 1).type === taskList && $next.parent.type === taskList)
		) {
			liftBlock(tr, $next, $next);
			dispatch(tr);

			return true;
		}

		// if next node is of same type, remove the node wrapping and create paragraph
		if (
			!isTable($next.nodeAfter) &&
			isActionOrDecisionItem($from.parent) &&
			actionDecisionFollowsOrNothing($from) &&
			// only forward delete if the node is same type
			$next.node().type.name === $from.node().type.name
		) {
			const taskContent = state.doc.slice($next.start(), $next.end()).content;

			// might be end of document after
			const slice = taskContent.size ? paragraph.createChecked(undefined, taskContent) : [];

			dispatch(splitListItemWith(tr, slice, $next, false));

			return true;
		}
	}

	return false;
};

const deleteForwards = autoJoin(
	chainCommands(
		deleteEmptyParagraphAndMoveBlockUp(isActionOrDecisionList),
		joinTaskDecisionFollowing,
		unindentTaskOrUnwrapTaskDecisionFollowing,
	),
	['taskList', 'decisionList'],
);

const deleteExtraListItem = (tr: Transaction, $from: ResolvedPos) => {
	/*
    After we replace actionItem with empty list item if there's the anomaly of extra empty list item
    the cursor moves inside the first taskItem of splitted taskList
    so the extra list item present above the list item containing taskList & cursor
  */

	const $currentFrom = tr.selection.$from;
	const listItemContainingActionList = tr.doc.resolve($currentFrom.start($currentFrom.depth - 2));
	const emptyListItem = tr.doc.resolve(listItemContainingActionList.before() - 1);

	tr.delete(emptyListItem.start(), listItemContainingActionList.pos);
};

const processNestedActionItem = (
	tr: Transaction,
	$from: ResolvedPos,
	previousListItemPos: number,
) => {
	const parentListNode = findFirstParentListNode($from);
	const previousChildCountOfList = parentListNode?.node.childCount;
	const currentParentListNode = findFirstParentListNode(tr.doc.resolve(tr.mapping.map($from.pos)));
	const currentChildCountOfList = currentParentListNode?.node.childCount;

	/*
    While replacing range with empty list item an extra list item gets created in some of the scenarios
    After splitting only one extra listItem should be created else an extra listItem is created
  */
	if (
		previousChildCountOfList &&
		currentChildCountOfList &&
		previousChildCountOfList + 1 !== currentChildCountOfList
	) {
		deleteExtraListItem(tr, $from);
	}

	// Set custom selection for nested action inside lists using previosuly calculated previousListItem position
	const stableResolvedPos = tr.doc.resolve(previousListItemPos);
	tr.setSelection(TextSelection.create(tr.doc, stableResolvedPos.after() + 2));
};

const splitListItemWith = (
	tr: Transaction,
	content: Fragment | Node | Node[],
	$from: ResolvedPos,
	setSelection: boolean,
) => {
	const origDoc = tr.doc;
	const { blockTaskItem, taskList } = tr.doc.type.schema.nodes;
	let baseDepth = $from.depth;
	let $oldAfter = origDoc.resolve($from.after());
	let textSelectionModifier = 0;
	let replaceFromModifier = 0;
	let deleteBlockModifier = 0;
	let shouldSplitBlockTaskItem = true;
	let isGapCursorSelection = false;

	let hasBlockTaskItem = false;
	if (blockTaskItem) {
		const result = findBlockTaskItem($from);
		if (result) {
			const { blockTaskItemNode, hasParagraph } = result;
			hasBlockTaskItem = fg('platform_editor_blocktaskitem_patch_3') && !!blockTaskItemNode;
			if (blockTaskItemNode) {
				// If the case there is a paragraph in the block task item we need to
				// adjust some calculations
				if (hasParagraph) {
					baseDepth = $from.depth - 1;
					$oldAfter = origDoc.resolve($from.after(baseDepth));

					// When we're removing the extra empty task item we need to reduce the range a bit
					deleteBlockModifier = 1;
				} else {
					textSelectionModifier = 1;
					isGapCursorSelection = true;
				}

				textSelectionModifier = 1;

				const hasSiblingTaskList = $oldAfter.nodeAfter?.type === taskList;
				if (hasSiblingTaskList) {
					// Don't use the split command if there is a sibling taskList
					shouldSplitBlockTaskItem = false;
				}

				const posPreviousSibling = $from.start(hasParagraph ? $from.depth - 1 : $from.depth) - 1;
				const $posPreviousSibling = tr.doc.resolve(posPreviousSibling);

				const hasPreviousTaskItem = $posPreviousSibling.nodeBefore?.type === blockTaskItem;
				if (hasPreviousTaskItem && hasParagraph) {
					replaceFromModifier = 1;
				}
			}
		}
	}

	// split just before the current item
	// we can only split if there was a list item before us
	const container = $from.node(baseDepth - 2);
	const posInList = $from.index(baseDepth - 1);
	const shouldSplit =
		!(!isActionOrDecisionList(container) && posInList === 0) && shouldSplitBlockTaskItem;
	const frag = Fragment.from(content);
	const isNestedActionInsideLists =
		frag.childCount === 1 && frag.firstChild?.type.name === 'listItem';

	/*
	 * We don't split the list item if it's nested inside lists
	 * to have consistent behaviour and their resolution.
	 */
	if (shouldSplit && !isNestedActionInsideLists) {
		// this only splits a node to delete it, so we probably don't need a random uuid
		// but generate one anyway for correctness
		tr = tr.split(
			$from.pos,
			// eslint-disable-next-line @atlaskit/platform/no-preconditioning
			fg('platform_editor_blocktaskitem_patch_3') && hasBlockTaskItem ? 0 : 1,
			[
				{
					type: $from.parent.type,
					attrs: { localId: uuid.generate() },
				},
			],
		);
	}

	/*
	 * In case of nested action inside lists we explicitly set the cursor
	 * We need to insert it relatively to previous doc structure
	 * So we calculate the position of previous list item and save that position
	 * (The cursor can be placed easily next to list item)
	 */
	const previousListItemPos = isNestedActionInsideLists ? $from.start(baseDepth - 2) : 0;

	tr = tr.replace(
		tr.mapping.map($from.start(baseDepth) - 2 + replaceFromModifier),
		tr.mapping.map($from.end(baseDepth) + 2),
		frag.size ? new Slice(frag, 0, 0) : Slice.empty,
	);

	if (setSelection && !isNestedActionInsideLists) {
		const newPos = $from.pos + 1 - ((shouldSplit ? 0 : 2) + textSelectionModifier);
		if (isGapCursorSelection) {
			tr = tr.setSelection(new GapCursorSelection(tr.doc.resolve(newPos), Side.LEFT));
		} else {
			tr = tr.setSelection(new TextSelection(tr.doc.resolve(newPos)));
		}
	}

	// if different levels then we shouldn't lift
	if ($oldAfter.depth === baseDepth - 1) {
		if ($oldAfter.nodeAfter && isActionOrDecisionList($oldAfter.nodeAfter)) {
			// getBlockRange expects to be inside the taskItem
			const pos = tr.mapping.map($oldAfter.pos + 2);
			const $after = tr.doc.resolve(pos);

			const blockRange = getBlockRange({
				$from: $after,
				$to: tr.doc.resolve($after.after($after.depth - 1) - 1),
			});
			if (blockRange) {
				tr = tr.lift(blockRange, blockRange.depth - 1).scrollIntoView();
			}

			// After replacing the range there is an empty task item that
			// we need to remove.
			// We delete 1 past the range of the empty taskItem
			// otherwise we hit a bug in prosemirror-transform:
			// Cannot read property 'content' of undefined
			// If this operation was done on a blockTaskItem we
			// have a modifier for the position
			tr = tr.deleteRange(pos - 3 - deleteBlockModifier, pos - 1 - deleteBlockModifier);
		}
	}

	if (isNestedActionInsideLists) {
		processNestedActionItem(tr, $from, previousListItemPos);
	}

	return tr;
};

const creatParentListItemFragement = (state: EditorState) => {
	return state.schema.nodes.listItem.create({}, state.schema.nodes.paragraph.create());
};

const splitListItem = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
	const {
		tr,
		selection: { $from },
	} = state;
	const {
		schema: {
			nodes: { paragraph },
		},
	} = state;
	const { listItem } = state.schema.nodes;

	if (actionDecisionFollowsOrNothing($from)) {
		if (dispatch) {
			if (hasParentNodeOfType(listItem)(tr.selection)) {
				// if we're inside a list item, then we pass in a fragment containing a new list item not a paragraph
				dispatch(splitListItemWith(tr, creatParentListItemFragement(state), $from, true));
				return true;
			}

			dispatch(splitListItemWith(tr, paragraph.createChecked(), $from, true));
		}
		return true;
	}

	return false;
};

const enter = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	getContextIdentifier: GetContextIdentifier,
) =>
	filter(
		isInsideTaskOrDecisionItem,
		chainCommands(
			filter(
				isEmptyTaskDecision,
				chainCommands(getUnindentCommand(editorAnalyticsAPI)(), splitListItem),
			),
			(state, dispatch) => {
				const { selection, schema } = state;
				const { decisionItem, taskItem, blockTaskItem } = schema.nodes;
				const { $from, $to } = selection;
				const node = $from.node($from.depth);
				let nodeType = node && node.type;

				// Get the parent node type if the current node type is not one of the task or decision items
				// This is required to handle blockTaskItem
				if (![decisionItem, taskItem, blockTaskItem].includes(nodeType)) {
					const possibleNodeType = findParentNodeOfType([decisionItem, taskItem, blockTaskItem])(
						selection,
					)?.node?.type;
					if (possibleNodeType) {
						nodeType = possibleNodeType;
					}
				}

				const listType: TaskDecisionListType = [taskItem, blockTaskItem].includes(nodeType)
					? 'taskList'
					: 'decisionList';

				const addItem = ({ tr, itemLocalId }: { itemLocalId?: string; tr: Transaction }) => {
					// ED-8932: When cursor is at the beginning of a task item, instead of split, we insert above.
					if (
						$from.pos === $to.pos &&
						$from.parentOffset === 0 &&
						(fg('platform_editor_blocktaskitem_patch_2')
							? !$from.parent.isTextblock || isInFirstTextblockOfBlockTaskItem(state)
							: true)
					) {
						const newTask = nodeType.createAndFill({ localId: itemLocalId });
						if (newTask) {
							if (nodeType === blockTaskItem) {
								const blockTaskItemNode = findParentNodeOfType([blockTaskItem])(selection);

								// New task items for blockTaskItem should be taskItem
								// We want to prevent creating new blockTaskItems as much as possible
								const newTaskItem = taskItem.createAndFill({
									localId: itemLocalId,
								});

								if (!blockTaskItemNode || !newTaskItem) {
									return tr;
								}

								return tr.insert(blockTaskItemNode.pos, newTaskItem);
							}
							// Current position will point to text node, but we want to insert above the taskItem node
							return tr.insert($from.pos - 1, newTask);
						}
					}
					/**
					 * For blockTaskItem, must handle it differently because it can have a different depth
					 */
					if (nodeType === blockTaskItem) {
						const blockTaskItemNode = findParentNodeOfType([blockTaskItem])(selection);
						if (!blockTaskItemNode) {
							return tr;
						}

						// If the selection is a gap cursor at the end of the blockTaskItem,
						// we should insert a new taskItem.
						if (
							(fg('platform_editor_blocktaskitem_patch_2')
								? !$from.parent.isTextblock || isInLastTextblockOfBlockTaskItem(state)
								: true) &&
							$from.parentOffset === $from.parent.nodeSize - 2
						) {
							const newTaskItem = taskItem.createAndFill({
								localId: itemLocalId,
							});
							if (newTaskItem) {
								tr.insert(blockTaskItemNode.pos + blockTaskItemNode.node.nodeSize, newTaskItem);

								// Move the cursor to the end of the newly inserted blockTaskItem
								tr.setSelection(
									TextSelection.create(
										tr.doc,
										blockTaskItemNode.pos + blockTaskItemNode.node.nodeSize + 1,
									),
								);
								return tr;
							}
						}

						// Split near the depth of the current selection
						return tr.split(
							$from.pos,
							fg('platform_editor_blocktaskitem_patch_2')
								? $from?.parent?.isTextblock
									? 2
									: 1
								: $from.depth - 1,
							[{ type: blockTaskItem, attrs: { localId: itemLocalId } }],
						);
					}
					return tr.split($from.pos, 1, [{ type: nodeType, attrs: { localId: itemLocalId } }]);
				};

				const insertTr = insertTaskDecisionWithAnalytics(editorAnalyticsAPI, getContextIdentifier)(
					state,
					listType,
					INPUT_METHOD.KEYBOARD,
					addItem,
				);

				if (insertTr && dispatch) {
					insertTr.scrollIntoView();
					dispatch(insertTr);
				}
				return true;
			},
		),
	);

const cmdOptEnter: Command = filter(isInsideTaskOrDecisionItem, (state, dispatch) => {
	const { selection, schema } = state;
	const { taskItem } = schema.nodes;
	const { $from } = selection;
	const node = $from.node($from.depth);
	const nodeType = node && node.type;
	const nodePos = $from.before($from.depth);
	if (nodeType === taskItem) {
		const tr = state.tr;
		tr.step(
			new SetAttrsStep(nodePos, {
				state: node.attrs.state === 'TODO' ? 'DONE' : 'TODO',
				localId: node.attrs.localId,
			}),
		);
		if (tr && dispatch) {
			dispatch(tr);
		}
	}
	return true;
});

export function keymapPlugin(
	schema: Schema,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
	allowNestedTasks?: boolean,
	consumeTabs?: boolean,
): SafePlugin | undefined {
	const getContextIdentifier = () =>
		api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider;
	const indentHandlers = {
		'Shift-Tab': filter(
			[isInsideTaskOrDecisionItem, (state) => !shouldLetTabThroughInTable(state)],
			(state, dispatch) =>
				getUnindentCommand(api?.analytics?.actions)(INPUT_METHOD.KEYBOARD)(state, dispatch) ||
				!!consumeTabs,
		),
		Tab: filter(
			[isInsideTaskOrDecisionItem, (state) => !shouldLetTabThroughInTable(state)],
			(state, dispatch) =>
				getIndentCommand(api?.analytics?.actions)(INPUT_METHOD.KEYBOARD)(state, dispatch) ||
				!!consumeTabs,
		),
	};

	const defaultHandlers: { [key: string]: Command } = consumeTabs
		? {
				'Shift-Tab': isInsideTaskOrDecisionItem,
				Tab: isInsideTaskOrDecisionItem,
			}
		: {};

	const keymaps = {
		Backspace: backspace(api?.analytics?.actions),
		Delete: deleteForwards,
		'Ctrl-d': deleteForwards,

		Enter: enter(api?.analytics?.actions, getContextIdentifier),
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		[toggleTaskItemCheckbox.common!]: cmdOptEnter,

		...(allowNestedTasks ? indentHandlers : defaultHandlers),
	};

	return keymap(keymaps) as SafePlugin;
}

export default keymapPlugin;
