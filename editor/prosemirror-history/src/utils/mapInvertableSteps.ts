import type { Transform } from '@atlaskit/editor-prosemirror/transform';

import { InvertableStep } from './InvertableStep';

export function mapInvertableSteps(
	steps: InvertableStep[] | undefined,
	tr: Transform,
): InvertableStep[] | undefined {
	if (steps === undefined) {
		return undefined;
	}
	return steps
		.map((step) => {
			const newStep = step.step.map(tr.mapping);
			const newInvertedStep = step.inverted.map(tr.mapping);
			if (newStep && newInvertedStep) {
				return new InvertableStep(newStep, newInvertedStep);
			}
			return undefined;
		})
		.filter((s) => !!s);
}
