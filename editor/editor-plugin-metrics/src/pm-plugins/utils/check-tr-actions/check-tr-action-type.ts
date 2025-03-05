import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { checkContentPastedOrMoved } from './tr-checks/check-content-moved';
import { checkDeletingContent } from './tr-checks/check-deleting-content';
import { checkEmptyLineAddedOrDeleted } from './tr-checks/check-empty-line-added-or-deleted';
import { checkListTypeNodeChanged } from './tr-checks/check-list-type-node-changed';
import { checkMarkChanged } from './tr-checks/check-mark-changed';
import { checkNodeAttributeChanged } from './tr-checks/check-node-attribute-changed';
import { checkStatusChanged } from './tr-checks/check-status-changed';
import { checkTableColumnResized } from './tr-checks/check-table-column-resized';
import { checkTextInput } from './tr-checks/check-text-input';
import { type TrActionType } from './types';

export const checkTrActionType = (tr: ReadonlyTransaction): TrActionType => {
	const stepsLength = tr.steps.length;

	if (stepsLength <= 0) {
		return undefined;
	}

	const contentPastedOrMoved = checkContentPastedOrMoved(tr);
	if (contentPastedOrMoved) {
		return contentPastedOrMoved;
	}

	// Resized column data is either AttrStep or BatchAttrsStep, so we want to check it first
	const resizedColumnData = checkTableColumnResized(tr);
	if (resizedColumnData) {
		return resizedColumnData;
	}

	// Since we are looking at editor actions, we want to look at the first step only
	const [firstStep] = tr.steps;
	const isReplaceStep = firstStep instanceof ReplaceStep;
	const isReplaceAroundStep = firstStep instanceof ReplaceAroundStep;

	// Check if mark is added or removed, this is for text formatting changes
	const marksChanged = checkMarkChanged(firstStep);
	if (marksChanged) {
		return marksChanged;
	}

	// Return early if it's not a replace step or replace around step as following checks are for these steps only
	if (!(isReplaceStep || isReplaceAroundStep)) {
		return undefined;
	}

	if (isReplaceStep) {
		// Check if tr is text input as we want to ignore continuous typing actions
		const textInput = checkTextInput(firstStep);
		if (textInput) {
			return textInput;
		}

		// Check if tr is adding/ removing empty lines as we want to ignore continuous typing actions
		const emptyLineAddedOrDeleted = checkEmptyLineAddedOrDeleted(firstStep);
		if (emptyLineAddedOrDeleted) {
			return emptyLineAddedOrDeleted;
		}

		//Check if tr is removing content
		const isDeletingContent = checkDeletingContent(firstStep);
		if (isDeletingContent) {
			return isDeletingContent;
		}

		// Status nodes save status content in attributes and a new transaction is fired each keypress
		// Check if tr is updating status so we can handle actionCount correctly
		const status = checkStatusChanged(firstStep);
		if (status) {
			return status;
		}
	}

	// Check if tr is updating list type node because we want to ignore continuous typing actions and adding new list items
	const updatingListTypeNode = checkListTypeNodeChanged(firstStep);
	if (updatingListTypeNode) {
		return updatingListTypeNode;
	}

	// Check if tr is updating node attributes so we can track nodeAttributeChangeCount
	const nodeAttributeChange = checkNodeAttributeChanged(tr, firstStep);
	if (nodeAttributeChange) {
		return nodeAttributeChange;
	}

	return undefined;
};
