import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType } from './check-tr-actions/types';

export const isSafeInsert = (
	tr: ReadonlyTransaction,
	insertPos: number,
	trType?: ActionType,
): boolean => {
	// Exclude the cases where trType is defined, as it is a specific action
	// that should not be considered for safe insert actions
	if (trType) {
		return false;
	}

	if (insertPos > tr.doc.content.size) {
		return false;
	}

	const [firstStep] = tr.steps;

	if (!(firstStep instanceof ReplaceStep)) {
		return false;
	}
	const firstStepPos = firstStep.from;

	if (firstStepPos === insertPos) {
		return false;
	}

	const $firstStepPos = tr.doc.resolve(firstStepPos);
	if ($firstStepPos.node().type.name === 'paragraph') {
		return false;
	}

	const firstStepParentNodeType = $firstStepPos.node($firstStepPos.depth)?.type.name;
	const $insertPos = tr.doc.resolve(insertPos);
	const parentNodeType = $insertPos.node($insertPos.depth - 1)?.type.name;
	return parentNodeType !== firstStepParentNodeType;
};
