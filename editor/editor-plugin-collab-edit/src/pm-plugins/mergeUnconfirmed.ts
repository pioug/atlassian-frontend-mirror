import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Rebaseable } from '@atlaskit/prosemirror-collab';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { CollabEditPlugin } from '../collabEditPluginType';

const isLocked = (step: Rebaseable) => {
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
	steps: Rebaseable[],
	api: ExtractInjectionAPI<CollabEditPlugin> | undefined,
): Rebaseable[] {
	const mergedSteps = steps.reduce((acc, rebaseable) => {
		const lastStep = acc[acc.length - 1];

		const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
		const isOnlineMergeEnabled = expValEquals(
			'platform_editor_enable_single_player_step_merging',
			'isEnabled',
			true,
		);
		const isMergingEnabled = isOffline || isOnlineMergeEnabled;

		if (isMergingEnabled && lastStep && !isLocked(lastStep) && !isLocked(rebaseable)) {
			const mergedStep = lastStep.step.merge(rebaseable.step);
			const inverted = rebaseable.inverted.merge(lastStep.inverted);
			// Always take the origin of the new step.
			// We use this in packages/editor/collab-provider/src/document/document-service.ts:commitUnconfirmedSteps
			// to confirm that the last transaction has been sent. Since we're taking the latest this still works as expected
			// As we want to wait until all the transactions have been pushed through
			const origin = lastStep.origin;

			if (mergedStep && inverted) {
				acc[acc.length - 1] = new Rebaseable(
					mergedStep,
					inverted,
					origin instanceof Transaction
						? origin.setMeta('isOffline', origin.getMeta('isOffline') === true || isOffline)
						: origin,
				);
				return acc;
			}
		}
		acc.push(
			new Rebaseable(
				rebaseable.step,
				rebaseable.inverted,
				rebaseable.origin instanceof Transaction
					? rebaseable.origin.setMeta(
							'isOffline',
							rebaseable.origin.getMeta('isOffline') === true || isOffline,
						)
					: rebaseable.origin,
			),
		);
		return acc;
	}, [] as Rebaseable[]);
	return mergedSteps;
}
