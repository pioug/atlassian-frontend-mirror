import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type {
	Step as ProseMirrorStep,
	Transform as ProseMirrorTransform,
} from '@atlaskit/editor-prosemirror/transform';

import type { Rebaseable } from './index';

export const mapStep = (
	steps: readonly Rebaseable[],
	transform: ProseMirrorTransform,
	index: number,
	mapped: ProseMirrorStep | null,
) => {
	if (index < 1) {
		return undefined;
	}

	const previousRebaseableStep = steps[index - 1];

	if (
		// This checks the local steps are a "move" sequence
		isMoveSequence(
			previousRebaseableStep.step,
			steps[index].step,
			// Used to get the document prior to step changes
			previousRebaseableStep,
		)
	) {
		const previousStep = transform.steps[transform.steps.length - 1];
		// Creates a new step based on the "current" steps (partially through the rebase)
		return createMoveMapStep(mapped, previousStep, transform);
	}
	return undefined;
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
const isMoveSequence = (
	previousStep: ProseMirrorStep,
	currentStep: ProseMirrorStep,
	previousRebaseable: Rebaseable,
) => {
	if (
		// The both steps are replace
		isReplaceTypeStep(previousStep) &&
		isReplaceTypeStep(currentStep) &&
		// The current step is a deletion
		previousStep.slice.size === 0 &&
		// The following step is an insertion with the same length that was deleted by the current step
		Math.abs(previousStep.to - previousStep.from) === currentStep.slice.size
	) {
		// Ensure we're getting the doc before our step changes so we can compare node contents
		const originStepIndex = previousRebaseable.origin.steps.findIndex((s) => s === previousStep);
		const originalDoc = previousRebaseable.origin.docs[originStepIndex];

		const currentSlice = originalDoc.slice(previousStep.from, previousStep.to);
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
const createMoveMapStep = (
	mapped: ProseMirrorStep | null,
	previousStep: ProseMirrorStep,
	transform: ProseMirrorTransform,
) => {
	if (!isReplaceTypeStep(previousStep) || (mapped && !isReplaceTypeStep(mapped)) || !mapped) {
		return undefined;
	}
	const newSlice = transform.docs[transform.docs.length - 1].slice(
		previousStep?.from,
		previousStep?.to,
	);
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
		transform.docs[transform.docs.length - 1].slice(
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
): { start: number; end: number } | undefined {
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
