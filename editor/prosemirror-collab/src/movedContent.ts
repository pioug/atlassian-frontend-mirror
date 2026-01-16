import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { type Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type {
	Step as ProseMirrorStep,
	Transform as ProseMirrorTransform,
} from '@atlaskit/editor-prosemirror/transform';

import type { Rebaseable } from './index';

// Iterate from the specified starting index down to 0
const findPreviousStepInverseIndex = (steps: ProseMirrorStep[], startIndex = steps.length - 1) => {
	for (let i = startIndex; i >= 0; i--) {
		if (!(steps[i] instanceof AnalyticsStep)) {
			return i;
		}
	}
};

export const mapStep = (
	steps: readonly Rebaseable[],
	transform: ProseMirrorTransform,
	index: number,
	mapped: ProseMirrorStep | null,
) => {
	if (index < 1) {
		return undefined;
	}

	const previousRebaseableStepIndex = findPreviousStepInverseIndex(
		steps.map((s) => s.step),
		index - 1,
	);

	// This checks the local steps are a "move" sequence
	if (
		previousRebaseableStepIndex !== undefined &&
		isMoveSequence(steps[previousRebaseableStepIndex], steps[index].step)
	) {
		const previousStepInverseIndex = findPreviousStepInverseIndex(transform.steps);

		// Creates a new step based on the "current" steps (partially through the rebase)
		if (previousStepInverseIndex !== undefined) {
			return createMoveMapStep(
				mapped,
				transform.steps[previousStepInverseIndex],
				transform,
				previousStepInverseIndex,
			);
		}
	}
};

// Only consider ReplaceStep (ReplaceAroundStep do not occur for moves)
const isReplaceTypeStep = (step: ProseMirrorStep): step is ReplaceStep =>
	step instanceof ReplaceStep;

/**
 * Determines if a step pairing is a move sequence (ie. drag + drop or cut + paste).
 *
 * We determine this if we have a deletion followed by insertion and their content matches
 *
 * @param previousStep
 * @param currentStep
 * @param previousRebaseable
 */
export const isMoveSequence = (
	previousRebaseableStep: Rebaseable,
	currentStep: ProseMirrorStep,
): boolean => {
	if (
		// The both steps are replace
		isReplaceTypeStep(previousRebaseableStep.step) &&
		isReplaceTypeStep(currentStep) &&
		// The current step is a deletion
		previousRebaseableStep.step.slice.size === 0 &&
		// The following step is an insertion with the same length that was deleted by the current step
		Math.abs(previousRebaseableStep.step.to - previousRebaseableStep.step.from) ===
			currentStep.slice.size
	) {
		// Ensure we're getting the doc before our step changes so we can compare node contents
		const originStepIndex = previousRebaseableStep.origin.steps.findIndex(
			(s) => s === previousRebaseableStep.step,
		);
		if (originStepIndex === -1) {
			return false;
		}
		const originalDoc = previousRebaseableStep.origin.docs[originStepIndex];
		if (!originalDoc) {
			return false;
		}

		const currentSlice = originalDoc.slice(
			previousRebaseableStep.step.from,
			previousRebaseableStep.step.to,
		);
		// The content from the deleted + inserted slice is exactly the same (cut + paste or drag + drop)
		if (currentSlice.eq(currentStep.slice)) {
			return true;
		}
	}
	return false;
};

/**
 * Update the replace step slice of the insert part of a move
 * to contain the slice of the current document rather than what was sliced originally.
 *
 * @param mapped
 * @param previousStep
 * @param transform
 * @returns Step to apply missing changes
 */
export const createMoveMapStep = (
	mapped: ProseMirrorStep | null,
	previousStep: ProseMirrorStep,
	transform: ProseMirrorTransform,
	previousStepIndex: number,
) => {
	if (
		!isReplaceTypeStep(previousStep) ||
		(mapped && !isReplaceTypeStep(mapped)) ||
		!mapped ||
		// Ensure previous step index is valid
		!(
			previousStepIndex >= 0 &&
			previousStepIndex < transform.docs.length &&
			typeof previousStep?.from === 'number'
		)
	) {
		return undefined;
	}
	const newSlice = transform.docs[previousStepIndex].slice(previousStep?.from, previousStep?.to);
	const diff = getDiffRange(mapped.slice.content, newSlice.content);
	if (diff === undefined) {
		return undefined;
	}
	const start = mapped.from + diff.start;
	const offset =
		newSlice.content.size - mapped.slice.content.size === 0 ? diff.end - diff.start : 0;

	// If the new slice is smaller then we're doing a deletion of content - this needs
	// to be a replace step with empty content to delete content
	if (newSlice.content.size - mapped.slice.content.size < 0) {
		return new ReplaceStep(
			start,
			start + mapped.slice.content.size - newSlice.content.size,
			Slice.empty,
		);
	}

	// Replace the diff range with the latest content in the document (at the old position)
	return new ReplaceStep(
		start,
		start + offset,
		transform.docs[previousStepIndex].slice(
			previousStep?.from + diff.start,
			previousStep?.from + diff.end,
		),
	);
};

/**
 * Get start and end diff position values for two fragments (old, new).
 * @param {Fragment} before - content that is planned to move
 * @param {Fragment} after - content that was in paragraph being deleted (updated content)
 * @returns {object} - { start, end }
 */
function getDiffRange(
	before: Fragment,
	after: Fragment,
): { end: number; start: number } | undefined {
	// https://prosemirror.net/docs/ref/#model.Fragment.findDiffStart
	const start = before.findDiffStart(after);
	// Important: diffEnd value is {a,b} object since end pos will differ.
	// https://prosemirror.net/docs/ref/#model.Fragment.findDiffEnd
	const diffEnd = before.findDiffEnd(after);
	if (start === null || diffEnd === null) {
		return undefined;
	}
	// WARNING: diffEnd may be lower than diffStart.
	// If so, add overlap to get correct range.
	// https://discuss.prosemirror.net/t/overlap-handling-of-finddiffstart-and-finddiffend/2856
	const overlap = start - Math.min(diffEnd.a, diffEnd.b);
	let end = diffEnd.b;
	if (overlap > 0) {
		end += overlap;
	}
	return { start, end };
}
