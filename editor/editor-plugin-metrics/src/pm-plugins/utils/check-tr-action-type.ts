import { InsertTypeAheadStep, LinkMetaStep } from '@atlaskit/adf-schema/steps';
import { type Slice } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, Step } from '@atlaskit/editor-prosemirror/transform';

export enum ActionType {
	TEXT_INPUT = 'textInput',
	EMPTY_LINE_ADDED_OR_DELETED = 'emptyLineAddedOrDeleted',
	INSERTED_FROM_TYPE_AHEAD = 'insertedFromTypeAhead',
	INSERTING_NEW_LIST_TYPE_NODE = 'insertingNewListTypeNode',
	UPDATING_NEW_LIST_TYPE_ITEM = 'updatingNewListItem',
	ADDING_LINK = 'addingLink',
	UPDATING_STATUS = 'updatingStatus',
}

interface DetailedReplaceStep extends ReplaceStep {
	from: number;
	to: number;
	slice: Slice;
}

const isTextInput = (step: ReplaceStep): boolean => {
	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;

	const node = content.firstChild;

	const isAddingCharacter =
		from === to && content.childCount === 1 && !!node && !!node.text && node.text.length === 1;
	const isDeletingCharacter = to - from === 1 && content.childCount === 0;
	return isAddingCharacter || isDeletingCharacter;
};

const isEmptyLineAddedOrDeleted = (step: ReplaceStep): boolean => {
	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;

	const isEmptyLineDeleted = to - from === 2 && content.size === 0;

	if (isEmptyLineDeleted) {
		return true;
	}

	let isEmptyLineAdded = false;
	content.forEach((node) => {
		isEmptyLineAdded = node.type.name === 'paragraph' && node.content.size === 0;
	});

	return isEmptyLineAdded;
};

const isUpdatingListTypeNode = (
	step: ReplaceStep | ReplaceAroundStep,
): ActionType.INSERTING_NEW_LIST_TYPE_NODE | ActionType.UPDATING_NEW_LIST_TYPE_ITEM | false => {
	const { slice } = step;
	const childCount = slice.content.childCount;

	if (childCount < 1) {
		return false;
	}

	let isListTypeNode = false;

	slice.content.forEach((node) => {
		isListTypeNode = [
			'decisionList',
			'decisionItem',
			'bulletList',
			'listItem',
			'orderedList',
			'taskList',
			'taskItem',
		].includes(node.type.name);
	});

	if (!isListTypeNode) {
		return false;
	}

	return childCount === 1
		? ActionType.INSERTING_NEW_LIST_TYPE_NODE
		: ActionType.UPDATING_NEW_LIST_TYPE_ITEM;
};

const isUpdatingStatus = (step: ReplaceStep): string | undefined => {
	const { slice } = step;
	const firstChild = slice.content.firstChild;
	if (!firstChild) {
		return undefined;
	}

	return firstChild.type.name === 'status' && firstChild.attrs.localId;
};

const isAddingLink = (tr: ReadonlyTransaction): boolean => {
	const hasLinkStep = tr.steps.some((step: Step) => step instanceof LinkMetaStep);
	const hasReplaceStep = tr.steps.some((step: Step) => step instanceof ReplaceStep);

	return hasLinkStep && !hasReplaceStep;
};

const isTypeAheadRelatedTr = (tr: ReadonlyTransaction): string | boolean => {
	if (tr.getMeta('typeAheadPlugin$')?.action === 'INSERT_RAW_QUERY') {
		return 'INSERT_RAW_QUERY';
	}

	if (!tr.getMeta('appendedTransaction')) {
		return false;
	}

	const insertTypeAheadStep = tr.steps.find((step: Step) => step instanceof InsertTypeAheadStep);
	const replaceStep = tr.steps.find((step: Step) => step instanceof ReplaceStep);

	if (!insertTypeAheadStep || !replaceStep) {
		return false;
	}

	return insertTypeAheadStep instanceof InsertTypeAheadStep && insertTypeAheadStep.stage;
};

export const shouldSkipTr = (tr: ReadonlyTransaction): boolean => {
	const resolvingLink = isAddingLink(tr);

	if (resolvingLink) {
		return true;
	}

	const typeAheadRelatedTr = isTypeAheadRelatedTr(tr);

	if (typeAheadRelatedTr) {
		return typeAheadRelatedTr !== 'INSERTING_ITEM';
	} else {
		return tr.getMeta('appendedTransaction');
	}
};

export type TrActionType =
	| {
			type: ActionType;
			extraData?: { statusId?: string };
	  }
	| undefined;

export const checkTrActionType = (tr: ReadonlyTransaction): TrActionType => {
	if (tr.getMeta('input_rule_plugin_transaction')) {
		return { type: ActionType.INSERTING_NEW_LIST_TYPE_NODE };
	}

	const stepsLength = tr.steps.length;

	if (stepsLength <= 0) {
		return undefined;
	}

	if (isAddingLink(tr)) {
		return { type: ActionType.ADDING_LINK };
	}

	const [firstStep] = tr.steps;

	const isReplaceStep = firstStep instanceof ReplaceStep;
	const isReplaceAroundStep = firstStep instanceof ReplaceAroundStep;

	if (!isReplaceStep && !isReplaceAroundStep) {
		return undefined;
	}

	if (isReplaceStep) {
		if (isTextInput(firstStep)) {
			return { type: ActionType.TEXT_INPUT };
		}

		if (isEmptyLineAddedOrDeleted(firstStep)) {
			return { type: ActionType.EMPTY_LINE_ADDED_OR_DELETED };
		}

		const statusId = isUpdatingStatus(firstStep);
		if (statusId) {
			return {
				type: ActionType.UPDATING_STATUS,
				extraData: { statusId },
			};
		}
	}
	const updatingListTypeNode = isUpdatingListTypeNode(firstStep);
	if (updatingListTypeNode) {
		return { type: updatingListTypeNode };
	}

	return undefined;
};
