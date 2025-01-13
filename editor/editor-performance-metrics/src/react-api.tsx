/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useEffect, useMemo, useRef } from 'react';

import {
	createCalculator,
	type LatencyPercentileTargets,
	type TTVCTargets,
} from './internals/editorPerformanceMetrics';
import type { EditorPerformanceObserver } from './internals/editorPerformanceObserver';
import { getGlobalEditorMetricsObserver } from './internals/global';

type OnTTVC = (result: {
	ttvc: TTVCTargets;
	// Relative to when the component was mounted
	relativeTTVC: TTVCTargets;
}) => void;
type OnUserLatency = (result: { latency: LatencyPercentileTargets }) => void;

/**
 *    onTTVC: (optional) Callback function that receives TTVC metrics.
 *       Type: (result: { ttvc: TTVCTargets; relativeTTVC: TTVCTargets }) => void
 *       ttvc: Object containing TTVC values for different percentiles.
 *       relativeTTVC: TTVC values relative to when the component was mounted.
 *
 *    onUserLatency: (optional) Callback function that receives user latency metrics.
 *        Type: (result: { latency: LatencyPercentileTargets }) => void
 *        latency: Object containing latency percentiles for different user event categories.
 */
type PerformanceMetricsProps = {
	onTTVC?: OnTTVC;
	onUserLatency?: OnUserLatency;
};

export type {
	TTVCTargets,
	LatencyPercentileTargets,
	OnUserLatency,
	OnTTVC,
	PerformanceMetricsProps,
};

type UseTTVCProps = {
	observer: EditorPerformanceObserver;
	onTTVC: PerformanceMetricsProps['onTTVC'];
};
const useTTVC = ({ observer, onTTVC }: UseTTVCProps) => {
	const mountedAtRef = useRef(performance.now());

	useEffect(() => {
		if (!observer || !onTTVC) {
			return;
		}

		const unsub = observer.onceNextIdle(async ({ idleAt, timelineBuffer }) => {
			const metrics = createCalculator(timelineBuffer);

			const ttvc = await metrics.calculateVCTargets({
				// Only events that started after the component was created are valid for TTVC calculation
				rangeEventsFilter: {
					from: mountedAtRef.current,
					to: 'abort:user-interaction',
				},
			});
			if (!ttvc) {
				return;
			}

			const startedTime = mountedAtRef.current;
			const relativeTTVC: TTVCTargets = Object.entries(ttvc).reduce((acc, [percentile, value]) => {
				// @ts-ignore
				acc[percentile] = value - startedTime;

				return acc;
			}, {} as TTVCTargets);

			onTTVC({ ttvc, relativeTTVC });
		});

		return () => {
			unsub();
		};
	}, [observer, onTTVC]);
};

type UseLatencyProps = {
	observer: EditorPerformanceObserver;
	onUserLatency: PerformanceMetricsProps['onUserLatency'];
};
const useLatency = ({ observer, onUserLatency }: UseLatencyProps) => {
	useEffect(() => {
		if (!observer || !onUserLatency) {
			return;
		}

		const unsub = observer.onIdleBuffer(({ idleAt, timelineBuffer }) => {
			createCalculator(timelineBuffer)
				.calculateLatencyPercents()
				.then((result) => {
					if (!result) {
						return;
					}

					onUserLatency({
						latency: result,
					});
				});
		});

		return () => {
			unsub();
		};
	}, [observer, onUserLatency]);
};

export const PerformanceMetrics = memo(({ onTTVC, onUserLatency }: PerformanceMetricsProps) => {
	const observer = useMemo(() => getGlobalEditorMetricsObserver(), []);

	useTTVC({
		observer,
		onTTVC,
	});

	useLatency({
		observer,
		onUserLatency,
	});

	return null;
});

PerformanceMetrics.displayName = 'PerformanceMetrics';
