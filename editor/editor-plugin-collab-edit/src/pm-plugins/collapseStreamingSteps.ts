import { STREAMING_COLLAPSIBLE_STEPS } from '@atlaskit/editor-common/collab-streaming-step-collapse';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';
import { Rebaseable } from '@atlaskit/prosemirror-collab';

import { mergeOverlappingSteps } from './mergeOverlappingSteps';

/**
 * Is this step an intermediate frame that its producer has marked as collapsible, and is it still
 * free to be composed?
 */
const isCollapsibleFrame = (rebaseable: Rebaseable): boolean => {
	const { origin } = rebaseable;

	if (!(origin instanceof Transaction) || origin.getMeta(STREAMING_COLLAPSIBLE_STEPS) !== true) {
		return false;
	}

	// Already sent to (or queued for) the collab service — composing it now would change a step the
	// backend has already seen. Mirrors the `mergeIsLocked` contract in `mergeUnconfirmedSteps`.
	return !origin.getMeta('mergeIsLocked');
};

/**
 * Starting document of each composed step this module has produced.
 *
 * A composed step is synthesised rather than taken from a transaction, so it cannot be found in
 * `origin.steps` and its starting document cannot be recovered the way an original frame's can.
 * `transformUnconfirmed` runs once per transaction and is handed back the steps it returned last
 * time, so the composed step needs to carry its document forward to keep composing against later
 * frames.
 *
 * Keyed on the step rather than its Rebaseable wrapper. `mergeUnconfirmedSteps` runs immediately
 * after this module in `transformUnconfirmed` and rebuilds every wrapper it is given — merging
 * enabled or not — so a wrapper-keyed entry would be unreachable by the very next pass. The step
 * survives that rebuild untouched, and is still replaced whenever the association genuinely
 * becomes stale: `rebaseSteps` maps steps into new objects, and a real merge composes a new one.
 */
const composedStepDocs = new WeakMap<ProseMirrorStep, PMNode>();

/**
 * The document this step was applied to.
 *
 * `transformUnconfirmed` is handed steps and nothing else, but a Rebaseable keeps a reference to
 * the transaction that produced it, and a transaction records the document before each of its
 * steps. That is enough for `mergeOverlappingSteps` to resolve merges it cannot derive from the
 * steps alone — notably a frame that replaces more than just what the previous frame inserted.
 *
 * Rebasing maps a step into a new object while keeping the original transaction, so a rebased step
 * is not found in `origin.steps` and correctly yields no document. `mergeOverlappingSteps` then
 * falls back to the merges it can prove without one.
 */
const docBeforeStep = (rebaseable: Rebaseable): PMNode | undefined => {
	const { origin, step } = rebaseable;

	const composed = composedStepDocs.get(step);
	if (composed) {
		return composed;
	}

	const index = origin.steps.indexOf(step);

	return index >= 0 ? origin.docs[index] : undefined;
};

/**
 * Compose adjacent streaming frames in the unconfirmed queue so the collab service receives one
 * step per flush instead of one step per rendered chunk.
 *
 * This runs in the collab plugin's `transformUnconfirmed` hook, which fires *after* each frame has
 * already been applied to the document. Collapsing therefore has no effect on what the local user
 * sees, on undo history, or on any other plugin state — it only changes what is sent to the collab
 * service, and what is used as the rebase buffer when remote steps arrive.
 *
 * Because the unconfirmed steps double as the rebase buffer (`rebaseSteps` applies their inverses
 * to the live document), the composition must be exact. `mergeOverlappingSteps` only returns a
 * merge it can prove exact, and this function degrades to a no-op whenever it declines.
 *
 * @param steps Rebaseable steps
 * @returns Rebaseable steps, with adjacent streaming frames composed
 */
export function collapseStreamingSteps(steps: Rebaseable[]): Rebaseable[] {
	// Fast path: nothing to do unless at least two frames could possibly compose.
	if (steps.length < 2) {
		return steps;
	}

	const collapsed: Rebaseable[] = [];
	// The document the run currently at the tail of `collapsed` started from. A composed step
	// still applies to the document its first frame applied to, so this survives each merge.
	let runDocBefore: PMNode | undefined;

	for (const rebaseable of steps) {
		const previous = collapsed[collapsed.length - 1];

		if (!previous || !isCollapsibleFrame(previous) || !isCollapsibleFrame(rebaseable)) {
			collapsed.push(rebaseable);
			runDocBefore = docBeforeStep(rebaseable);
			continue;
		}

		const merged = mergeOverlappingSteps(previous, rebaseable, runDocBefore);

		if (!merged) {
			collapsed.push(rebaseable);
			runDocBefore = docBeforeStep(rebaseable);
			continue;
		}

		// Keep the earliest origin, matching `mergeUnconfirmedSteps`. `commitUnconfirmedSteps` in
		// the collab provider tracks completion by origin identity, so keeping the earliest means
		// the composed step is not considered confirmed until the whole run has been acknowledged.
		const composed = new Rebaseable(merged.step, merged.inverted, previous.origin);

		if (runDocBefore) {
			composedStepDocs.set(composed.step, runDocBefore);
		}

		collapsed[collapsed.length - 1] = composed;
	}

	return collapsed;
}
