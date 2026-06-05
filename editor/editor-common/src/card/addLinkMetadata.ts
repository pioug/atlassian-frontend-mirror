import type { LinkStepMetadata } from '@atlaskit/adf-schema/steps';
import { LinkMetaStep } from '@atlaskit/adf-schema/steps';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';

/**
 * Records metadata about the user action and input method relating to a transaction
 * as a custom LinkStepMetadata prosemirror step so that it is preserved in
 * the history for undo/redo.
 */
export function addLinkMetadata(
	initialSelection: Selection,
	tr: Transaction,
	metadata: LinkStepMetadata,
): Transaction {
	const { storedMarks } = tr;
	const pos = tr.mapping.map(initialSelection.$from.pos);
	tr.step(new LinkMetaStep(pos, metadata));

	// When you add a new step all the storedMarks are removed it
	if (storedMarks) {
		tr.setStoredMarks(storedMarks);
	}

	return tr;
}
