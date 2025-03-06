import type { InteractionMetrics } from '../../common';

/**
 * Determines the interaction status based on abort reason and BM3 TTI presence.
 *
 * @param {InteractionMetrics} interaction - The interaction metrics object containing abort reason and apdex data
 * @returns {{
 *   originalInteractionStatus: 'ABORTED' | 'SUCCEEDED',
 *   overrideStatus: 'ABORTED' | 'SUCCEEDED'
 * }} An object containing both the original and override status
 *
 * @description
 * This function evaluates the interaction status in two ways:
 * 1. originalInteractionStatus: Based on whether there's an abort reason
 * 2. overrideStatus: Based on the presence of BM3 TTI (apdex data)
 *
 * @example
 * const interaction = {
 *   abortReason: null,
 *   apdex: [1, 2, 3]
 * };
 * const result = getInteractionStatus(interaction);
 * // Returns: { originalInteractionStatus: 'SUCCEEDED', overrideStatus: 'SUCCEEDED' }
 */
export default function getInteractionStatus(interaction: InteractionMetrics) {
	const originalInteractionStatus = interaction.abortReason ? 'ABORTED' : 'SUCCEEDED';

	const hasBm3TTI = interaction.apdex.length > 0;
	const overrideStatus = hasBm3TTI ? 'SUCCEEDED' : originalInteractionStatus;

	return { originalInteractionStatus, overrideStatus } as const;
}
