import React, {
	lazy,
	Profiler,
	type ProfilerOnRenderCallback,
	type ReactNode,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import {
	unstable_NormalPriority as NormalPriority,
	unstable_scheduleCallback as scheduleCallback,
} from 'scheduler';
import { v4 as createUUID } from 'uuid';

import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../coinflip';
import type { EnhancedUFOInteractionContextType } from '../common';
import {
	getConfig,
	getDoNotAbortActivePressInteraction,
	getInteractionRate,
	getMinorInteractions,
} from '../config';
import { getActiveTrace, setInteractionActiveTrace } from '../experience-trace-id-context';
import UFOInteractionContext, { type LabelStack } from '../interaction-context';
import UFOInteractionIDContext from '../interaction-id-context';
import {
	abortByNewInteraction,
	addApdex,
	addCustomData,
	addCustomTiming,
	addHold,
	addHoldByID,
	addMark,
	addNewInteraction,
	addProfilerTimings,
	addRequestInfo,
	addSegment,
	addSpan,
	type CustomData,
	type CustomTiming,
	getActiveInteraction,
	removeHoldByID,
	removeSegment,
	type RequestInfo,
	tryComplete,
} from '../interaction-metrics';
import UFORouteName from '../route-name-context';
import generateId from '../short-id';

import scheduleOnPaint from './schedule-on-paint';

export type UFOSegmentType = 'third-party' | 'first-party';

export type Props = {
	name: string;
	children: ReactNode;
	mode?: 'list' | 'single';
	type?: UFOSegmentType;
};

let tryCompleteHandle: number | undefined;

const AsyncSegmentHighlight = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_ufo-segment-highlight" */ './segment-highlight'
	).then((module) => ({ default: module.SegmentHighlight })),
);

// KARL TODO: finish self profiling
/** A portion of the page we apply measurement to */
export default function UFOSegment({
	name: segmentName,
	children,
	mode = 'single',
	type = 'first-party',
}: Props) {
	const parentContext = useContext(UFOInteractionContext) as EnhancedUFOInteractionContextType;

	const segmentIdMap = useMemo(() => {
		if (!parentContext?.segmentIdMap) {
			return new Map<string, string>();
		}
		return parentContext.segmentIdMap;
	}, [parentContext]);

	const segmentId = useMemo(() => {
		if (mode === 'single') {
			return generateId();
		}

		if (segmentIdMap.has(segmentName)) {
			return segmentIdMap.get(segmentName);
		}

		const newSegmentId = generateId();
		segmentIdMap.set(segmentName, newSegmentId);
		return newSegmentId;
	}, [mode, segmentName, segmentIdMap]);

	const labelStack: LabelStack = useMemo(
		() =>
			parentContext?.labelStack
				? [
						...parentContext.labelStack,
						{
							name: segmentName,
							segmentId,
							...(type !== 'first-party' ? { type } : {}),
						}, // Only pass non-default types (not 'first-party') in payload to reduce size
					]
				: [
						{
							name: segmentName,
							segmentId,
							...(type !== 'first-party' ? { type } : {}),
						},
					],
		[parentContext, segmentName, segmentId, type],
	);

	const interactionId = useContext(UFOInteractionIDContext);

	const interactionContext = useMemo<EnhancedUFOInteractionContextType>(() => {
		let lastCompleteEndTime = 0;
		function complete(endTime: number = performance.now()) {
			if (interactionId.current) {
				if (parentContext) {
					parentContext.complete();
				} else {
					const capturedInteractionId = interactionId.current;
					if (endTime > lastCompleteEndTime) {
						lastCompleteEndTime = endTime;
					}

					if (tryCompleteHandle) {
						cancelAnimationFrame?.(tryCompleteHandle);
					}

					const onComplete = () => {
						if (capturedInteractionId === interactionId.current) {
							const isPageVisible = globalThis?.document?.visibilityState === 'visible';
							const canDoRAF = typeof requestAnimationFrame !== 'undefined';

							if (isPageVisible && canDoRAF) {
								tryCompleteHandle = requestAnimationFrame(() => {
									tryCompleteHandle = requestAnimationFrame(() => {
										if (capturedInteractionId === interactionId.current) {
											tryComplete(interactionId.current, lastCompleteEndTime);
										}
									});
								});
							} else {
								tryComplete(interactionId.current, lastCompleteEndTime);
							}
						}
					};

					scheduleCallback(NormalPriority, onComplete);
				}
			}
		}

		function _internalHold(
			this: EnhancedUFOInteractionContextType,
			labelStack: LabelStack,
			name: string,
			experimental = false,
		) {
			if (interactionId.current != null) {
				if (parentContext) {
					return parentContext._internalHold(labelStack, name, experimental);
				} else {
					const capturedInteractionId = interactionId.current;
					const disposeHold = addHold(interactionId.current, labelStack, name, experimental);
					return () => {
						if (capturedInteractionId === interactionId.current) {
							disposeHold();
						}
					};
				}
			}
		}

		function _internalHoldByID(
			this: EnhancedUFOInteractionContextType,
			labelStack: LabelStack,
			id: string,
			name: string,
			remove: boolean,
		) {
			if (interactionId.current != null) {
				if (parentContext) {
					parentContext._internalHoldByID(labelStack, name, id, remove);
					return;
				}

				if (!remove) {
					addHoldByID(interactionId.current, labelStack, name, id);
				} else {
					removeHoldByID(interactionId.current, id);
				}
			}
		}

		if (parentContext) {
			return {
				...parentContext,
				labelStack,
				complete,
			};
		}

		return {
			labelStack,
			segmentIdMap: segmentIdMap,
			hold(this: EnhancedUFOInteractionContextType, name: string | undefined = 'unknown') {
				return this._internalHold(this.labelStack, name);
			},
			holdExperimental(this: EnhancedUFOInteractionContextType, name: string = 'unknown') {
				return this._internalHold(this.labelStack, name, true);
			},
			addHoldByID(
				this: EnhancedUFOInteractionContextType,
				labelStack: LabelStack,
				id: string,
				name: string | undefined = 'unknown',
			) {
				this._internalHoldByID(labelStack, id, name, false);
			},
			removeHoldByID(
				this: EnhancedUFOInteractionContextType,
				labelStack: LabelStack,
				id: string,
				name: string | undefined = 'unknown',
			) {
				this._internalHoldByID(labelStack, id, name, true);
			},
			tracePress(
				this: EnhancedUFOInteractionContextType,
				name: string | undefined = 'unknown',
				timestamp?: number,
			): void {
				if (fg('platform_ufo_enable_minor_interactions')) {
					const minorInteractions = [
						...(getDoNotAbortActivePressInteraction() ?? []),
						...(getMinorInteractions() ?? []),
					];

					if (minorInteractions.includes(name)) {
						const activeInteraction = getActiveInteraction();
						activeInteraction?.minorInteractions?.push({
							name,
							startTime: timestamp ?? performance.now(),
						});
						return;
					} else if (interactionId.current != null) {
						abortByNewInteraction(interactionId.current, name);
					}
				} else {
					if (interactionId.current != null) {
						abortByNewInteraction(interactionId.current, name);
					}
				}

				const rate = getInteractionRate(name, 'press');

				if (coinflip(rate)) {
					const startTimestamp = timestamp ?? performance.now();
					const newId = createUUID();

					interactionId.current = newId;
					// covered experiences with tracing instrumentation:
					// inline-result.global-issue.create-modal.submit
					// inline-result.global-issue.create-modal-subsequent
					setInteractionActiveTrace(newId, 'press');

					addNewInteraction(
						newId,
						name,
						'press',
						startTimestamp,
						rate,
						this.labelStack,
						UFORouteName.current,
						getActiveTrace(),
					);
				}
			},
			retainQuery(this: EnhancedUFOInteractionContextType, info: RequestInfo): void {
				if (interactionId.current != null) {
					addRequestInfo(interactionId.current, this.labelStack, info);
				}
			},
			addPreload(this: EnhancedUFOInteractionContextType, moduleId: string, timestamp: number) {
				if (interactionId.current != null) {
					addMark(interactionId.current, 'bundle_preload', moduleId, this.labelStack, timestamp);
				}
			},
			addLoad(
				this: EnhancedUFOInteractionContextType,
				identifier: string,
				start: number,
				end: number,
			) {
				if (interactionId.current != null) {
					const { labelStack = [] } = this;
					addSpan(interactionId.current, 'bundle_load', identifier, labelStack, start, end);
				}
			},
			addMark(
				this: EnhancedUFOInteractionContextType,
				name: string,
				timestamp?: number,
				// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
			): void | (() => void) {
				if (interactionId.current != null) {
					const time = timestamp ?? performance.now();
					addMark(interactionId.current, 'custom', name, this.labelStack, time);
				}
			},
			addCustomData(this: EnhancedUFOInteractionContextType, customData: CustomData) {
				if (interactionId.current != null) {
					addCustomData(interactionId.current, this.labelStack, customData);
				}
			},
			addCustomTimings(this: EnhancedUFOInteractionContextType, customTimings: CustomTiming) {
				if (interactionId.current != null) {
					addCustomTiming(interactionId.current, this.labelStack, customTimings);
				}
			},
			addApdex(
				this: EnhancedUFOInteractionContextType,
				apdexInfo: { key: string; startTime?: number; stopTime: number },
			) {
				if (interactionId.current != null) {
					const { key, stopTime, startTime } = apdexInfo;
					addApdex(interactionId.current, {
						key,
						stopTime,
						startTime,
						labelStack: this.labelStack,
					});
				}
			},
			onRender(
				this: EnhancedUFOInteractionContextType,
				phase: 'mount' | 'update' | 'nested-update',
				actualDuration: number,
				baseDuration: number,
				startTime: number,
				commitTime: number,
			) {
				if (interactionId.current !== null) {
					addProfilerTimings(
						interactionId.current,
						this.labelStack,
						phase,
						actualDuration,
						baseDuration,
						startTime,
						commitTime,
					);
					scheduleOnPaint(() => {
						const paintedTime = performance.now();
						this.complete(paintedTime);
					});
				}
			},
			_internalHold,
			_internalHoldByID,
			complete,
		};
	}, [parentContext, labelStack, segmentIdMap, interactionId]);

	const hasMounted = useRef(false);

	const onRender: ProfilerOnRenderCallback = useCallback(
		(_id, phase, actualDuration, baseDuration, startTime, commitTime) => {
			// Manually keep track of mount-phase, and ensure that every segment is always mounted at least once
			if (getConfig()?.manuallyTrackReactProfilerMounts && !hasMounted.current) {
				interactionContext.onRender('mount', actualDuration, baseDuration, startTime, commitTime);
				hasMounted.current = true;
			} else {
				interactionContext.onRender(phase, actualDuration, baseDuration, startTime, commitTime);
			}
		},
		[interactionContext],
	);

	useEffect(() => {
		addSegment(labelStack);
		return () => {
			removeSegment(labelStack);
		};
	}, [interactionId, parentContext, interactionContext, labelStack]);

	const reactProfilerId = useMemo(() => labelStack.map((l) => l.name).join('/'), [labelStack]);

	const enableSegmentHighlighting = getConfig()?.enableSegmentHighlighting;

	return (
		<UFOInteractionContext.Provider value={interactionContext}>
			<Profiler id={reactProfilerId} onRender={onRender}>
				{children}
				{enableSegmentHighlighting && (
					<Suspense fallback={null}>
						<AsyncSegmentHighlight segmentName={segmentName} />
					</Suspense>
				)}
			</Profiler>
		</UFOInteractionContext.Provider>
	);
}

UFOSegment.displayName = 'UFOSegment';
