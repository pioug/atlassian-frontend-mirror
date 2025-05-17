import type { InteractionMetrics } from '../../common';

function getInteractionStatus(interaction: InteractionMetrics) {
	let originalInteractionStatus = interaction.abortReason ? 'ABORTED' : 'SUCCEEDED';
	const hasErrors = interaction.errors.length > 0;

	originalInteractionStatus = hasErrors ? 'FAILED' : originalInteractionStatus;

	// `overrideStatus` is to be deprecated - https://product-fabric.atlassian.net/browse/AFO-3760
	return { originalInteractionStatus, overrideStatus: originalInteractionStatus } as const;
}

export default getInteractionStatus;
