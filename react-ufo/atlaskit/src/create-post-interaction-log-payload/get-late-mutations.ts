import type { LastInteractionFinishInfo } from '../common';
import { LateMutation } from '../common/react-ufo-payload-schema';
import type { RevisionPayloadVCDetails } from '../common/vc/types';

function getLateMutations(
	vcDetails: RevisionPayloadVCDetails,
	lastInteractionFinish: LastInteractionFinishInfo,
	postInteractionFinishVCRatios: Record<string, number>,
): LateMutation[] {
	// Map to track which elements are already seen for each timestamp
	const seen = new Map<number, Set<string>>();
	const result: LateMutation[] = [];

	for (const part in vcDetails) {
		const details = vcDetails[part];

		if (!details?.t || details.t <= lastInteractionFinish.end || !details.e) {
			continue; // Skip if not late or no elements
		}

		if (!seen.has(details.t)) {
			seen.set(details.t, new Set());
		}

		const seenElements = seen.get(details.t)!;
		for (const element of details.e) {
			if (seenElements.has(element)) {
				continue;
			}

			seenElements.add(element);
			result.push({
				time: details.t,
				element,
				viewportHeatmapPercentage: postInteractionFinishVCRatios[element] || 0,
			});
		}
	}

	return result;
}

export default getLateMutations;
