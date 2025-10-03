import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Mapping } from '@atlaskit/editor-prosemirror/transform';

/**
 * Rebase `currentTr` over `incomingTr` based on the provided `state`.
 * This function adjusts the steps in `currentTr` to account for the changes made by `incomingTr`.
 *
 * @param currentTr - The transaction to be rebased.
 * @param incomingTr - The transaction that has already been applied to the state.
 * @param state - The editor state after applying `incomingTr`.
 * @returns A new transaction that represents `currentTr` rebased over `incomingTr`.
 */
export const rebaseTransaction = (
	currentTr: Transaction,
	incomingTr: Transaction,
	state: EditorState,
): Transaction => {
	if (!incomingTr.docChanged) {
		return currentTr;
	}

	const currentMapping = new Mapping(incomingTr.mapping.maps);
	const rebasedTransaction = state.tr;

	currentTr.steps.forEach((step) => {
		const mappedStep = step.map(currentMapping);
		if (mappedStep) {
			rebasedTransaction.step(mappedStep);
			currentMapping.appendMap(mappedStep.getMap());
		}
	});

	return rebasedTransaction;
};
