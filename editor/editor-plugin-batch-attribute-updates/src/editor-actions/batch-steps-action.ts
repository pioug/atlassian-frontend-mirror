import { BatchAttrsStep, SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { BatchAttrsStepData } from '@atlaskit/adf-schema/steps';
import { AttrStep, type Step } from '@atlaskit/editor-prosemirror/transform';

import type { BatchStepsAction } from '../batchAttributeUpdatesPluginType';

type AttributeData = {
	attrs: Record<string, unknown>;
	position: number;
};
export const parseStepAttributeData = (step: SetAttrsStep | AttrStep): AttributeData => {
	if (step instanceof SetAttrsStep) {
		return {
			position: step.pos,
			attrs: step.attrs as Record<string, unknown>,
		};
	}

	return {
		position: step.pos,
		attrs: {
			[step.attr]: step.value,
		},
	};
};

type GroupedAttributeData = Array<AttributeData>;
export const groupAttributesPerPosition = (
	steps: Array<SetAttrsStep | AttrStep>,
): GroupedAttributeData => {
	const mappedData = steps.reduce<Map<number, Record<string, unknown>>>((acc, step) => {
		const parsedStep = parseStepAttributeData(step);
		const previousAttributes = acc.get(parsedStep.position) || {};

		acc.set(parsedStep.position, {
			...previousAttributes,
			...parsedStep.attrs,
		});

		return acc;
	}, new Map());

	return Array.from(mappedData, ([position, attrs]) => ({
		position,
		attrs,
	}));
};

const isValidSteps = (steps: Array<Step>): steps is Array<SetAttrsStep | AttrStep> => {
	const hasInvalidSteps = steps.some((step) => {
		const isSetAttrsStep = step instanceof SetAttrsStep;
		const isAttrStep = step instanceof AttrStep;
		const isValidStep = isSetAttrsStep || isAttrStep;

		return !isValidStep;
	});

	return !hasInvalidSteps;
};
/**
 * Batches a series of attribute steps into a single `BatchAttrsStep`.
 *
 * This function takes a document and an array of steps, which should be instances of either
 * `SetAttrsStep` or `AttrStep`. It groups these steps by their position within the document
 * and aggregates their attributes. It then creates a `BatchAttrsStep` that applies all these
 * attribute changes at once.
 *
 * @param {Object} props - The properties required to batch steps.
 * @param {PMNode} props.doc - The ProseMirror document node in which the steps will be applied.
 * @param {Array<AttrStep | SetAttrsStep> | Array<Step>} props.steps - An array of steps that modify attributes.
 *
 * @returns {BatchAttrsStep} - A `BatchAttrsStep` that encapsulates all the attribute changes.
 *
 * @throws {Error} - Throws an error if any step in the steps array is not an attribute-related step.
 * @throws {Error} - Throws an error if a node does not exist at a given step position.
 */
export const batchSteps: BatchStepsAction = ({ doc, steps: maybeAttrSteps }) => {
	if (!isValidSteps(maybeAttrSteps)) {
		// This is important to avoid any bad usage to ending up with data loss
		throw new Error('BatchAttrsSteps error: Invalid BatchStep usage - non attribute step used');
	}

	const positionsAndAttributesData = groupAttributesPerPosition(maybeAttrSteps);

	const data: Array<BatchAttrsStepData> = positionsAndAttributesData.map(({ position, attrs }) => {
		const maybeNode = doc.nodeAt(position);

		if (!maybeNode) {
			throw new Error(`BatchAttrsSteps error: Node does not exist at the position ${position}.`);
		}
		const nodeType = maybeNode.type.name;

		return {
			position,
			attrs,
			nodeType,
		};
	});

	return new BatchAttrsStep(data);
};
