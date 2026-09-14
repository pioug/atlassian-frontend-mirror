import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';
import { AddMarkStep, RemoveMarkStep, type StepMap } from '@atlaskit/editor-prosemirror/transform';

import type { DiffStepAttribution } from '../../../showDiffPluginType';
import { getAttributionKey } from '../colorSchemes/attributions';

import { mapStepRangeToFinal } from './mapStepRangeToFinal';

type StepRange = {
	attributionKey?: string;
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

export const getMarkChangeRanges = (
	steps: ProseMirrorStep[],
	stepAttributions: Array<DiffStepAttribution | undefined> = [],
	stepMaps: StepMap[] = [],
): StepRange[] => {
	const resultRanges: StepRange[] = [];
	let lastOp: MarkStep | undefined;

	for (const [stepIndex, step] of steps.entries()) {
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
			const finalRange = mapStepRangeToFinal(op.from, op.to, stepIndex, stepMaps);
			if (!finalRange) {
				lastOp = op;
				continue;
			}
			resultRanges.push({
				attributionKey: getAttributionKey(stepAttributions[stepIndex]),
				fromB: finalRange.fromB,
				toB: finalRange.toB,
			});
		}

		lastOp = op;
	}

	return resultRanges;
};
