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
	isInsideDecision,
	isInsideTask,
	isInsideTaskOrDecisionItem,
	isTable,
	liftBlock,
	walkOut,
} from './helpers';
import { insertTaskDecisionWithAnalytics } from './insert-commands';
import { normalizeTaskItemsSelection } from './utils';

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
		const { taskList, paragraph } = state.schema.nodes;
		if ($from.node($from.depth - 2).type === taskList) {
			return getUnindentCommand(editorAnalyticsAPI)()(state, dispatch);
		}

		// bottom level, should "unwrap" taskItem contents into paragraph
		// we achieve this by slicing the content out, and replacing
		if (actionDecisionFollowsOrNothing($from)) {
			if (dispatch) {
				const taskContent = state.doc.slice($from.start(), $from.end()).content;

				// might be end of document after
				const slice = taskContent.size
					? paragraph.createChecked(undefined, taskContent)
					: paragraph.createChecked();

				dispatch(splitListItemWith(state.tr, slice, $from, true));
			}

			return true;
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
			nodes: { taskList, doc, paragraph },
		},
		tr,
	} = state;

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
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const origDoc = tr.doc;

	// split just before the current item
	// we can only split if there was a list item before us
	const container = $from.node($from.depth - 2);
	const posInList = $from.index($from.depth - 1);
	const shouldSplit = !(!isActionOrDecisionList(container) && posInList === 0);
	const frag = Fragment.from(content);
	const isNestedActionInsideLists =
		frag.childCount === 1 && frag.firstChild?.type.name === 'listItem';

	/* We don't split the list item if it's nested inside lists
    to have consistent behaviour and their resolution.
  */
	if (shouldSplit && !isNestedActionInsideLists) {
		// this only splits a node to delete it, so we probably don't need a random uuid
		// but generate one anyway for correctness
		tr = tr.split($from.pos, 1, [
			{
				type: $from.parent.type,
				attrs: { localId: uuid.generate() },
			},
		]);
	}
	/*
    In case of nested action inside lists we explicitly set the cursor
    We need to insert it relatively to previous doc structure
    So we calculate the position of previous list item and save that position
    (The cursor can be placed easily next to list item)
  */
	const previousListItemPos = isNestedActionInsideLists ? $from.start($from.depth - 2) : 0;

	// and delete the action at the current pos
	// we can do this because we know either first new child will be taskItem or nothing at all

	tr = tr.replace(
		tr.mapping.map($from.start() - 2),
		tr.mapping.map($from.end() + 2),
		frag.size ? new Slice(frag, 0, 0) : Slice.empty,
	);

	// put cursor inside paragraph
	if (setSelection && !isNestedActionInsideLists) {
		tr = tr.setSelection(new TextSelection(tr.doc.resolve($from.pos + 1 - (shouldSplit ? 0 : 2))));
	}
	// lift list up if the node after the initial one was a taskList
	// which means it would have empty placeholder content if we just immediately delete it
	// if it's a taskItem then it can stand alone, so it's fine
	const $oldAfter = origDoc.resolve($from.after());

	// if different levels then we shouldn't lift
	if ($oldAfter.depth === $from.depth - 1) {
		if ($oldAfter.nodeAfter && isActionOrDecisionList($oldAfter.nodeAfter)) {
			// getBlockRange expects to be inside the taskItem
			const pos = tr.mapping.map($oldAfter.pos + 2);
			const $after = tr.doc.resolve(pos);

			const blockRange = getBlockRange($after, tr.doc.resolve($after.after($after.depth - 1) - 1));
			if (blockRange) {
				tr = tr.lift(blockRange, blockRange.depth - 1).scrollIntoView();
			}

			// we delete 1 past the range of the empty taskItem
			// otherwise we hit a bug in prosemirror-transform:
			// Cannot read property 'content' of undefined
			tr = tr.deleteRange(pos - 3, pos - 1);
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
	let {
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
				const { taskItem } = schema.nodes;
				const { $from, $to } = selection;
				const node = $from.node($from.depth);
				const nodeType = node && node.type;
				const listType: TaskDecisionListType = nodeType === taskItem ? 'taskList' : 'decisionList';

				const addItem = ({ tr, itemLocalId }: { tr: Transaction; itemLocalId?: string }) => {
					// ED-8932: When cursor is at the beginning of a task item, instead of split, we insert above.
					if ($from.pos === $to.pos && $from.parentOffset === 0) {
						const newTask = nodeType.createAndFill({ localId: itemLocalId });
						if (newTask) {
							// Current position will point to text node, but we want to insert above the taskItem node
							return tr.insert($from.pos - 1, newTask);
						}
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

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
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
