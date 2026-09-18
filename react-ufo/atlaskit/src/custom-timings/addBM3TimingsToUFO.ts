import { getInteractionId } from '../interaction-id-context/getInteractionId';
import { addCustomTiming, getCurrentInteractionType } from '../interaction-metrics';
import { getBm3Timings } from './getBm3Timings';
import type { BM3Marks, BM3TimingsConfig } from './index';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function addBM3TimingsToUFO(marks?: BM3Marks, timingsConfig?: BM3TimingsConfig[]): void {
	const interactionId = getInteractionId().current;
	if (interactionId) {
		const interactionType = getCurrentInteractionType(interactionId);
		if (interactionType === 'press') {
			return;
		}
		const bm3Timings = getBm3Timings(marks, timingsConfig);
		addCustomTiming(interactionId, [], bm3Timings);
	}
}
