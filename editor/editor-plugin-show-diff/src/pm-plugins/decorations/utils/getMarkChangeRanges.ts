import {
	type Step as ProseMirrorStep,
	AddMarkStep,
	RemoveMarkStep,
} from '@atlaskit/editor-prosemirror/transform';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type StepRange = {
	fromB: number;
	toB: number;
};

type MarkStep = { from: number; markName: string; to: number; type: 'add' | 'remove' };

const filterUndefined = (x: StepRange | undefined): x is StepRange => !!x;

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
	if (!expValEquals('platform_editor_deduplicate_mark_diff', 'isEnabled', true)) {
		return steps
			.map((step) => {
				if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
					return { fromB: step.from, toB: step.to };
				}
				return undefined;
			})
			.filter(filterUndefined);
	}

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
