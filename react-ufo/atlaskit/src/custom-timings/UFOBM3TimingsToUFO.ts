import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context/getInteractionId';
import { getCurrentInteractionType } from '../interaction-metrics';
import { getBm3Timings } from './getBm3Timings';
import type { BM3Marks, BM3TimingsConfig } from './index';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function UFOBM3TimingsToUFO({
	marks,
	timings,
}: {
	marks?: BM3Marks;
	timings?: BM3TimingsConfig[];
}): any {
	const interactionContext = useContext(UFOInteractionContext);
	const interactionId = getInteractionId().current;
	useMemo(() => {
		if (interactionContext != null && interactionId != null && marks != null && timings != null) {
			const interactionType = getCurrentInteractionType(interactionId);
			if (interactionType === 'press') {
				return;
			}
			const bm3Timings = getBm3Timings(marks, timings);
			interactionContext.addCustomTimings(bm3Timings);
		}
	}, [interactionContext, interactionId, marks, timings]);
	return null;
}
