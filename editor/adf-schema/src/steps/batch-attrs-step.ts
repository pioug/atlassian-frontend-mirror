import { Fragment, type Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Step, StepResult } from '@atlaskit/editor-prosemirror/transform';
import type { Mappable } from '@atlaskit/editor-prosemirror/transform';

export type BatchAttrsStepData = {
	attrs: Record<string, unknown>;
	nodeType: string;
	position: number;
};

const stepType = 'batchAttrs';

const isValidData = (data: Array<Record<string, unknown>>): data is BatchAttrsStepData[] => {
	if (data !== null && !Array.isArray(data)) {
		return false;
	}

	return !data.some((d) => {
		const invalidPosition = typeof d.position !== 'number';
		const invalidNodeType = typeof d.nodeType !== 'string';
		const invalidAttrs = typeof d.attrs !== 'object';

		return invalidPosition || invalidNodeType || invalidAttrs;
	});
};

/**
 * 📢 Public API: Editor FE Platform
 *
 * Represents a step that applies a batch of attribute changes to nodes in a ProseMirror document.
 *
 * This step is particularly useful when you need to update the attributes of multiple nodes in a document
 * in a single operation. For example, you might want to change the color of several panels or update metadata
 * for various sections without needing to perform multiple separate operations.
 *
 * **Use Cases:**
 * - **Efficiency**: Apply multiple attribute changes in a single step to reduce the number of operations.
 * - **Atomicity**: Ensure that a group of attribute changes are applied together, maintaining document consistency.
 * - **Consistency**: Use when changes are logically related, such as updating theme attributes for a document section.
 *
 * **When Not to Use:**
 * - **Single Changes**: If you only need to change attributes on a single node, a more straightforward step might be suitable like `AttrsStep` from prosemirror.
 * - **Complex Node Transformations**: This step is designed for attribute changes rather than structural changes.
 * - **Performance Concerns**: While efficient for batch updates, unnecessary use for single updates may add overhead.
 *
 * @example
 * ```typescript
 * import { BatchAttrsStep } from '@atlaskit/adf-schema/steps';
 *
 * // Define the attribute changes
 * const changes = [
 *   {
 *     position: 0, // Position of the first panel
 *     nodeType: 'panel',
 *     attrs: { panelType: 'error' }
 *   },
 *   {
 *     position: 7, // Position of the second panel
 *     nodeType: 'panel',
 *     attrs: { panelType: 'success' }
 *   }
 * ];
 *
 * // Create the step and apply it to the document
 * const step = new BatchAttrsStep(changes);
 *
 * const tr = editorState.tr;
 *
 * tr.step(step);
 * ```
 *
 * @class
 * @augments {Step}
 */
export class BatchAttrsStep extends Step {
	constructor(
		public data: Array<BatchAttrsStepData>,
		private inverted: boolean = false,
	) {
		super();
	}

	apply(doc: PMNode): StepResult {
		const resultDoc = this.data.reduce((acc, value) => {
			if (!acc.doc || acc.failed) {
				return acc;
			}

			const { position, attrs } = value;

			if ((acc.doc && position > acc.doc.nodeSize) || position < 0) {
				return StepResult.fail(`Position ${position} out of document range.`);
			}

			const target = acc.doc?.nodeAt(position);
			if (!target) {
				return StepResult.fail(`No node at given position: ${position}`);
			}

			if (target.isText) {
				return StepResult.fail('Target is a text node. Attributes are not allowed.');
			}

			const mergedAttrs = {
				...(target.attrs || {}),
				...(attrs || {}),
			};

			const updatedNode = target.type.create(mergedAttrs, null, target.marks);
			const slice = new Slice(Fragment.from(updatedNode), 0, target.isLeaf ? 0 : 1);

			return StepResult.fromReplace(acc.doc, position, position + 1, slice);
		}, StepResult.ok(doc));

		return resultDoc;
	}

	invert(doc: PMNode): BatchAttrsStep {
		const previousData = this.data.reduce((acc, value) => {
			const { position, nodeType, attrs: nextAttrs } = value;

			if (position > doc.nodeSize) {
				return acc;
			}

			const target = doc.nodeAt(position);
			if (!target) {
				return acc;
			}

			if (target.isText) {
				return acc;
			}

			const previousAttrs: Record<string, unknown> = Object.keys(nextAttrs).reduce(
				(attributesIterator, key) => {
					const oldValue = target.attrs[key];

					attributesIterator[key] = oldValue;

					return attributesIterator;
				},
				{} as Record<string, unknown>,
			);

			const prev: BatchAttrsStepData = {
				position,
				nodeType,
				attrs: previousAttrs,
			};
			acc.push(prev);

			return acc;
		}, [] as BatchAttrsStepData[]);

		return new BatchAttrsStep(previousData, true);
	}

	map(mapping: Mappable): BatchAttrsStep | null {
		const mappedData = this.data.reduce((acc, value) => {
			const { position } = value;

			const mappedPosition = mapping.mapResult(position);

			if (mappedPosition.deleted) {
				return acc;
			}

			acc.push({
				...value,
				position: mappedPosition.pos,
			});

			return acc;
		}, [] as BatchAttrsStepData[]);

		if (mappedData.length === 0) {
			return null;
		}

		return new BatchAttrsStep(mappedData, this.inverted);
	}

	toJSON(): {
        data: BatchAttrsStepData[];
        inverted: boolean;
        stepType: string;
    } {
		return {
			stepType,
			data: this.data,
			inverted: this.inverted,
		};
	}

	static fromJSON(
		_schema: Schema,
		json: { data: Array<Record<string, unknown>>; inverted?: boolean },
	): BatchAttrsStep {
		const data = json?.data;
		if (!isValidData(data)) {
			throw new Error('Invalid input for BatchAttrsStep.fromJSON');
		}
		return new BatchAttrsStep(data, Boolean(json.inverted));
	}
}

Step.jsonID(stepType, BatchAttrsStep);
