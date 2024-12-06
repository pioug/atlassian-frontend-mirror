import type { InteractionMetrics, SegmentInfo } from '../../common';
import type { FeatureFlagValue } from '../../feature-flags-accessed';

const interactions: Map<string, InteractionMetrics> = new Map();
export const CLEANUP_TIMEOUT = 60 * 1000;
export const CLEANUP_TIMEOUT_AFTER_APDEX = 15 * 1000;
export type SegmentObserver = {
	onAdd: (segment: SegmentInfo) => void;
	onRemove: (segment: SegmentInfo) => void;
};

export const interactionQueue: { id: string; data: InteractionMetrics }[] = [];
export const segmentCache = new Map<string, SegmentInfo>();
export const segmentObservers: SegmentObserver[] = [];

export const moduleLoadingRequests: Record<
	string,
	{
		start: number;
		timeoutId: ReturnType<typeof setTimeout> | number | undefined;
	}
> = {};

declare global {
	interface Window {
		__REACT_UFO_ENABLE_PERF_TRACING?: boolean;
		__UFO_COMPACT_PAYLOAD__?: boolean;
		__CRITERION__?: {
			addFeatureFlagAccessed?: (flagName: string, flagValue: FeatureFlagValue) => void;
			addUFOHold?: (id: string, name: string, labelStack: string, startTime: number) => void;
			removeUFOHold?: (id: string) => void;
			getFeatureFlagOverride?: (flagName: string) => boolean | undefined;
			getExperimentValueOverride?: <T>(experimentName: string, parameterName: string) => T;
		};
	}
}

export default interactions;
