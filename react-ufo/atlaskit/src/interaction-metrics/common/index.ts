import type { InteractionMetrics } from '../../common';
import { getConfig } from '../../config';
import type { LabelStack, SegmentLabel } from '../../interaction-context';

import {
	interactionQueue,
	segmentCache,
	type SegmentObserver,
	segmentObservers,
} from './constants';

export function isPerformanceTracingEnabled() {
	return (
		getConfig()?.enableAdditionalPerformanceMarks ||
		window.__REACT_UFO_ENABLE_PERF_TRACING ||
		process.env.NODE_ENV !== 'production'
	);
}

export function labelStackToString(labelStack: LabelStack | null | undefined, name?: string) {
	const stack = [...(labelStack ?? [])];
	if (name) {
		stack.push({ name });
	}
	return stack.map((l) => l.name)?.join('/');
}
export function labelStackToIdString(labelStack: LabelStack | null | undefined) {
	return labelStack
		?.map((l) => ('segmentId' in l ? `${l.name}:${l.segmentId}` : `${l.name}`))
		?.join('/');
}
export function addSegmentObserver(observer: SegmentObserver) {
	segmentObservers.push(observer);

	for (const segmentInfo of segmentCache.values()) {
		observer.onAdd(segmentInfo);
	}
}
export function removeSegmentObserver(observer: SegmentObserver) {
	const index = segmentObservers.findIndex((obs) => obs === observer);

	if (index !== -1) {
		segmentObservers.splice(index, 1);
	}
}

export function addHoldCriterion(
	id: string,
	labelStack: LabelStack,
	name: string,
	startTime: number,
) {
	if (!window.__CRITERION__?.addUFOHold) {
		return;
	}
	window.__CRITERION__.addUFOHold(id, labelStackToString(labelStack), name, startTime);
}

export function removeHoldCriterion(id: string) {
	if (!window.__CRITERION__?.removeUFOHold) {
		return;
	}
	window.__CRITERION__.removeUFOHold(id);
}

export const pushToQueue = (id: string, data: InteractionMetrics) => {
	interactionQueue.push({ id, data });
};

export function callCleanUpCallbacks(interaction: InteractionMetrics) {
	interaction.cleanupCallbacks.reverse().forEach((cleanUpCallback) => {
		cleanUpCallback();
	});
}

export function reactProfilerTimingMap(data: InteractionMetrics) {
	const profilerTimingMap = new Map<
		string,
		{ labelStack: LabelStack; start?: number; end?: number }
	>();
	data.reactProfilerTimings.forEach((profilerTiming) => {
		const labelStackId = labelStackToIdString(profilerTiming.labelStack);
		if (labelStackId) {
			const timing = profilerTimingMap.get(labelStackId) ?? {
				labelStack: profilerTiming.labelStack,
			};
			timing.start =
				profilerTiming.startTime < (timing.start ?? Number.MAX_SAFE_INTEGER)
					? profilerTiming.startTime
					: timing.start;
			timing.end =
				profilerTiming.commitTime > (timing.end ?? Number.MIN_SAFE_INTEGER)
					? profilerTiming.commitTime
					: timing.end;
			profilerTimingMap.set(labelStackId, timing);
		}
	});
	try {
		// for Firefox 102 and older
		for (const [, { labelStack, start, end }] of profilerTimingMap.entries()) {
			performance.measure(`🛸 ${labelStackToString(labelStack)} [segment_ttai]`, {
				start,
				end,
			});
		}
	} catch (e) {
		// do nothing
	}
}

export function callCancelCallbacks(interaction: InteractionMetrics) {
	interaction.cancelCallbacks.reverse().forEach((cancelCallback) => {
		cancelCallback();
	});
}

export function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
}

export function getSegmentCacheKey(labelStack: LabelStack) {
	return labelStack
		.map((l) => {
			if (isSegmentLabel(l)) {
				return `${l.name}_${l.segmentId}`;
			}
			return l.name;
		})
		.join('|');
}
