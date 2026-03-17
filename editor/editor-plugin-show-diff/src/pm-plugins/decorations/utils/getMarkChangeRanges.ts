import {
	type Step as ProseMirrorStep,
	AddMarkStep,
	RemoveMarkStep,
} from '@atlaskit/editor-prosemirror/transform';

type StepRange = {
	fromB: number;
	toB: number;
};

type MarkStep = { from: number; markName: string; to: number; type: 'add' | 'remove' };

const extractMarkStep = (step: ProseMirrorStep): MarkStep | undefined => {
	if (step instanceof AddMarkStep) {
		return { type: 'add', from: step.from, to: step.to, markName: step.mark.type.name };
	}
	if (step instanceof RemoveMarkStep) {
		return { type: 'remove', from: step.from, to: step.to, markName: step.mark.type.name };
	}
	return undefined;
};

export const getMarkChangeRanges = (steps: ProseMirrorStep[]): StepRange[] => {
	const resultRanges: StepRange[] = [];
	let lastOp: MarkStep | undefined;

	for (const step of steps) {
		const op = extractMarkStep(step);
		if (!op) {
			continue;
		}

		// Check if previous operation cancels this one
		if (
			lastOp &&
			lastOp.from === op.from &&
			lastOp.to === op.to &&
			lastOp.markName === op.markName &&
			lastOp.type !== op.type
		) {
			resultRanges.pop();
		} else {
			resultRanges.push({ fromB: op.from, toB: op.to });
		}

		lastOp = op;
	}

	return resultRanges;
};
