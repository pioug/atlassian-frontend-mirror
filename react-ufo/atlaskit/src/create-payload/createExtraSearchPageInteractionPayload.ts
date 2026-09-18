import type { InteractionMetrics } from '../common';
import { createInteractionMetricsPayload } from './createInteractionMetricsPayload';
import type { InteractionMetricsPayloadResult } from './InteractionMetricsPayloadResult';
import getVCMetrics from './utils/get-vc-metrics';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export async function createExtraSearchPageInteractionPayload(
	interactionId: string,
	interaction: InteractionMetrics,
): Promise<InteractionMetricsPayloadResult[]> {
	const SAIN_HOLD_NAMES = [
		'search-ai-dialog-visible-text-loading',
		'search-ai-dialog-all-text-loading',
	];

	const NAME_OVERRIDE = 'search-page-ignoring-smart-answers';

	const SEARCH_PAGE_SMART_ANSWERS_SEGMENT_LABEL = 'search-page-smart-answers';

	const newInteractionId = `${interactionId}-ignoring-smart-answers`;

	// Calculate a new end time which excludes SAIN holds
	let newEnd: number | undefined;

	const { holdInfo, reactProfilerTimings } = interaction;
	const lastHold = holdInfo.at(-1);
	const isLastHoldSAIN = Boolean(lastHold && SAIN_HOLD_NAMES.includes(lastHold.name));

	// A new end time is only calculated if the last hold is a SAIN hold
	if (isLastHoldSAIN) {
		let lastFilteredTime: number | null = null;

		const filteredReactProfilerTimings = reactProfilerTimings.filter((timing) => {
			if (timing.commitTime === lastFilteredTime) {
				return false;
			}

			const isTimingSmartAnswersInSearch = timing.labelStack.some(
				(label) => label.name === SEARCH_PAGE_SMART_ANSWERS_SEGMENT_LABEL,
			);

			if (isTimingSmartAnswersInSearch) {
				lastFilteredTime = timing.commitTime;
				return false;
			}

			return true;
		});

		const lastTiming = filteredReactProfilerTimings.at(-1);
		if (lastTiming) {
			newEnd = lastTiming.commitTime;
		}
	}

	const modifiedInteraction = {
		...interaction,
		end: newEnd ?? interaction.end,
		holdInfo: [],
		knownSegments: [],
		reactProfilerTimings: [],
		ufoName: NAME_OVERRIDE,
	};

	const vcMetrics = await getVCMetrics(interaction, false, true);

	const interactionMetricsPayload = await createInteractionMetricsPayload(
		modifiedInteraction,
		newInteractionId,
		vcMetrics,
	);

	return [interactionMetricsPayload];
}
