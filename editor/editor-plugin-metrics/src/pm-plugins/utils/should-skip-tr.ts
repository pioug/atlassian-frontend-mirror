import { InsertTypeAheadStep, LinkMetaStep } from '@atlaskit/adf-schema/steps';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';

const isResolvingLink = (tr: ReadonlyTransaction): boolean => {
	// When links are added, there are two transactions that are fired and we want to ignore the last one where the link is resolved
	const linkStep = tr.steps.find((step: Step) => step instanceof LinkMetaStep);
	const hasReplaceStep = tr.steps.some((step: Step) => step instanceof ReplaceStep);

	return Boolean(
		hasReplaceStep &&
			linkStep instanceof LinkMetaStep &&
			linkStep.getMetadata()?.cardAction === 'RESOLVE',
	);
};

const checkTypeAheadStepStage = (tr: ReadonlyTransaction): string | boolean => {
	// When nodes are inserted from typeahead, there are multiple transactions that are fired that changes the document
	// We want to ignore all but the last transaction where the node is inserted
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
	if (isResolvingLink(tr)) {
		return true;
	}

	const typeAheadStepStage = checkTypeAheadStepStage(tr);

	if (typeAheadStepStage) {
		return typeAheadStepStage !== 'INSERTING_ITEM';
	} else {
		// Ignore all appended transactions apart from when typeahead is inserting an item
		return tr.getMeta('appendedTransaction');
	}
};
