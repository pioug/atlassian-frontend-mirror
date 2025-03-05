import { type Mark } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type DetailedReplaceStep, type AttrChangeAction } from '../types';

type Attrs = Record<string, unknown>;

const compareAttributes = (prevAttr: Attrs, newAttr: Attrs): string | undefined => {
	const allKeys = new Set([...Object.keys(prevAttr), ...Object.keys(newAttr)]);

	for (const key of allKeys) {
		const prevValue = prevAttr[key];
		const newValue = newAttr[key];
		if (prevValue !== newValue && key !== 'localId') {
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

export const checkNodeAttributeChanged = (
	tr: ReadonlyTransaction,
	step: ReplaceAroundStep | ReplaceStep,
): AttrChangeAction | undefined => {
	const { slice, from, to } = step as DetailedReplaceStep;

	const oldNode = tr.docs[0].nodeAt(from);
	const newNode = slice.content.firstChild;
	if (!oldNode || !newNode) {
		return undefined;
	}

	if (oldNode.type.name !== newNode.type.name) {
		return undefined;
	}

	// We need to compare the attributes of the node
	const changedAttr = compareAttributes(oldNode.attrs, newNode.attrs);
	if (changedAttr) {
		return { type: ActionType.CHANGING_ATTRS, extraData: { attr: changedAttr, from, to } };
	}

	// For some changes, we need to compare the marks of the node
	// e.g. Media Border, Links
	const changedMarks = compareMarks(oldNode.marks, newNode.marks);
	if (changedMarks) {
		return { type: ActionType.CHANGING_ATTRS, extraData: { attr: changedMarks, from, to } };
	}

	return undefined;
};
