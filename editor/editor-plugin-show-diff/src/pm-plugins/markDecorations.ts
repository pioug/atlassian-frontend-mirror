import {
	type Step as ProseMirrorStep,
	AddMarkStep,
	RemoveMarkStep,
} from '@atlaskit/editor-prosemirror/transform';

type StepRange = {
	fromB: number;
	toB: number;
};

const filterUndefined = (x: StepRange | undefined): x is StepRange => !!x;

export const getMarkChangeRanges = (steps: ProseMirrorStep[]): StepRange[] => {
	return steps
		.map((step) => {
			if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
				return { fromB: step.from, toB: step.to };
			}
			return undefined;
		})
		.filter(filterUndefined);
};
