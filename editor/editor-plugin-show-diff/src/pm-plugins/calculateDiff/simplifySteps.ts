import { AnalyticsStep } from '@atlaskit/adf-schema/steps/analytics';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';

import type { DiffStepAttribution, StepWithAttribution } from '../../showDiffPluginType';
import { getAttributionKey } from '../decorations/colorSchemes/attributions';

type ProseMirrorStepWithAttribution = StepWithAttribution<ProseMirrorStep>;

/**
 * Attempts to merge two consecutive ReplaceStep operations.
 * This merges steps where:
 * - Both steps replace content at the same starting position
 * - The second step's range encompasses the first step's range
 * - The second step has content to insert
 * Returns null if steps cannot be merged.
 */
function mergeReplaceSteps(step1: ProseMirrorStep, step2: ProseMirrorStep): ProseMirrorStep | null {
	if (!(step1 instanceof ReplaceStep) || !(step2 instanceof ReplaceStep)) {
		return null;
	}
	// Confirm the step overlaps exactly with the previous
	const step2Length = step2.to - step2.from;
	if (
		step1.from === step2.from &&
		step2.to >= step1.to &&
		step2.slice.size >= step2Length &&
		step2Length === step1.slice.size &&
		step2.slice.size >= step1.slice.size &&
		step1.slice.openEnd === step2.slice.openEnd &&
		step1.slice.openStart === step2.slice.openStart
	) {
		return new ReplaceStep(step1.from, step1.to, step2.slice);
	}
	return null;
}

// Simplifies the steps to improve performance and reduce fragmentation in diffs
export function simplifySteps(steps: ProseMirrorStep[], originalDoc: PMNode): ProseMirrorStep[] {
	const stepsToFilter = removeUnusedSteps(steps, originalDoc);
	return (
		stepsToFilter
			// Remove steps that don't affect document structure or content
			.filter((step) => !(step instanceof AnalyticsStep))
			// Merge consecutive steps where possible
			.reduce<ProseMirrorStep[]>((acc, step) => {
				const lastStep = acc[acc.length - 1];
				const merged = lastStep?.merge?.(step) ?? mergeReplaceSteps(lastStep, step);
				if (merged) {
					acc[acc.length - 1] = merged;
				} else {
					acc.push(step);
				}
				return acc;
			}, [])
	);
}

const mergeAttributions = (
	first: DiffStepAttribution | undefined,
	second: DiffStepAttribution | undefined,
): DiffStepAttribution | undefined => {
	if (!first) {
		return second;
	}
	if (!second) {
		return first;
	}

	return {
		...first,
		...second,
		wasOffline:
			first.wasOffline === true || second.wasOffline === true
				? true
				: (second.wasOffline ?? first.wasOffline),
	};
};

/**
 * Attribution-preserving variant of `simplifySteps`.
 *
 * Steps may only merge when they have the same effective actor identity. Keeping the attribution
 * coupled to the step also ensures filtering a no-op/analytics step cannot shift array indexes.
 */
export function simplifyStepsWithAttribution(
	steps: ProseMirrorStep[],
	stepAttributions: Array<DiffStepAttribution | undefined>,
	originalDoc: PMNode,
): ProseMirrorStepWithAttribution[] {
	const stepsToFilter = removeUnusedAttributedSteps(
		steps.map((step, index) => ({ step, stepAttribution: stepAttributions[index] })),
		originalDoc,
	);
	return stepsToFilter
		.filter(({ step }) => !(step instanceof AnalyticsStep))
		.reduce<ProseMirrorStepWithAttribution[]>((acc, current) => {
			const previous = acc[acc.length - 1];
			const isSameIdentity =
				previous &&
				getAttributionKey(previous.stepAttribution) === getAttributionKey(current.stepAttribution);
			const merged = isSameIdentity
				? (previous.step.merge?.(current.step) ?? mergeReplaceSteps(previous.step, current.step))
				: null;

			if (merged) {
				acc[acc.length - 1] = {
					step: merged,
					stepAttribution: mergeAttributions(previous.stepAttribution, current.stepAttribution),
				};
			} else {
				acc.push(current);
			}
			return acc;
		}, []);
}

/**
 * Does a first pass to remove steps that don't impact the document
 */
function removeUnusedAttributedSteps(
	stepsWithAttribution: ProseMirrorStepWithAttribution[],
	originalDoc: PMNode,
): ProseMirrorStepWithAttribution[] {
	const finalSteps: ProseMirrorStepWithAttribution[] = [];
	let firstPassDoc = originalDoc;
	for (const stepWithAttribution of stepsWithAttribution) {
		const { step } = stepWithAttribution;
		const result = step.apply(firstPassDoc);
		if (
			result.failed === null &&
			result.doc &&
			!areNodesEqualIgnoreAttrs(firstPassDoc, result.doc, ['localId'])
		) {
			finalSteps.push(stepWithAttribution);
			firstPassDoc = result.doc;
		}
	}
	return finalSteps;
}

/**
 * Does a first pass to remove steps that don't impact the document
 */
function removeUnusedSteps(steps: ProseMirrorStep[], originalDoc: PMNode): ProseMirrorStep[] {
	const finalSteps: ProseMirrorStep[] = [];
	let firstPassDoc = originalDoc;
	for (const step of steps) {
		const result = step.apply(firstPassDoc);
		if (
			result.failed === null &&
			result.doc &&
			!areNodesEqualIgnoreAttrs(firstPassDoc, result.doc, ['localId'])
		) {
			finalSteps.push(step);
			firstPassDoc = result.doc;
		}
	}
	return finalSteps;
}
