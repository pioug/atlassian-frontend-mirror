import { type Slice } from '@atlaskit/editor-prosemirror/model';
import { type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

export interface DetailedReplaceStep extends ReplaceStep {
	from: number;
	slice: Slice;
	to: number;
}

export enum ActionType {
	TEXT_INPUT = 'textInput',
	EMPTY_LINE_ADDED_OR_DELETED = 'emptyLineAddedOrDeleted',
	INSERTED_FROM_TYPE_AHEAD = 'insertedFromTypeAhead',
	INSERTING_NEW_LIST_TYPE_NODE = 'insertingNewListTypeNode',
	UPDATING_NEW_LIST_TYPE_ITEM = 'updatingNewListItem',
	ADDING_LINK = 'addingLink',
	UPDATING_STATUS = 'updatingStatus',
	CHANGING_MARK = 'changingMark',
	CHANGING_ATTRS = 'changingAttrs',
	MOVING_CONTENT = 'contentMoved',
	PASTING_CONTENT = 'contentPasted',
	DELETING_CONTENT = 'deletingContent',
	SAFE_INSERT = 'safeInsert',
	UNDO = 'undo',
}

export type AttrChangeAction = {
	extraData: { attr: string; from: number; to: number };
	type: ActionType.CHANGING_ATTRS;
};

export type MarkChangeAction = {
	type: ActionType.CHANGING_MARK;
};

export type StatusChangeAction = {
	extraData: { statusId: string };
	type: ActionType.UPDATING_STATUS;
};

export type TrAction<
	T extends Exclude<
		ActionType,
		ActionType.CHANGING_ATTRS | ActionType.CHANGING_MARK | ActionType.UPDATING_STATUS
	>,
> = {
	type: T;
};

export type TrActionType =
	| AttrChangeAction
	| MarkChangeAction
	| StatusChangeAction
	| TrAction<ActionType.TEXT_INPUT>
	| TrAction<ActionType.EMPTY_LINE_ADDED_OR_DELETED>
	| TrAction<ActionType.INSERTED_FROM_TYPE_AHEAD>
	| TrAction<ActionType.INSERTING_NEW_LIST_TYPE_NODE>
	| TrAction<ActionType.UPDATING_NEW_LIST_TYPE_ITEM>
	| TrAction<ActionType.ADDING_LINK>
	| TrAction<ActionType.MOVING_CONTENT>
	| TrAction<ActionType.PASTING_CONTENT>
	| TrAction<ActionType.DELETING_CONTENT>
	| TrAction<ActionType.SAFE_INSERT>
	| TrAction<ActionType.UNDO>
	| undefined;
