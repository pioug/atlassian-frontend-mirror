import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Mapping } from '@atlaskit/editor-prosemirror/transform';

export const rebaseTransaction = (
	currentTr: Transaction,
	incomingTr: Transaction,
	state: EditorState,
): Transaction => {
	if (!incomingTr.docChanged) {
		return currentTr;
	}

	const currentMapping = new Mapping(
		[...currentTr.mapping.maps].reverse().map((map) => map.invert()),
	);

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
