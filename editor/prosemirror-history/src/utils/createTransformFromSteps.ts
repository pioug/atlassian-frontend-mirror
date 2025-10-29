import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { Transform } from '@atlaskit/editor-prosemirror/transform';

export class InvertableStep {
	constructor(
		readonly step: ProseMirrorStep,
		readonly inverted: ProseMirrorStep,
	) {}
}

/**
 * Creates a ProseMirror transform from an array of steps.
 * @param steps - The array of steps to include in the transform.
 * @param doc - The document to base the transform on.
 * @returns The created transform.
 */
export function createTransformFromSteps(steps: InvertableStep[], finalDoc: PMNode): Transform {
	for (const step of steps.slice().reverse()) {
		try {
			const result = step.inverted.apply(finalDoc);
			if (result.failed === null && result.doc) {
				finalDoc = result.doc;
			}
		} catch (e) {
			//TODO: EDITOR-2471 - Log the error
		}
	}

	let tr = new Transform(finalDoc);
	for (const step of steps) {
		try {
			tr = tr.step(step.step);
		} catch (e) {
			//TODO: EDITOR-2471 - Log the error
		}
	}
	return tr;
}

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
