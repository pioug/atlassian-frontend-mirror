import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

export const extractSliceFromStep = (step: Step): Slice | null => {
	if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
		return null;
	}

	// @ts-ignore This is by design. Slice is a private property, but accesible, from ReplaceStep.
	// However, we need to read it to found if the step was adding a newline
	const slice = step.slice;

	return slice as Slice;
};
