import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { addCustomTiming, getCurrentInteractionType } from '../interaction-metrics';

export type BM3Marks = { [key: string]: number };
export type BM3TimingsConfig = {
	key: string;
	startMark?: string;
	endMark?: string;
};

export function getBm3Timings(marks?: BM3Marks, timingConfigs?: BM3TimingsConfig[]) {
	const bm3Timings: { [key: string]: { startTime: number; endTime: number } } = {};
	if (!marks || !timingConfigs) {
		return bm3Timings;
	}
	timingConfigs.forEach((item) => {
		if (!item.startMark || !item.endMark) {
			return;
		}
		const startTime = marks[item.startMark];
		if (!startTime) {
			return;
		}
		const endTime = marks[item.endMark];
		if (!endTime) {
			return;
		}
		bm3Timings[item.key] = { startTime, endTime };
	});
	return bm3Timings;
}

export function UFOBM3TimingsToUFO({
	marks,
	timings,
}: {
	marks?: BM3Marks;
	timings?: BM3TimingsConfig[];
}) {
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

export function addBM3TimingsToUFO(marks?: BM3Marks, timingsConfig?: BM3TimingsConfig[]) {
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
