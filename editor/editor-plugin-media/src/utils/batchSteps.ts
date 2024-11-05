import { BatchAttrsStep, type BatchAttrsStepData } from '@atlaskit/adf-schema/steps';
import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Applies a batch of attribute update steps to media nodes in the editor view.
 *
 * @param {EditorView} editorView - The editor view instance where the updates will be applied.
 * @param {BatchAttrsStepData[]} steps - An array of steps containing the positions and new attributes for media nodes.
 * @returns {boolean} - Returns false if no steps were applied or if the document remains unchanged after applying the steps.
 *
 * This function performs the following steps:
 * 1. Creates a new transaction from the current editor state.
 * 2. If there are no steps to apply, it returns false.
 * 3. Adds a new `BatchAttrsStep` to the transaction with the provided steps.
 * 4. If the transaction has no steps or the document remains unchanged, it returns false.
 * 5. Dispatches the transaction to apply the updates to the editor view.
 *
 * TODO: use pluginInjectionAPI to batch updates from a command in a separate PR later
 */
export const batchStepsUpdate = (editorView: EditorView, steps: BatchAttrsStepData[]) => {
	const { state, dispatch } = editorView;
	const tr = state.tr;
	if (steps.length === 0) {
		return false;
	}

	tr.step(new BatchAttrsStep(steps));
	if (tr.steps.length > 0 && tr.doc.eq(state.doc)) {
		return false;
	}
	tintDirtyTransaction(tr);
	dispatch(tr);
};
