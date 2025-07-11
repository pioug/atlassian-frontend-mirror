import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { findCutBefore } from '@atlaskit/editor-common/commands';
import {
	getCommonListAnalyticsAttributes,
	moveTargetIntoList,
} from '@atlaskit/editor-common/lists';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import {
	filterCommand as filter,
	hasVisibleContent,
	isEmptySelectionAtStart,
} from '@atlaskit/editor-common/utils';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import type { NodeType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { StepResult } from '@atlaskit/editor-prosemirror/transform';
import { findPositionOfNodeBefore, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { convertListType } from '../actions/conversions';
import { wrapInListAndJoin } from '../actions/wrap-and-join-lists';
import { liftFollowingList, liftNodeSelectionList, liftTextSelectionList } from '../transforms';
import { sanitiseMarksInSelection } from '../utils/mark';
import {
	canJoinToPreviousListItem,
	isInsideListItem,
	selectionContainsList,
} from '../utils/selection';

import { isFirstChildOfParent } from './isFirstChildOfParent';
import { joinListItemForward } from './join-list-item-forward';
import { listBackspace } from './listBackspace';
import { outdentList } from './outdent-list';

export type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;

export const enterKeyCommand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(): Command =>
	(state, dispatch): boolean => {
		const { selection } = state;
		if (selection.empty) {
			const { $from } = selection;
			const { listItem, codeBlock } = state.schema.nodes;

			// the list item is the parent of the gap cursor
			// while for text, list item is the grant parent of the text node
			const isGapCursorSelection = selection instanceof GapCursorSelection;
			const wrapper =
				isGapCursorSelection && fg('platform_editor_split_list_item_for_gap_cursor')
					? $from.parent
					: $from.node($from.depth - 1);

			if (wrapper && wrapper.type === listItem) {
				/** Check if the wrapper has any visible content */
				const wrapperHasContent = hasVisibleContent(wrapper);
				if (!wrapperHasContent) {
					return editorCommandToPMCommand(outdentList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD))(
						state,
						dispatch,
					);
				} else if (!hasParentNodeOfType(codeBlock)(selection)) {
					return splitListItem(listItem)(state, dispatch);
				}
			}
		}
		return false;
	};

export const backspaceKeyCommand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => (): Command => (state, dispatch) => {
		return chainCommands(
			listBackspace(editorAnalyticsAPI),
			// if we're at the start of a list item, we need to either backspace
			// directly to an empty list item above, or outdent this node
			filter(
				[
					isEmptySelectionAtStart,

					// list items might have multiple paragraphs; only do this at the first one
					isFirstChildOfParent,
					(state) => isInsideListItem(state.tr),
				],
				chainCommands(
					deletePreviousEmptyListItem,
					editorCommandToPMCommand(outdentList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD)),
				),
			),

			// if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
			// the text to the previous list item, if one exists
			filter(
				[isEmptySelectionAtStart, (state) => canJoinToPreviousListItem(state.tr)],
				joinToPreviousListItem,
			),
		)(state, dispatch);
	};

export const deleteKeyCommand = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	joinListItemForward(editorAnalyticsAPI);

// Get the depth of the nearest ancestor list
export const rootListDepth = (pos: ResolvedPos, nodes: Record<string, NodeType>) => {
	const { bulletList, orderedList, listItem } = nodes;
	let depth;
	for (let i = pos.depth - 1; i > 0; i--) {
		const node = pos.node(i);
		if (node.type === bulletList || node.type === orderedList) {
			depth = i;
		}
		if (node.type !== bulletList && node.type !== orderedList && node.type !== listItem) {
			break;
		}
	}
	return depth;
};

function untoggleSelectedList(tr: Transaction) {
	const { selection } = tr;
	const depth = rootListDepth(selection.$to, tr.doc.type.schema.nodes);
	tr = liftFollowingList(selection.$to.pos, selection.$to.end(depth), depth || 0, tr);
	if (selection instanceof NodeSelection || selection instanceof GapCursorSelection) {
		return liftNodeSelectionList(selection, tr);
	}

	return liftTextSelectionList(selection, tr);
}

export const toggleList =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InputMethod, listType: 'bulletList' | 'orderedList'): EditorCommand => {
		return function ({ tr }) {
			const { taskList } = tr.doc.type.schema.nodes;
			if (hasParentNodeOfType(taskList)(tr.selection)) {
				return tr;
			}

			const listInsideSelection = selectionContainsList(tr);
			const listNodeType: NodeType = tr.doc.type.schema.nodes[listType];

			const actionSubjectId =
				listType === 'bulletList'
					? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
					: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

			if (listInsideSelection) {
				const { selection } = tr;

				// for gap cursor or node selection - list is expected 1 level up (listItem -> list)
				// for text selection - list is expected 2 levels up (paragraph -> listItem -> list)
				const positionDiff =
					selection instanceof GapCursorSelection || selection instanceof NodeSelection ? 1 : 2;
				const fromNode = selection.$from.node(selection.$from.depth - positionDiff);
				const toNode = selection.$to.node(selection.$to.depth - positionDiff);

				const transformedFrom =
					listInsideSelection.type.name === 'bulletList'
						? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
						: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

				if (fromNode?.type.name === listType && toNode?.type.name === listType) {
					const commonAttributes = getCommonListAnalyticsAttributes(tr);
					untoggleSelectedList(tr);
					editorAnalyticsAPI?.attachAnalyticsEvent({
						action: ACTION.CONVERTED,
						actionSubject: ACTION_SUBJECT.LIST,
						actionSubjectId: ACTION_SUBJECT_ID.TEXT,
						eventType: EVENT_TYPE.TRACK,
						attributes: {
							...commonAttributes,
							transformedFrom,
							inputMethod,
						},
					})(tr);
					return tr;
				}

				convertListType({ tr, nextListNodeType: listNodeType });
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.CONVERTED,
					actionSubject: ACTION_SUBJECT.LIST,
					actionSubjectId,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						...getCommonListAnalyticsAttributes(tr),
						transformedFrom,
						inputMethod,
					},
				})(tr);
			} else {
				// Need to have this before wrapInList so the wrapping is done with valid content
				// For example, if trying to convert centre or right aligned paragraphs to lists
				sanitiseMarksInSelection(tr, listNodeType);

				wrapInListAndJoin(listNodeType, tr);

				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.LIST,
					actionSubjectId,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						inputMethod,
					},
				})(tr);
			}

			// If document wasn't changed, return false from the command to indicate that the
			// editing action failed
			if (!tr.docChanged) {
				return null;
			}

			return tr;
		};
	};

export const toggleBulletList =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InputMethod = INPUT_METHOD.TOOLBAR): EditorCommand => {
		return toggleList(editorAnalyticsAPI)(inputMethod, 'bulletList');
	};

export const toggleOrderedList =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InputMethod = INPUT_METHOD.TOOLBAR): EditorCommand => {
		return toggleList(editorAnalyticsAPI)(inputMethod, 'orderedList');
	};

/**
 * Implementation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */
function splitListItem(itemType: NodeType): Command {
	return function (state, dispatch) {
		const ref = state.selection as NodeSelection;
		const $from = ref.$from;
		const $to = ref.$to;
		const node = ref.node;
		if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
			return false;
		}

		// list item is the parent of the gap cursor instead of grant parent;
		// rename grantParent to WrapperlistItem once we clean up platform_editor_split_list_item_for_gap_cursor
		const isGapCursorSelection = ref instanceof GapCursorSelection;
		const grandParent =
			isGapCursorSelection && fg('platform_editor_split_list_item_for_gap_cursor')
				? $from.parent
				: $from.node(-1);

		if (grandParent.type !== itemType) {
			return false;
		}
		/** --> The following line changed from the original PM implementation to allow list additions with multiple paragraphs */
		if (
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(grandParent.content as any).content.length <= 1 &&
			$from.parent.content.size === 0 &&
			!(grandParent.content.size === 0)
		) {
			// In an empty block. If this is a nested list, the wrapping
			// list item should be split. Otherwise, bail out and let next
			// command handle lifting.
			if (
				$from.depth === 2 ||
				$from.node(-3).type !== itemType ||
				$from.index(-2) !== $from.node(-2).childCount - 1
			) {
				return false;
			}
			if (dispatch) {
				let wrap = Fragment.empty;
				const keepItem = $from.index(-1) > 0;
				// Build a fragment containing empty versions of the structure
				// from the outer list item to the parent node of the cursor
				for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
					wrap = Fragment.from($from.node(d).copy(wrap));
				}
				// Add a second list item with an empty default start node
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				wrap = wrap.append(Fragment.from(itemType.createAndFill()!));
				const tr$1 = state.tr.replace(
					$from.before(keepItem ? undefined : -1),
					$from.after(-3),
					new Slice(wrap, keepItem ? 3 : 2, 2),
				);
				tr$1.setSelection(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(state.selection.constructor as any).near(
						tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2)),
					),
				);
				dispatch(tr$1.scrollIntoView());
			}
			return true;
		}
		const nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
		const tr = state.tr.delete($from.pos, $to.pos);
		const types = nextType && [null, { type: nextType }];

		if (fg('platform_editor_split_list_item_for_gap_cursor')) {
			if (dispatch) {
				if (ref instanceof TextSelection) {
					dispatch(tr.split($from.pos, 2, types ?? undefined).scrollIntoView());
					return true;
				}

				// create new list item with empty paragraph when user click enter on gap cursor
				if (isGapCursorSelection && $from.nodeBefore?.isBlock) {
					// For gap cursor selection , we can not split the list item directly
					// We need to insert a new list item after the current list item to simulate the split behaviour
					const { listItem, paragraph } = state.schema.nodes;
					const newListItem = listItem.createChecked({}, paragraph.createChecked());
					dispatch(
						tr
							.insert($from.pos, newListItem)
							.setSelection(Selection.near(tr.doc.resolve($to.pos + 1)))
							.scrollIntoView(),
					);
					return true;
				}
			}

			return false;
		} else {
			if (dispatch) {
				dispatch(tr.split($from.pos, 2, types ?? undefined).scrollIntoView());
			}
			return true;
		}
	};
}

const deletePreviousEmptyListItem: Command = (state, dispatch) => {
	const { $from } = state.selection;
	const { listItem } = state.schema.nodes;

	const $cut = findCutBefore($from);
	if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
		return false;
	}

	const nodeBeforeIsExtension =
		$cut.nodeBefore.firstChild && $cut.nodeBefore.firstChild.type.name === 'extension';

	const previousListItemEmpty =
		// Ignored via go/ees005
		$cut.nodeBefore.childCount === 1 &&
		$cut.nodeBefore.firstChild &&
		$cut.nodeBefore.firstChild.nodeSize <= 2 &&
		!nodeBeforeIsExtension;

	if (previousListItemEmpty) {
		const { tr } = state;

		if (dispatch) {
			dispatch(tr.delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos).scrollIntoView());
		}
		return true;
	}

	return false;
};

const joinToPreviousListItem: Command = (state, dispatch) => {
	const { $from } = state.selection;
	const { paragraph, listItem, codeBlock, bulletList, orderedList } = state.schema.nodes;
	const isGapCursorShown = state.selection instanceof GapCursorSelection;
	const $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
	const $cut = findCutBefore($cutPos);
	if (!$cut) {
		return false;
	}

	// see if the containing node is a list
	if ($cut.nodeBefore && [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
		// and the node after this is a paragraph or a codeBlock
		if (
			$cut.nodeAfter &&
			($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)
		) {
			// find the nearest paragraph that precedes this node
			let $lastNode = $cut.doc.resolve($cut.pos - 1);

			while ($lastNode.parent.type !== paragraph && $lastNode.pos > 1) {
				$lastNode = state.doc.resolve($lastNode.pos - 1);
			}

			let { tr } = state;
			if (isGapCursorShown) {
				const nodeBeforePos = findPositionOfNodeBefore(tr.selection);
				if (typeof nodeBeforePos !== 'number') {
					return false;
				}
				// append the codeblock to the list node
				const list = $cut.nodeBefore.copy(
					$cut.nodeBefore.content.append(Fragment.from(listItem.createChecked({}, $cut.nodeAfter))),
				);
				tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list);
			} else {
				const step = moveTargetIntoList({
					insertPosition: $lastNode.pos,
					$target: $cut,
				});

				// ED-13966: check if the step will cause an ProseMirror error
				// if there's an error don't apply the step as it will might lead into a data loss.
				// It doesn't play well with media being a leaf node.
				const stepResult: StepResult = state.tr.maybeStep(step);

				if (stepResult.failed) {
					return false;
				} else {
					tr = state.tr.step(step);
				}
			}

			// find out if there's now another list following and join them
			// as in, [list, p, list] => [list with p, list], and we want [joined list]
			const $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize));
			if (
				$postCut.nodeBefore &&
				$postCut.nodeAfter &&
				$postCut.nodeBefore.type === $postCut.nodeAfter.type &&
				[bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1
			) {
				tr = tr.join($postCut.pos);
			}

			if (dispatch) {
				if (
					!tr.doc.resolve($lastNode.pos).nodeBefore?.isBlock ||
					tr.doc.resolve($lastNode.pos).nodeBefore === null
				) {
					tr = tr.setSelection(TextSelection.near(tr.doc.resolve(tr.mapping.map($cut.pos)), -1));
				}
				dispatch(tr.scrollIntoView());
			}
			return true;
		}
	}

	return false;
};
