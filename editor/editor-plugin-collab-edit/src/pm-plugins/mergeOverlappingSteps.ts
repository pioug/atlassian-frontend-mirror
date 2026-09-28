import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep, Transform } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

/**
 * A step paired with its inverse, as stored in the collab unconfirmed queue.
 */
export type MergeableStep = {
	inverted: Step;
	step: Step;
};

/**
 * `structure` is `@internal` on ReplaceStep but is part of the serialised form, so this is the
 * supported way to read it. Structural replaces exist to stop rebased steps from overwriting
 * content they should not, so they are never merged.
 */
const isStructural = (step: ReplaceStep): boolean => step.toJSON().structure === true;

const asPlainReplaceStep = (step: Step): ReplaceStep | undefined =>
	// Deliberately excludes ReplaceAroundStep — the position arithmetic below is only sound for a
	// plain range replace.
	step instanceof ReplaceStep && !isStructural(step) ? step : undefined;

/**
 * Do the two steps touch the same region of the document?
 *
 * `second` is expressed in the coordinate space *after* `first` has been applied, so `first`'s
 * footprint there is the range its slice occupies: `[from, from + slice.size]`.
 */
const overlaps = (first: ReplaceStep, second: ReplaceStep): boolean => {
	const firstInsertedEnd = first.from + first.slice.size;
	return second.from <= firstInsertedEnd && second.to >= first.from;
};

/**
 * Merge using ProseMirror's own step merging, which handles adjacent insertions and adjacent
 * deletions. Both the steps and their inverses have to merge for the result to be usable as a
 * rebase buffer entry — inverses compose in reverse order.
 */
const mergeNatively = (first: MergeableStep, second: MergeableStep): MergeableStep | null => {
	const step = first.step.merge(second.step);
	if (!step) {
		return null;
	}

	const inverted = second.inverted.merge(first.inverted);
	if (!inverted) {
		return null;
	}

	return { step, inverted };
};

/**
 * Merge any two overlapping steps by applying both to the document and describing the net change
 * as a single minimal replacement.
 *
 * This is the general case: it copes with `second` reaching past `first` on either side, with
 * partial overlaps, and with slices whose open depths differ — none of which can be resolved from
 * the steps alone, because the composed slice has to be cut out of a real document.
 */
const mergeViaDocument = (
	first: MergeableStep,
	second: MergeableStep,
	docBefore: PMNode,
): MergeableStep | null => {
	let docAfter: PMNode;
	try {
		const transform = new Transform(docBefore);
		transform.step(first.step);
		transform.step(second.step);
		docAfter = transform.doc;
	} catch {
		// `docBefore` did not match the steps (for example the steps have since been rebased).
		return null;
	}

	const start = docBefore.content.findDiffStart(docAfter.content);
	if (start === null) {
		// The steps cancel each other out. There is no single step representing "no change", so
		// leave the pair alone rather than inventing one.
		return null;
	}

	const diffEnd = docBefore.content.findDiffEnd(docAfter.content);
	if (!diffEnd) {
		return null;
	}

	// findDiffStart and findDiffEnd can overshoot each other when the same text appears on both
	// sides of the change; push the end out so the range stays well formed.
	let { a: endBefore, b: endAfter } = diffEnd;
	const overshoot = start - Math.min(endBefore, endAfter);
	if (overshoot > 0) {
		endBefore += overshoot;
		endAfter += overshoot;
	}

	const step = new ReplaceStep(start, endBefore, docAfter.slice(start, endAfter));

	// Cheap guarantee that the composition is exact. If it is not, keep the original pair.
	const applied = step.apply(docBefore);
	if (applied.failed !== null || !applied.doc || !applied.doc.eq(docAfter)) {
		return null;
	}

	return { step, inverted: step.invert(docBefore) };
};

/**
 * Merge two consecutive steps into the single step they are collectively equivalent to.
 *
 * `second` must be expressed in the coordinate space produced by `first` — that is, the two must be
 * consecutive steps of the same document. The returned step maps the document from before `first`
 * to after `second`, and the returned inverse maps it back, so the result is safe to use both on
 * the wire and as a rebase buffer entry.
 *
 * Returns `null` whenever the steps do not overlap, or when the merge cannot be proven exact. A
 * `null` result always means "keep the two steps as they are", never "the steps are equivalent to
 * nothing".
 *
 * @param first The earlier step and its inverse.
 * @param second The later step and its inverse.
 * @param docBefore The document `first` applies to. Optional, but without it only ProseMirror's own
 * adjacent-step merges can be resolved, because the composed slice otherwise has to be cut out of a
 * real document. Callers lose it when the queue has been rebased over a remote step.
 */
export function mergeOverlappingSteps(
	first: MergeableStep,
	second: MergeableStep,
	docBefore?: PMNode,
): MergeableStep | null {
	const firstStep = asPlainReplaceStep(first.step);
	const secondStep = asPlainReplaceStep(second.step);

	// Non-plain replaces are only ever merged by ProseMirror itself, which knows the rules for them.
	if (!firstStep || !secondStep) {
		return mergeNatively(first, second);
	}

	if (!overlaps(firstStep, secondStep)) {
		return null;
	}

	// Try the O(1) strategy before the one that has to replay both steps against a document.
	// `transformUnconfirmed` runs on every transaction, and adjacent insertions — which is what
	// consecutive streaming frames often are — are exactly what ProseMirror merges natively.
	const natively = mergeNatively(first, second);
	if (natively) {
		return natively;
	}

	// Anything else needs the document to cut the composed slice out of, so without one there is
	// no merge that can be proven exact.
	return docBefore ? mergeViaDocument(first, second, docBefore) : null;
}
