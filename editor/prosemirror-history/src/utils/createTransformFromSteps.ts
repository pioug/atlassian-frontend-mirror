import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';

import type { InvertableStep } from './InvertableStep';

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
