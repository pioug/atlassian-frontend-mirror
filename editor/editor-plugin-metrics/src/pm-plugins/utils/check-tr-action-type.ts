import { BatchAttrsStep, InsertTypeAheadStep, LinkMetaStep } from '@atlaskit/adf-schema/steps';
import { type Slice, type Mark } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import {
	AddMarkStep,
	AttrStep,
	RemoveMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	Step,
} from '@atlaskit/editor-prosemirror/transform';

type Attrs = Record<string, unknown>;

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
}

type AttrChangeActionData = { attr: string; from: number; to: number };

interface DetailedReplaceStep extends ReplaceStep {
	from: number;
	to: number;
	slice: Slice;
}

export type TrActionType =
	| { type: ActionType.UPDATING_STATUS; extraData: { statusId: string } }
	| { type: ActionType.CHANGING_MARK; extraData: { markType: string; from: number; to: number } }
	| { type: ActionType.CHANGING_ATTRS; extraData: AttrChangeActionData }
	| {
			type: Exclude<
				ActionType,
				ActionType.CHANGING_ATTRS | ActionType.CHANGING_MARK | ActionType.UPDATING_STATUS
			>;
	  }
	| undefined;

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

const compareAttributes = (prevAttr: Attrs, newAttr: Attrs): string | undefined => {
	const allKeys = new Set([...Object.keys(prevAttr), ...Object.keys(newAttr)]);

	for (const key of allKeys) {
		const prevValue = prevAttr[key];
		const newValue = newAttr[key];
		if (prevValue !== newValue) {
			return key;
		}
	}
	return undefined;
};

const compareMarks = (
	prevMarks: readonly Mark[],
	newMarks: readonly Mark[],
): string | undefined => {
	if (!prevMarks && !newMarks) {
		return undefined;
	}
	const previousMarksArr = new Map(prevMarks.map((mark) => [mark.type.name, mark.attrs]));
	const newMarksArr = new Map(newMarks.map((mark) => [mark.type.name, mark.attrs]));
	const allMarks = new Set([...previousMarksArr.keys(), ...newMarksArr.keys()]);

	for (const key of allMarks) {
		const previousValue = previousMarksArr.get(key);
		const newValue = newMarksArr.get(key);
		if (JSON.stringify(previousValue) !== JSON.stringify(newValue)) {
			return key;
		}
	}

	return undefined;
};

const detectNodeAttributeChange = (
	tr: ReadonlyTransaction,
	step: ReplaceAroundStep | ReplaceStep,
): AttrChangeActionData | undefined => {
	const { from, slice, to } = step;
	const oldNode = tr.docs[0].nodeAt(from);
	const newNode = slice.content.firstChild;

	if (!oldNode || !newNode) {
		return;
	}

	const changedAttr = compareAttributes(oldNode.attrs, newNode.attrs);
	if (changedAttr) {
		return { attr: changedAttr, from, to };
	}

	const changedMarks = compareMarks(oldNode.marks, newNode.marks);
	if (changedMarks) {
		return { attr: changedMarks, from, to };
	}
	return undefined;
};

const isUpdatingListTypeNode = (
	step: ReplaceStep | ReplaceAroundStep,
): ActionType.INSERTING_NEW_LIST_TYPE_NODE | ActionType.UPDATING_NEW_LIST_TYPE_ITEM | false => {
	const { slice } = step;
	const childCount = slice.content.childCount;

	if (childCount < 1) {
		return false;
	}

	for (const node of slice.content.content) {
		const isListTypeNode = [
			'decisionList',
			'decisionItem',
			'bulletList',
			'listItem',
			'orderedList',
			'taskList',
			'taskItem',
		].includes(node.type.name);
		if (isListTypeNode) {
			return childCount === 1
				? ActionType.INSERTING_NEW_LIST_TYPE_NODE
				: ActionType.UPDATING_NEW_LIST_TYPE_ITEM;
		}
	}

	return false;
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

const isResizingColumns = (tr: ReadonlyTransaction): AttrChangeActionData | undefined => {
	const COL_WIDTH_ATTR = 'colwidth';
	const steps = tr.steps;
	const resizingColumnStep = steps.find(
		(step: Step) => step instanceof AttrStep || step instanceof BatchAttrsStep,
	);

	if (!resizingColumnStep) {
		return undefined;
	}

	let pos: number | undefined;

	// BatchAttrsStep is used for resizing columns in tables
	if (resizingColumnStep instanceof BatchAttrsStep) {
		const { attrs, nodeType, position } = resizingColumnStep.data[0];

		if (['tableHeader', 'tableCell'].includes(nodeType) && attrs?.[COL_WIDTH_ATTR]) {
			pos = position;
		}
	} else if (resizingColumnStep instanceof AttrStep && resizingColumnStep.attr === COL_WIDTH_ATTR) {
		pos = resizingColumnStep.pos;
	}

	if (!pos) {
		return undefined;
	}

	const $pos = tr.doc.resolve(pos);
	const blockRange = $pos.blockRange();

	if (!blockRange) {
		return undefined;
	}

	const from = blockRange.start;
	const to = from + blockRange.parent.content.size;

	return { attr: COL_WIDTH_ATTR, from, to };
};

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

	const isResizingCol = isResizingColumns(tr);
	if (isResizingCol) {
		return { type: ActionType.CHANGING_ATTRS, extraData: isResizingCol };
	}

	const [firstStep] = tr.steps;

	const isReplaceStep = firstStep instanceof ReplaceStep;
	const isReplaceAroundStep = firstStep instanceof ReplaceAroundStep;

	if (firstStep instanceof AddMarkStep || firstStep instanceof RemoveMarkStep) {
		return {
			type: ActionType.CHANGING_MARK,
			extraData: { markType: firstStep.mark.type.name, from: firstStep.from, to: firstStep.to },
		};
	}

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

	const nodeAttributeChange = detectNodeAttributeChange(tr, firstStep);

	if (nodeAttributeChange) {
		return { type: ActionType.CHANGING_ATTRS, extraData: nodeAttributeChange };
	}

	return undefined;
};
