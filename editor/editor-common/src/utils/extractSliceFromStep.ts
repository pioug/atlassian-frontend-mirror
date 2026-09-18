import type { Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

export const extractSliceFromStep = (step: Step): Slice | null => {
	if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
		return null;
	}

	// However, we need to read it to found if the step was adding a newline
	const slice = step.slice;

	return slice as Slice;
};
