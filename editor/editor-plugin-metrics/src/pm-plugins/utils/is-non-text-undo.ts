import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep, Step } from '@atlaskit/editor-prosemirror/transform';

export const isNonTextUndo = (tr: ReadonlyTransaction): boolean => {
	if (tr.getMeta('undoRedoPlugin$') === undefined) {
		return false;
	}

	let hasNonTextChange = false;
	tr.steps.forEach((step: Step) => {
		if (step instanceof ReplaceStep) {
			const { slice } = step;
			if (slice.content) {
				slice.content.forEach((node) => {
					if (node.type.name !== 'text') {
						hasNonTextChange = true;
					}
				});
			}
		} else {
			hasNonTextChange = true;
		}
	});

	return hasNonTextChange;
};
