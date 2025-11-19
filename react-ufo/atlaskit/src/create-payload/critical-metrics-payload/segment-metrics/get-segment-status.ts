import type { InteractionMetrics, LabelStack } from '../../../common';
import getInteractionStatus from '../../utils/get-interaction-status';

import getSegmentId from './get-segment-id';
import hasSegmentFailed from './has-segment-failed';
import isLabelStackUnderSegment from './is-label-stack-under-segment';

export default function getSegmentStatus(
	interaction: InteractionMetrics,
	segment: { labelStack: LabelStack },
): {
	status: string;
	abortReason: string | undefined;
} {
	const segmentId = getSegmentId(segment.labelStack);

	// Get the root interaction status info
	const rootInteractionStatus = getInteractionStatus(interaction);
	const rootStatus = rootInteractionStatus.originalInteractionStatus;
	const rootAbortReason = interaction.abortReason;

	const isInteractionsAbortedByNewInteraction =
		rootStatus === 'ABORTED' && rootAbortReason === 'new_interaction';
	const isInteractionsAbortedByTransition =
		rootStatus === 'ABORTED' && rootAbortReason === 'transition';

	let status = 'SUCCEEDED';
	let abortReason: string | undefined;

	// Check if this specific segment has failed
	if (segmentId && hasSegmentFailed(interaction.errors, segmentId)) {
		status = 'FAILED';
	} else if (isInteractionsAbortedByNewInteraction) {
		status = 'ABORTED';
		abortReason = 'new_interaction';
	} else if (isInteractionsAbortedByTransition) {
		status = 'ABORTED';
		abortReason = 'transition';
	} else if (segmentId) {
		// Check for active holds that are under this segment
		for (const activeHold of interaction.holdActive.values()) {
			if (isLabelStackUnderSegment(activeHold.labelStack, segmentId)) {
				status = 'ABORTED';
				abortReason = 'timeout';
				break;
			}
		}
	}

	return { status, abortReason };
}
