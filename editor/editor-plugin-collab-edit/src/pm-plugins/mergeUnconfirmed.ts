import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { Transform as ProseMirrorTransform } from '@atlaskit/editor-prosemirror/transform';

import type { CollabEditPlugin } from '../collabEditPluginType';

// Based on: `packages/editor/prosemirror-collab/src/index.ts`
class LockableRebaseable {
	constructor(
		readonly step: ProseMirrorStep,
		readonly inverted: ProseMirrorStep,
		readonly origin: ProseMirrorTransform,
	) {}
}

const isLocked = (step: LockableRebaseable) => {
	if (step.origin instanceof Transaction) {
		return step.origin.getMeta('mergeIsLocked');
	}
	return false;
};

/**
 * Merge a set of steps together to reduce the total number of steps stored in memory.
 *
 * All steps passing through here should be "lockable" (ie. can be locked by the document service)
 * so that it can be indicated they have already been sent (or are about to be sent) to the backend
 * and cannot be merged.
 *
 * @param steps Rebaseable steps
 * @returns Rebaseable steps
 */
export function mergeUnconfirmedSteps(
	steps: LockableRebaseable[],
	api: ExtractInjectionAPI<CollabEditPlugin> | undefined,
): LockableRebaseable[] {
	const mergedSteps = steps.reduce((acc, rebaseable) => {
		const lastStep = acc[acc.length - 1];

		if (
			api?.connectivity?.sharedState.currentState()?.mode === 'offline' &&
			lastStep &&
			!isLocked(lastStep) &&
			!isLocked(rebaseable)
		) {
			const mergedStep = lastStep.step.merge(rebaseable.step);
			const inverted = rebaseable.inverted.merge(lastStep.inverted);
			// Always take the origin of the new step.
			// We use this in packages/editor/collab-provider/src/document/document-service.ts:commitUnconfirmedSteps
			// to confirm that the last transaction has been sent. Since we're taking the latest this still works as expected
			// As we want to wait until all the transactions have been pushed through
			const origin = lastStep.origin;

			if (mergedStep && inverted) {
				acc[acc.length - 1] = new LockableRebaseable(mergedStep, inverted, origin);
				return acc;
			}
		}
		return acc.concat(
			new LockableRebaseable(rebaseable.step, rebaseable.inverted, rebaseable.origin),
		);
	}, [] as LockableRebaseable[]);
	return mergedSteps;
}
