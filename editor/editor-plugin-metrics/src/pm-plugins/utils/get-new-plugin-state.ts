import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { type MetricsState } from '../main';

import { checkTrActionType } from './check-tr-actions/check-tr-action-type';
import { ActionType, type TrActionType } from './check-tr-actions/types';
import { isNonTextUndo } from './is-non-text-undo';
import { isSafeInsert } from './is-safe-insert';

const textInputActions = [ActionType.TEXT_INPUT, ActionType.EMPTY_LINE_ADDED_OR_DELETED];

const listActions = [
	ActionType.UPDATING_NEW_LIST_TYPE_ITEM,
	ActionType.INSERTING_NEW_LIST_TYPE_NODE,
];

const continuousActions = [...textInputActions, ...listActions, ActionType.UPDATING_STATUS];

const checkIsDesiredAction = (trType: TrActionType, desiredActions: ActionType[]) => {
	return trType && desiredActions.includes(trType.type);
};

const getNewActionTypeCount = (shouldIncrement: boolean, currentCount: number) => {
	return shouldIncrement ? currentCount + 1 : currentCount;
};

export const getNewPluginState = ({
	now,
	intentToStartEditTime,
	shouldPersistActiveSession,
	tr,
	pluginState,
	oldState,
	newState,
}: {
	intentToStartEditTime: number;
	newState: EditorState;
	now: number;
	oldState: EditorState;
	pluginState: MetricsState;
	shouldPersistActiveSession: boolean;
	tr: ReadonlyTransaction;
}) => {
	const {
		actionTypeCount,
		timeOfLastTextInput,
		totalActionCount,
		previousTrType,
		safeInsertCount,
		contentSizeChanged,
	} = pluginState;

	const newPluginState = {
		...pluginState,
		activeSessionTime: now - intentToStartEditTime,
		contentSizeChanged:
			contentSizeChanged + Math.abs(newState.doc.content.size - oldState.doc.content.size),
		intentToStartEditTime,
		shouldPersistActiveSession,
	};

	const trType = checkTrActionType(tr);
	const newSafeInsertCount = getNewActionTypeCount(
		isSafeInsert(tr, oldState.tr.selection.from, trType?.type),
		safeInsertCount,
	);
	const newUndoCount = getNewActionTypeCount(isNonTextUndo(tr), actionTypeCount.undoCount);

	if (!trType) {
		return {
			...newPluginState,
			totalActionCount: totalActionCount + 1,
			timeOfLastTextInput: undefined,
			actionTypeCount: {
				...actionTypeCount,
				undoCount: newUndoCount,
			},
			previousTrType: trType,
			safeInsertCount: newSafeInsertCount,
		};
	}

	// Below are conditions for special cases which should not increase action count if the previous action was the same or was textInput
	// Check if tr is updating the same status node
	const isNotNewStatus =
		trType.type === ActionType.UPDATING_STATUS &&
		previousTrType?.type === ActionType.UPDATING_STATUS &&
		trType?.extraData?.statusId === previousTrType?.extraData?.statusId;

	// Check if tr is adding text after adding a list node
	const isAddingTextToListNode =
		trType.type === ActionType.TEXT_INPUT && checkIsDesiredAction(previousTrType, listActions);

	// Check if tr is adding new list item after text input
	const isAddingNewListItemAfterTextInput =
		previousTrType?.type === ActionType.TEXT_INPUT &&
		trType.type === ActionType.UPDATING_NEW_LIST_TYPE_ITEM;

	// Check if tr is textInput
	const isTextInput = textInputActions.includes(trType.type);

	// Don't increment action count if tr is text input, not a new status, adding text to list node or adding new list item if timeOfLastTextInput is set
	const shouldNotIncrementActionCount =
		timeOfLastTextInput &&
		(isTextInput || isNotNewStatus || isAddingTextToListNode || isAddingNewListItemAfterTextInput);

	const newTotalActionCount = getNewActionTypeCount(
		!shouldNotIncrementActionCount,
		totalActionCount,
	);

	// Increment textInputCount if tr is text input and previous action was not text input or list action
	const newTextInputCount = getNewActionTypeCount(
		isTextInput &&
			!(
				timeOfLastTextInput &&
				checkIsDesiredAction(previousTrType, [...textInputActions, ...listActions])
			),
		actionTypeCount.textInputCount,
	);

	const newNodeAttrCount = getNewActionTypeCount(
		trType?.type === ActionType.CHANGING_ATTRS,
		actionTypeCount.nodeAttributeChangeCount,
	);

	const isRepeatedAttrAction =
		trType?.type === ActionType.CHANGING_ATTRS &&
		previousTrType?.type === ActionType.CHANGING_ATTRS &&
		trType.extraData.attr === previousTrType.extraData.attr &&
		trType.extraData.from === previousTrType.extraData.from &&
		trType.extraData.to === previousTrType.extraData.to;

	const newRepeatedActionCount = getNewActionTypeCount(
		isRepeatedAttrAction,
		pluginState.repeatedActionCount,
	);

	const contentMoved = getNewActionTypeCount(
		trType?.type === ActionType.MOVING_CONTENT,
		actionTypeCount.contentMovedCount,
	);

	const newMarkChangeCount = getNewActionTypeCount(
		trType?.type === ActionType.CHANGING_MARK,
		actionTypeCount.markChangeCount,
	);

	const newContentDeletedCount = getNewActionTypeCount(
		trType?.type === ActionType.DELETING_CONTENT,
		actionTypeCount.contentDeletedCount,
	);

	// timeOfLastTextInput should be set if tr includes continuous text input on the same node
	const shouldSetTimeOfLastTextInput = continuousActions.includes(trType.type) || isNotNewStatus;

	return {
		...newPluginState,
		totalActionCount: newTotalActionCount,
		timeOfLastTextInput: shouldSetTimeOfLastTextInput ? now : undefined,
		actionTypeCount: {
			...actionTypeCount,
			textInputCount: newTextInputCount,
			undoCount: newUndoCount,
			nodeAttributeChangeCount: newNodeAttrCount,
			contentMovedCount: contentMoved,
			markChangeCount: newMarkChangeCount,
			contentDeletedCount: newContentDeletedCount,
		},
		previousTrType: trType,
		repeatedActionCount: newRepeatedActionCount,
		safeInsertCount: newSafeInsertCount,
	};
};
