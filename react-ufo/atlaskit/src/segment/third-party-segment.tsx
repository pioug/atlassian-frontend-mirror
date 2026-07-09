import React, { useEffect, useLayoutEffect, useContext, useRef, useState } from 'react';

import type { EnhancedUFOInteractionContextType } from '../common';
import UFOInteractionContext from '../interaction-context';
import UFOInteractionIDContext from '../interaction-id-context';
import {
	addCompletedHold,
	addIframeSegmentData,
	addSegmentExtraData,
	getActiveInteraction,
} from '../interaction-metrics';
import UFOLoadHold from '../load-hold/UFOLoadHold';
import {
	shapeNavigationTimingData,
	shapeResourceTimingData,
} from '../resource-timing/common/utils/shape-resource-timing';

import UFOSegment, { type Props as SegmentProps } from './segment';
import {
	isDomMutationsFinalBatch,
	shapeDomMutationsData,
	shapeLargestContentfulPaintData,
	shapeLayoutShiftData,
	shapePaintTimingData,
} from './shape-iframe-dom-events';

const FORGE_TTAI_EVENT_PREFIX = 'ufo-forge';
// Early-signal event emitted by the iframe bridge as soon as it wires up its
// UFO observers. Receiving this within ABORT_TIMEOUT_INITIAL_MS tells us the
// iframe is on the new rollout cohort and will send data events.
const FORGE_INIT_EVENT = 'ufo-forge-init';

// Grace period (ms) after the navigation hold releases before finalising.
const GRACE_PERIOD_MS = 2_000;

// Initial abort timeout (ms from mount). If no recognised iframe event arrives within
// this window, the hold is force-released and an abort marker is logged. This protects
// metric quality during progressive rollouts where old-cohort iframes never emit events.
const ABORT_TIMEOUT_INITIAL_MS = 6_000;

// Per-segment cap on the number of `resized` entries forwarded to addIframeSegmentData.
// useResizeAnalytics already limits emissions to a 10s tracking window, but a chatty
// app could still produce dozens of resizes; combined with many Forge apps on one
// page this could push segment3pData toward the 60 KB soft limit. The cap provides
// defence-in-depth without affecting realistic apps (typical <20 resizes per segment).
const MAX_RESIZED_ENTRIES_PER_SEGMENT = 50;

// Extended abort timeout (ms from mount). Once any recognised iframe event is received
// we know the iframe is on the new rollout cohort and actively sending data, so we extend
// the window to accommodate legitimately slow-loading Forge apps.
const ABORT_TIMEOUT_EXTENDED_MS = 30_000;

// Events logged via addIframeSegmentData as they arrive.
const IFRAME_SEGMENT_DATA_SUFFIXES = [
	'resource-timing',
	'paint-timing',
	'largest-contentful-paint',
	'layout-shift',
	'dom-mutations',
	'navigation-timing',
];

// Events that extend the forge-ui-requests corrected end-time during grace.
const NAV_HOLD_GRACE_SUFFIXES = new Set(['navigation-timing', 'resource-timing']);

/** Typed subset of AppPerformanceProfilingEvent. Kept generic so react-ufo stays decoupled. */
export type IframeSegmentEvent = {
	type: string;
	elapsed: number;
	[key: string]: unknown;
};

/** Reads segmentId from UFOInteractionContext and stores it in a ref. */
function IframeSegmentIdReader({
	segmentIdRef,
}: {
	segmentIdRef: React.MutableRefObject<string | undefined>;
}) {
	const context = useContext(UFOInteractionContext);
	const labelStack = context?.labelStack;
	const segmentId =
		labelStack && labelStack.length > 0
			? (labelStack[labelStack.length - 1] as { segmentId?: string }).segmentId
			: undefined;

	if (segmentId && segmentIdRef.current !== segmentId) {
		segmentIdRef.current = segmentId;
	}

	return null;
}

/** Subscribes to iframe performance events and records them as segment3pTimings. */
function IframeSegment({
	onRegisterIframeEventListener,
	appType,
}: {
	onRegisterIframeEventListener: (listener: (event: IframeSegmentEvent) => void) => () => void;
	appType?: string;
}): React.JSX.Element {
	const interactionId = useContext(UFOInteractionIDContext);
	const interactionContext = useContext(
		UFOInteractionContext,
	) as EnhancedUFOInteractionContextType | null;
	const segmentIdRef = useRef<string | undefined>(undefined);
	// Per-segment counter for `resized` entries (defence-in-depth payload cap).
	// Tracks both the count AND the segmentId it was last incremented under, so
	// SPA navigations that swap segmentId reset the budget for the new segment.
	const resizedCountRef = useRef(0);
	const resizedCounterSegmentIdRef = useRef<string | undefined>(undefined);
	const isUiKit = appType === 'UIKit';

	// Released on the first navigation-timing event from the iframe.
	const [navigationHold, setNavigationHold] = useState<'holding' | 'released'>('holding');

	// UIKit: wrap onRender to account for React Profiler timings
	// Accumulates profiler timing bounds so we emit one aggregated entry at cleanup.
	const profilerAccRef = useRef<{
		startTime: number;
		endTime: number;
	} | null>(null);
	useLayoutEffect(() => {
		if (!isUiKit || !interactionContext || !interactionContext.onRender) {
			return;
		}
		const originalOnRender = interactionContext.onRender.bind(interactionContext);
		interactionContext.onRender = function (
			phase: 'mount' | 'update' | 'nested-update',
			actualDuration: number,
			baseDuration: number,
			startTime: number,
			commitTime: number,
		) {
			originalOnRender(phase, actualDuration, baseDuration, startTime, commitTime);
			// Accumulate timing bounds into a single entry.
			const start = Math.round(startTime);
			const end = Math.round(commitTime);
			if (profilerAccRef.current === null) {
				profilerAccRef.current = { startTime: start, endTime: end };
			} else {
				if (start < profilerAccRef.current.startTime) {
					profilerAccRef.current.startTime = start;
				}
				if (end > profilerAccRef.current.endTime) {
					profilerAccRef.current.endTime = end;
				}
			}
		};
		return () => {
			interactionContext.onRender = originalOnRender;
		};
	}, [isUiKit, interactionContext, interactionId]);

	useEffect(() => {
		let navigationHoldReleased = false;
		let lastNavEventTime: number | null = null;
		let gracePeriodTimer: ReturnType<typeof setTimeout> | null = null;
		// Tracks whether any recognised iframe event has been received, which tells us
		// the iframe is on the new rollout cohort and actively sending data.
		let iframeEventsReceived = false;
		let abortTimer: ReturnType<typeof setTimeout>;

		const mountTime = performance.now();

		const fireAbort = (abortAfterMs: number) => {
			// Cancel any pending grace period so it doesn't also fire.
			if (gracePeriodTimer !== null) {
				clearTimeout(gracePeriodTimer);
				gracePeriodTimer = null;
			}
			// Force-release the hold if still active at abort time.
			if (!navigationHoldReleased) {
				navigationHoldReleased = true;
				setNavigationHold('released');
			}
			// Record the abort marker so downstream analytics can detect it.
			if (interactionId.current && segmentIdRef.current) {
				addIframeSegmentData(interactionId.current, segmentIdRef.current, {
					label: 'segment-timing-abort',
					data: {
						reason: 'timeout',
						abortAfterMs,
					},
				});
			}
		};

		// Start with the short initial timeout. If no ufo-forge-init signal arrives
		// within this window, the iframe is likely an old-cohort app that will never
		// send events — abort early to avoid blocking the interaction indefinitely.
		abortTimer = setTimeout(() => {
			if (!iframeEventsReceived) {
				fireAbort(ABORT_TIMEOUT_INITIAL_MS);
			}
		}, ABORT_TIMEOUT_INITIAL_MS);

		const finaliseHolds = () => {
			const iid = interactionId.current;
			const lStack = interactionContext?.labelStack;
			if (iid && lStack) {
				if (lastNavEventTime !== null) {
					addCompletedHold(iid, lStack, 'forge-ui-requests', mountTime, lastNavEventTime);
				}
			}
		};

		const scheduleGracePeriodExpiry = () => {
			// Reset the 2s countdown each time a new event arrives during the grace period.
			if (gracePeriodTimer !== null) {
				clearTimeout(gracePeriodTimer);
			}
			gracePeriodTimer = setTimeout(() => {
				clearTimeout(abortTimer);
				finaliseHolds();
			}, GRACE_PERIOD_MS);
		};

		const maybeStartGracePeriod = () => {
			if (navigationHoldReleased && gracePeriodTimer === null) {
				scheduleGracePeriodExpiry();
			}
		};

		const handleEvent = (event: IframeSegmentEvent) => {
			// Host-side `resized` events come from useResizeAnalytics (forge-ui).
			// They are emitted whenever the iframe container height changes during
			// the 10s tracking window after mount. We forward only the reliable
			// fields (height, elapsed). The `measuredHeight` and `viewportHeight`
			// fields are intentionally excluded because they require a vendor
			// config that is rarely populated in practice (almost always null).
			if (event.type === 'resized') {
				// Guard against malformed payloads (height is required and must be
				// a non-negative number; useResizeAnalytics emits Math.trunc'd ints).
				// `IframeSegmentEvent` already declares `[key: string]: unknown`, so
				// no `as` cast is needed — the typeof guards handle runtime safety.
				const { height, elapsed } = event;
				// Reset the per-segment counter when the active segmentId changes
				// (SPA navigations swap segments; each gets a fresh budget).
				if (segmentIdRef.current && segmentIdRef.current !== resizedCounterSegmentIdRef.current) {
					resizedCountRef.current = 0;
					resizedCounterSegmentIdRef.current = segmentIdRef.current;
				}
				if (
					typeof height === 'number' &&
					Number.isFinite(height) &&
					height >= 0 &&
					typeof elapsed === 'number' &&
					Number.isFinite(elapsed) &&
					elapsed >= 0 &&
					resizedCountRef.current < MAX_RESIZED_ENTRIES_PER_SEGMENT &&
					interactionId.current &&
					segmentIdRef.current
				) {
					resizedCountRef.current += 1;
					addIframeSegmentData(interactionId.current, segmentIdRef.current, {
						label: 'resized',
						data: {
							height,
							elapsed,
						},
					});
				}
				// NOTE: we deliberately do NOT set iframeEventsReceived = true here.
				// The 6s abort timer exists to detect old-cohort iframes that won't
				// emit bridge events. `resized` is a host-side signal (forge-ui's
				// ResizeObserver) and fires regardless of which bridge version the
				// iframe is serving, so it cannot confirm new-cohort membership.
				// Only bridge-emitted `ufo-forge-*` events (esp. `ufo-forge-init`)
				// are valid proof, and they extend the abort timeout below.
				return;
			}

			if (
				event.type !== 'ufo-event' ||
				typeof event.name !== 'string' ||
				!event.name.startsWith(FORGE_TTAI_EVENT_PREFIX)
			) {
				return;
			}

			const eventName = event.name as string;
			const suffix = IFRAME_SEGMENT_DATA_SUFFIXES.find((s) => eventName.endsWith(`-${s}`));

			if (suffix && interactionId.current && segmentIdRef.current) {
				const { type, ...rest } = event;
				const restData = rest as Record<string, unknown>;
				let data: Record<string, unknown> | undefined;
				if (suffix === 'resource-timing') {
					data = shapeResourceTimingData(restData);
				} else if (suffix === 'navigation-timing') {
					data = shapeNavigationTimingData(restData);
				} else if (suffix === 'paint-timing') {
					data = shapePaintTimingData(restData);
				} else if (suffix === 'largest-contentful-paint') {
					data = shapeLargestContentfulPaintData(restData);
				} else if (suffix === 'layout-shift') {
					data = shapeLayoutShiftData(restData);
				} else if (suffix === 'dom-mutations') {
					// Skip intermediate batches — only record the final summary batch.
					if (!isDomMutationsFinalBatch(restData)) {
						return;
					}
					data = shapeDomMutationsData(restData);
				} else {
					data = restData;
				}
				if (data !== undefined) {
					addIframeSegmentData(interactionId.current, segmentIdRef.current, {
						label: suffix,
						data,
					});
				}
			}

			// ufo-forge-init confirms the iframe is on the new rollout cohort — extend the abort window.
			if (eventName === FORGE_INIT_EVENT && !iframeEventsReceived) {
				iframeEventsReceived = true;
				clearTimeout(abortTimer);
				const remainingMs = Math.max(
					ABORT_TIMEOUT_EXTENDED_MS - (performance.now() - mountTime),
					0,
				);
				abortTimer = setTimeout(() => {
					fireAbort(ABORT_TIMEOUT_EXTENDED_MS);
				}, remainingMs);
			}

			if (eventName.endsWith('-navigation-timing') && !navigationHoldReleased) {
				navigationHoldReleased = true;
				setNavigationHold('released');
				maybeStartGracePeriod();
			}

			if (navigationHoldReleased) {
				const now = performance.now();

				if (suffix && NAV_HOLD_GRACE_SUFFIXES.has(suffix)) {
					lastNavEventTime = now;
					scheduleGracePeriodExpiry();
				}
			}
		};

		const unregister = onRegisterIframeEventListener(handleEvent);

		// Emit react-profiler-timing for UI kit
		const activeInteraction = getActiveInteraction();
		let isUnmounted = false;
		if (activeInteraction) {
			activeInteraction.cleanupCallbacks.push(() => {
				if (isUnmounted) {
					return;
				}
				const iid = interactionId.current;
				const sid = segmentIdRef.current;
				if (iid && sid && profilerAccRef.current !== null) {
					addIframeSegmentData(iid, sid, {
						label: 'react-profiler-timing',
						data: { ...profilerAccRef.current },
					});
					profilerAccRef.current = null;
				}
			});
		}

		return () => {
			isUnmounted = true;
			unregister();
			clearTimeout(abortTimer);
			if (gracePeriodTimer !== null) {
				clearTimeout(gracePeriodTimer);
			}
		};
	}, [onRegisterIframeEventListener, interactionId, interactionContext]);

	return (
		<>
			<UFOLoadHold name="forge-ui-requests" hold={navigationHold === 'holding'} />
			<IframeSegmentIdReader segmentIdRef={segmentIdRef} />
		</>
	);
}

type ThirdPartySegmentProps = Omit<SegmentProps, 'type'> & {
	/** When provided, activates iframe timeline subscription feeding segment3pTimings. */
	onRegisterIframeEventListener?: (listener: (event: IframeSegmentEvent) => void) => () => void;
	/** Per-segment key-value metadata (scoped to this segment, not the interaction). */
	extraData?: Record<string, string | undefined>;
};

/** Writes per-segment extraData via addSegmentExtraData. */
function SegmentExtraDataWriter({
	extraData,
}: {
	extraData: Record<string, string | undefined>;
}): null {
	const interactionContext = useContext(UFOInteractionContext);
	const interactionId = useContext(UFOInteractionIDContext);

	const labelStack = interactionContext?.labelStack;
	const segmentId =
		labelStack && labelStack.length > 0
			? (labelStack[labelStack.length - 1] as { segmentId?: string }).segmentId
			: undefined;

	useEffect(() => {
		const currentInteractionId = interactionId.current;
		if (segmentId && currentInteractionId) {
			addSegmentExtraData(currentInteractionId, segmentId, extraData);
		}
	}, [extraData, segmentId, interactionId]);

	return null;
}

export const UFOThirdPartySegment: {
	(props: ThirdPartySegmentProps): React.JSX.Element;
	displayName: string;
} = (props: ThirdPartySegmentProps): React.JSX.Element => {
	const { children, onRegisterIframeEventListener, extraData, ...otherProps } = props;
	return (
		<UFOSegment type="third-party" {...otherProps}>
			{onRegisterIframeEventListener && extraData && (
				<>
					<IframeSegment
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						appType={extraData.appType}
					/>
					<SegmentExtraDataWriter extraData={extraData} />
				</>
			)}
			{children}
		</UFOSegment>
	);
};

UFOThirdPartySegment.displayName = 'UFOThirdPartySegment';
