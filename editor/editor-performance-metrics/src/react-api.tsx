/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
	createCalculator,
	type LatencyPercentileTargets,
	type TTVCTargets,
	type TTVCTargetsPromise,
} from './internals/editorPerformanceMetrics';
import { getGlobalEditorMetricsObserver } from './internals/global';

type MetricsProps = {
	onTTVC?: (result: { ttvc: TTVCTargets; relativeTTVC: TTVCTargets }) => void;
	onUserLatency?: (result: { latency: LatencyPercentileTargets }) => void;
};

export type { TTVCTargets, LatencyPercentileTargets };
export const PerformanceMetrics = memo(({ onTTVC, onUserLatency }: MetricsProps) => {
	const observerRef = useRef(getGlobalEditorMetricsObserver());
	const [ttvcPromise, setTTVCPromise] = useState<TTVCTargetsPromise | null>(null);
	const ttvcPromiseRef = useRef(ttvcPromise);
	const mountedAtRef = useRef(performance.now());

	useLayoutEffect(() => {
		ttvcPromiseRef.current = ttvcPromise;
	}, [ttvcPromise]);

	useEffect(() => {
		if (!observerRef.current) {
			return;
		}

		const unsub = observerRef.current.onIdleBuffer(async ({ idleAt, timelineBuffer }) => {
			const metrics = createCalculator(timelineBuffer);

			if (!ttvcPromiseRef.current) {
				setTTVCPromise(
					metrics.calculateVCTargets({
						rangeEventsFilter: {
							from: mountedAtRef.current,
							to: 'abort:user-interaction',
						},
					}),
				);
			}

			if (onUserLatency) {
				const result = await metrics.calculateLatencyPercents();
				if (!result) {
					return;
				}
				onUserLatency({
					latency: result,
				});
			}
		});

		return () => {
			unsub();
		};
	}, [setTTVCPromise, onUserLatency]);

	useEffect(() => {
		if (!ttvcPromise || !onTTVC) {
			return;
		}

		ttvcPromise
			.then((ttvc) => {
				if (!ttvc) {
					return;
				}
				const startedTime = mountedAtRef.current;
				const relativeTTVC: TTVCTargets = Object.entries(ttvc).reduce(
					(acc, [percentile, value]) => {
						// @ts-ignore
						acc[percentile] = value - startedTime;

						return acc;
					},
					{} as TTVCTargets,
				);

				onTTVC({ ttvc, relativeTTVC });
			})
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error(e);
			});
	}, [ttvcPromise, onTTVC]);

	return null;
});

PerformanceMetrics.displayName = 'PerformanceMetrics';
