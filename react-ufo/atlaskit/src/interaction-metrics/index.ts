import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import type {
	AbortReasonType,
	ApdexType,
	BM3Event,
	CustomData,
	CustomTiming,
	InteractionError,
	InteractionMetrics,
	InteractionType,
	LifecycleMarkType,
	LoadProfilerEventInfo,
	Mark,
	MarkType,
	PostInteractionLogOutput,
	ReactProfilerTiming,
	RequestInfo,
	SegmentInfo,
	Span,
	SpanType,
} from '../common';
import { getAwaitBM3TTIList, getCapabilityRate, getConfig } from '../config';
import {
	experimentalVC,
	getExperimentalVCMetrics,
	onExperimentalInteractionComplete,
} from '../create-experimental-interaction-metrics-payload';
import { clearActiveTrace, type TraceIdContext } from '../experience-trace-id-context';
import {
	allFeatureFlagsAccessed,
	currentFeatureFlagsAccessed,
	type FeatureFlagValue,
} from '../feature-flags-accessed';
import type { LabelStack, SegmentLabel } from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { withProfiling } from '../self-measurements';
import { getVCObserver } from '../vc';

import { interactions } from './common/constants';
import PostInteractionLog from './post-interaction-log';

export type {
	InteractionMetrics,
	LifecycleMarkType,
	Span,
	Mark,
	MarkType,
	InteractionType,
	AbortReasonType,
	ReactProfilerTiming,
	RequestInfo,
	ApdexType,
	CustomData,
	CustomTiming,
	InteractionError,
};

const PreviousInteractionLog = {
	name: undefined as string | undefined,
	isAborted: undefined as boolean | undefined,
};

export const postInteractionLog = new PostInteractionLog();

const interactionQueue: { id: string; data: InteractionMetrics }[] = [];
const segmentCache = new Map<string, SegmentInfo>();
const CLEANUP_TIMEOUT = 60 * 1000;
const CLEANUP_TIMEOUT_AFTER_APDEX = 15 * 1000;

interface SegmentObserver {
	onAdd: (segment: SegmentInfo) => void;
	onRemove: (segment: SegmentInfo) => void;
}
const segmentObservers: SegmentObserver[] = [];

export const getActiveInteraction = withProfiling(function getActiveInteraction() {
	const interactionId = getInteractionId();
	if (!interactionId.current) {
		return;
	}
	return interactions.get(interactionId.current);
});

const isPerformanceTracingEnabled = withProfiling(function isPerformanceTracingEnabled() {
	return (
		getConfig()?.enableAdditionalPerformanceMarks ||
		window.__REACT_UFO_ENABLE_PERF_TRACING ||
		process.env.NODE_ENV !== 'production'
	);
});

const labelStackToString = withProfiling(function labelStackToString(
	labelStack: LabelStack | null | undefined,
	name?: string,
) {
	const stack = [...(labelStack ?? [])];
	if (name) {
		stack.push({ name });
	}
	return stack.map((l) => l.name)?.join('/');
});

const labelStackToIdString = withProfiling(function labelStackToIdString(
	labelStack: LabelStack | null | undefined,
) {
	return labelStack
		?.map((l) => ('segmentId' in l ? `${l.name}:${l.segmentId}` : `${l.name}`))
		?.join('/');
});

const addSegmentObserver = withProfiling(function addSegmentObserver(observer: SegmentObserver) {
	segmentObservers.push(observer);

	for (const segmentInfo of segmentCache.values()) {
		observer.onAdd(segmentInfo);
	}
});

const removeSegmentObserver = withProfiling(function removeSegmentObserver(
	observer: SegmentObserver,
) {
	const index = segmentObservers.findIndex((obs) => obs === observer);

	if (index !== -1) {
		segmentObservers.splice(index, 1);
	}
});

export const remove = withProfiling(function remove(interactionId: string) {
	interactions.delete(interactionId);
});

export const updatePageLoadInteractionName = withProfiling(function updatePageLoadInteractionName(
	ufoName: string,
	routeName: string | null | undefined = ufoName,
) {
	const interaction = getActiveInteraction();
	if (!interaction || (interaction.type !== 'page_load' && interaction.type !== 'transition')) {
		return;
	}
	interaction.ufoName = ufoName;
	interaction.routeName = routeName;
});

export const addMetadata = withProfiling(function addMetadata(
	interactionId: string,
	data: Record<string, unknown>,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		Object.keys(data).forEach((key) => {
			interaction.metaData[key] = data[key];
		});
	}
});

export const addCustomData = withProfiling(function addCustomData(
	interactionId: string,
	labelStack: LabelStack,
	data: CustomData,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		Object.keys(data).forEach((i) => {
			interaction.customData.push({ labelStack, data: { [i]: data[i] } });
		});
	}
});

export const addCustomTiming = withProfiling(function addCustomTiming(
	interactionId: string,
	labelStack: LabelStack,
	data: CustomTiming,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.customTimings.push({ labelStack, data });
		if (isPerformanceTracingEnabled()) {
			for (const [key, timingData] of Object.entries(data)) {
				const { startTime, endTime } = timingData;
				try {
					// for Firefox 102 and older
					performance.measure(`🛸 ${labelStackToString(labelStack, key)} [custom_timing]`, {
						start: startTime,
						end: endTime,
					});
				} catch (e) {
					// do nothing
				}
			}
		}
	}
});

export const addMark = withProfiling(function addMark(
	interactionId: string,
	type: MarkType,
	name: string,
	labelStack: LabelStack | null,
	time: number = performance.now(),
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.marks.push({ type, name, labelStack, time });
	}
	if (isPerformanceTracingEnabled()) {
		performance.mark(`🛸 ${labelStackToString(labelStack, name)} [${type}]`, {
			startTime: time,
		});
	}
});

export const addMarkToAll = withProfiling(function addMarkToAll(
	type: MarkType,
	name: string,
	labelStack: LabelStack | null,
	time: number = performance.now(),
) {
	interactions.forEach((interaction) => {
		interaction.marks.push({ type, name, labelStack, time });
	});
	if (isPerformanceTracingEnabled()) {
		performance.mark(`🛸 ${labelStackToString(labelStack, name)} [${type}]`, {
			startTime: time,
		});
	}
});

export const addSpan = withProfiling(function addSpan(
	interactionId: string,
	type: SpanType,
	name: string,
	labelStack: LabelStack | null,
	start: number,
	end: number = performance.now(),
	size?: number,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.spans.push({ type, name, labelStack, start, end, size });
		if (isPerformanceTracingEnabled()) {
			try {
				// for Firefox 102 and older
				performance.measure(`🛸 ${labelStackToString(labelStack, name)} [${type}]`, {
					start,
					end,
				});
			} catch (e) {
				// do nothing
			}
		}
	}
});

export const addSpanToAll = withProfiling(function addSpanToAll(
	type: SpanType,
	name: string,
	labelStack: LabelStack | null,
	start: number,
	end: number = performance.now(),
	size = 0,
) {
	interactions.forEach((interaction) => {
		interaction.spans.push({ type, name, labelStack, start, end, size });
	});
	if (isPerformanceTracingEnabled()) {
		try {
			// for Firefox 102 and older
			performance.measure(`🛸 ${labelStackToString(labelStack, name)} [${type}]`, {
				start,
				end,
			});
		} catch (e) {
			// do nothing
		}
	}
});

export const addPreload = withProfiling(function addPreload(moduleId: string, timestamp: number) {
	addMarkToAll('bundle_preload', moduleId, null, timestamp);
});

export const addLoad = withProfiling(function addLoad(
	identifier: string,
	start: number,
	end: number,
) {
	addSpanToAll('bundle_load', identifier, null, start, end - start);
});

const moduleLoadingRequests: Record<
	string,
	{
		start: number;
		timeoutId: ReturnType<typeof setTimeout> | number | undefined;
	}
> = {};

export const extractModuleName = withProfiling(function extractModuleName(input: string): string {
	let result = input ?? '';

	result = result.replace(/^\.\/src\/packages\//, '');
	result = result.replace(/^\.\/node_modules\//, '');
	result = result.replace(/(\/src)?\/(index|main)\.(tsx|ts|js|jsx)$/, '');

	return result;
});

const addHoldCriterion = withProfiling(function addHoldCriterion(
	id: string,
	labelStack: LabelStack,
	name: string,
	startTime: number,
) {
	if (!window.__CRITERION__?.addUFOHold) {
		return;
	}
	window.__CRITERION__.addUFOHold(id, labelStackToString(labelStack), name, startTime);
});

const removeHoldCriterion = withProfiling(function removeHoldCriterion(id: string) {
	if (!window.__CRITERION__?.removeUFOHold) {
		return;
	}
	window.__CRITERION__.removeUFOHold(id);
});

export const addHold = withProfiling(function addHold(
	interactionId: string,
	labelStack: LabelStack,
	name: string,
	experimental: boolean,
) {
	const interaction = interactions.get(interactionId);
	const id = createUUID();
	if (interaction != null) {
		const start = performance.now();
		const holdActive = { labelStack, name, start };
		if (getConfig()?.experimentalInteractionMetrics?.enabled && experimental) {
			interaction.holdExpActive.set(id, { ...holdActive, start });
		}
		if (!experimental) {
			interaction.holdActive.set(id, { ...holdActive, start });
		}

		addHoldCriterion(id, labelStack, name, start);
		return () => {
			const end = performance.now();
			if (isPerformanceTracingEnabled()) {
				try {
					// for Firefox 102 and older
					performance.measure(`🛸 ${labelStackToString(labelStack, name)} [hold]`, {
						start,
						end,
					});
				} catch (e) {
					// do nothing
				}
			}
			removeHoldCriterion(id);
			const currentInteraction = interactions.get(interactionId);
			const currentHold = interaction.holdActive.get(id);
			const expHold = interaction.holdExpActive.get(id);
			if (currentInteraction != null) {
				if (currentHold != null) {
					currentInteraction.holdInfo.push({ ...currentHold, end });
					interaction.holdActive.delete(id);
				}

				if (expHold != null) {
					currentInteraction.holdExpInfo.push({ ...expHold, end });
					interaction.holdExpActive.delete(id);
				}
			}
		};
	}
	return () => {};
});

export const addHoldByID = withProfiling(function addHoldByID(
	interactionId: string,
	labelStack: LabelStack,
	name: string,
	id: string,
	ignoreOnSubmit?: boolean,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		const start = performance.now();
		interaction.holdActive.set(id, { labelStack, name, start, ignoreOnSubmit });
		addHoldCriterion(id, labelStack, name, start);
	}
	return () => {};
});

export const removeHoldByID = withProfiling(function removeHoldByID(
	interactionId: string,
	id: string,
) {
	const interaction = interactions.get(interactionId);

	if (interaction != null) {
		const end = performance.now();
		const currentInteraction = interactions.get(interactionId);
		const currentHold = interaction.holdActive.get(id);
		if (currentInteraction != null && currentHold != null) {
			currentInteraction.holdInfo.push({ ...currentHold, end });
			interaction.holdActive.delete(id);
			removeHoldCriterion(id);
		}
	}
});

export const getCurrentInteractionType = withProfiling(function getCurrentInteractionType(
	interactionId: string,
) {
	const interaction = interactions.get(interactionId);
	if (interaction) {
		return interaction.type;
	}
	return null;
});

export const ModuleLoadingProfiler = {
	onPreload: withProfiling(function onPreload(moduleId: string, _priority?: number) {
		addPreload(extractModuleName(moduleId), performance.now());
	}),
	onLoadStart: withProfiling(function onLoadStart(info: LoadProfilerEventInfo): void {
		const timeoutId = setTimeout(() => {
			delete moduleLoadingRequests[info.identifier];
		}, 30000);
		const request = {
			start: performance.now(),
			timeoutId,
		};
		moduleLoadingRequests[info.identifier] = request;
	}),
	onLoadComplete: withProfiling(function onLoadComplete(info: LoadProfilerEventInfo): void {
		const request = moduleLoadingRequests[info.identifier];
		if (request) {
			clearTimeout(request.timeoutId);
			delete moduleLoadingRequests[info.identifier];
			addLoad(extractModuleName(info.identifier), request.start, performance.now());
		}
	}),
	placeholderFallBackMounted: withProfiling(function placeholderFallBackMounted(
		id: string,
		moduleId: string,
	): void {
		const interactionId = getInteractionId();
		const currentInteractionId = interactionId.current;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		addHoldByID(currentInteractionId!, [], moduleId, id);
	}),
	placeholderFallBackUnmounted: withProfiling(function placeholderFallBackUnmounted(
		id: string,
	): void {
		const interactionId = getInteractionId();
		const currentInteractionId = interactionId.current;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		removeHoldByID(currentInteractionId!, id);
	}),
};

export const addError = withProfiling(function addError(
	interactionId: string,
	name: string,
	labelStack: LabelStack | null,
	errorType: string,
	errorMessage: string,
	errorStack?: string,
	forcedError?: boolean,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.errors.push({
			name,
			labelStack,
			errorType,
			errorMessage,
			errorStack,
			forcedError,
		});
	}
});

export const addErrorToAll = withProfiling(function addErrorToAll(
	name: string,
	labelStack: LabelStack | null,
	errorType: string,
	errorMessage: string,
	errorStack?: string,
) {
	interactions.forEach((interaction) => {
		interaction.errors.push({
			name,
			labelStack,
			errorType,
			errorMessage,
			errorStack,
		});
	});
});

export const addProfilerTimings = withProfiling(function addProfilerTimings(
	interactionId: string,
	labelStack: LabelStack,
	type: 'mount' | 'update' | 'nested-update',
	actualDuration: number,
	baseDuration: number,
	startTime: number,
	commitTime: number,
) {
	if (isPerformanceTracingEnabled()) {
		try {
			// for Firefox 102 and older
			performance.measure(`🛸 ${labelStackToString(labelStack)} [react-profiler] ${type}`, {
				start: startTime,
				duration: actualDuration,
			});
		} catch (e) {
			// do nothing
		}
	}
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.reactProfilerTimings.push({
			labelStack,
			type,
			actualDuration,
			baseDuration,
			startTime,
			commitTime,
		});
	} else if (getConfig()?.postInteractionLog?.enabled) {
		postInteractionLog.addProfilerTimings(
			labelStack,
			type,
			actualDuration,
			baseDuration,
			startTime,
			commitTime,
		);
	}
});

const pushToQueue = withProfiling(function pushToQueue(id: string, data: InteractionMetrics) {
	interactionQueue.push({ id, data });
});

let handleInteraction = pushToQueue;

const callCleanUpCallbacks = withProfiling(function callCleanUpCallbacks(
	interaction: InteractionMetrics,
) {
	interaction.cleanupCallbacks.reverse().forEach((cleanUpCallback) => {
		cleanUpCallback();
	});
});

const finishInteraction = withProfiling(function finishInteraction(
	id: string,
	data: InteractionMetrics,
	endTime: number = performance.now(),
) {
	data.end = endTime;
	try {
		// for Firefox 102 and older
		performance.measure(`🛸 [${data.type}] ${data.ufoName} [ttai]`, {
			start: data.start,
			end: data.end,
		});
	} catch (e) {
		// do nothing
	}
	if (data.featureFlags) {
		data.featureFlags.during = Object.fromEntries(currentFeatureFlagsAccessed);
	}
	clearActiveTrace();
	callCleanUpCallbacks(data);
	if (getConfig()?.vc?.stopVCAtInteractionFinish) {
		data.vc = getVCObserver().getVCRawData();
	}

	if (!getConfig()?.experimentalInteractionMetrics?.enabled) {
		remove(id);
	}

	PreviousInteractionLog.name = data.ufoName || 'unknown';
	PreviousInteractionLog.isAborted = data.abortReason != null;
	if (data.ufoName) {
		handleInteraction(id, data);
	}

	if (isPerformanceTracingEnabled()) {
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

	try {
		// dispatch a global window event to notify the measure is completed
		window.dispatchEvent(
			new CustomEvent<InteractionMetrics>('UFO_FINISH_INTERACTION', { detail: data }),
		);
	} catch (error) {
		// do nothing
	}
});

export const sinkInteractionHandler = withProfiling(function sinkInteractionHandler(
	sinkFn: (id: string, data: InteractionMetrics) => void,
) {
	if (handleInteraction === pushToQueue) {
		handleInteraction = sinkFn;
		interactionQueue.forEach((interaction) => {
			sinkFn(interaction.id, interaction.data);
		});
		interactionQueue.length = 0;
	}
});

export const sinkPostInteractionLogHandler = withProfiling(function sinkPostInteractionLogHandler(
	sinkFn: (output: PostInteractionLogOutput) => void | Promise<void>,
) {
	postInteractionLog.sinkHandler(sinkFn);
});

// a flag to prevent multiple submitting
let activeSubmitted = false;

export const tryComplete = withProfiling(function tryComplete(
	interactionId: string,
	endTime?: number,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		const noMoreActiveHolds = interaction.holdActive.size === 0;
		const noMoreExpHolds = interaction.holdExpActive.size === 0;

		const postInteraction = async () => {
			if (getConfig()?.postInteractionLog?.enabled) {
				let experimentalVC90;
				let experimentalTTAI;
				if (getConfig()?.experimentalInteractionMetrics?.enabled) {
					experimentalVC90 = (await getExperimentalVCMetrics(interaction))?.[
						'metric:experimental:vc90'
					] as number;
					const { start, end } = interaction;
					experimentalTTAI = !interaction.abortReason ? Math.round(end - start) : undefined;
				}
				postInteractionLog.onInteractionComplete({
					...interaction,
					experimentalTTAI,
					experimentalVC90,
				});
			}

			if (getConfig()?.experimentalInteractionMetrics?.enabled) {
				remove(interactionId);
			}
			activeSubmitted = false;
		};

		if (noMoreActiveHolds) {
			if (!activeSubmitted) {
				finishInteraction(interactionId, interaction, endTime);
				activeSubmitted = true;
			}

			if (noMoreExpHolds) {
				if (getConfig()?.experimentalInteractionMetrics?.enabled) {
					onExperimentalInteractionComplete(interactionId, interaction, endTime);
				}
				postInteraction();
			}
		}
	}
});

const callCancelCallbacks = withProfiling(function callCancelCallbacks(
	interaction: InteractionMetrics,
) {
	interaction.cancelCallbacks.reverse().forEach((cancelCallback) => {
		cancelCallback();
	});
});

export const abort = withProfiling(function abort(
	interactionId: string,
	abortReason: AbortReasonType,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		callCancelCallbacks(interaction);
		interaction.abortReason = abortReason;
		finishInteraction(interactionId, interaction);
		if (getConfig()?.experimentalInteractionMetrics?.enabled) {
			onExperimentalInteractionComplete(interactionId, interaction);
			remove(interactionId);
		}
	}
});

export const abortByNewInteraction = withProfiling(function abortByNewInteraction(
	interactionId: string,
	interactionName: string,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		callCancelCallbacks(interaction);
		interaction.abortReason = 'new_interaction';
		interaction.abortedByInteractionName = interactionName;
		finishInteraction(interactionId, interaction);
		if (getConfig()?.experimentalInteractionMetrics?.enabled) {
			onExperimentalInteractionComplete(interactionId, interaction);
			remove(interactionId);
		}
	}
});

export const abortAll = withProfiling(function abortAll(
	abortReason: AbortReasonType,
	abortedByInteractionName?: string,
) {
	interactions.forEach((interaction, interactionId) => {
		const noMoreHolds = interaction.holdActive.size === 0;
		if (!noMoreHolds) {
			callCancelCallbacks(interaction);
			interaction.abortReason = abortReason;
			if (abortedByInteractionName != null) {
				interaction.abortedByInteractionName = abortedByInteractionName;
			}
		}

		finishInteraction(interactionId, interaction);
		if (getConfig()?.experimentalInteractionMetrics?.enabled) {
			onExperimentalInteractionComplete(interactionId, interaction);
			remove(interactionId);
		}
	});
});

export const addOnCancelCallback = withProfiling(function addOnCancelCallback(
	id: string,
	cancelCallback: () => void,
) {
	const interaction = interactions.get(id);

	interaction?.cancelCallbacks.push(cancelCallback);
});

export const addNewInteraction = withProfiling(function addNewInteraction(
	interactionId: string,
	ufoName: string,
	type: InteractionType,
	startTime: number,
	rate: number,
	labelStack: LabelStack | null,
	routeName?: string | null,
	trace: TraceIdContext | null = null,
) {
	if (getConfig()?.postInteractionLog?.enabled) {
		postInteractionLog.reset();
	}

	let previousTime = startTime;
	let timeoutTime = CLEANUP_TIMEOUT;
	const timerID: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
		abort(interactionId, 'timeout');
	}, CLEANUP_TIMEOUT);

	function changeTimeout(this: InteractionMetrics, newTime: number) {
		// we compare if the time left is lower than the new time to no
		// extend the timeout beyond the initial waiting time
		const currentTime = performance.now();
		const timeLeft = timeoutTime - (currentTime - previousTime);
		if (timeLeft < newTime) {
			return;
		}
		clearTimeout(this.timerID);
		const newTimerID: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
			abort(interactionId, 'timeout');
		}, newTime);
		timeoutTime = newTime;
		previousTime = currentTime;
		this.timerID = newTimerID;
	}

	const addFeatureFlagsToInteraction = coinflip(getCapabilityRate('feature_flag_access'));

	const metrics: InteractionMetrics = {
		id: interactionId,
		start: startTime,
		end: 0,
		ufoName,
		type,
		previousInteractionName: PreviousInteractionLog.name,
		isPreviousInteractionAborted: PreviousInteractionLog.isAborted === true,
		marks: [],
		customData: [],
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdExpInfo: [],
		holdActive: new Map(),
		holdExpActive: new Map(),
		// measure when we execute this code
		// from this, we can measure the input delay -
		// how long the browser took to hand execution back to JS)
		measureStart: performance.now(),
		rate,
		cancelCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [],
		labelStack,
		routeName: routeName ?? ufoName,
		featureFlags: addFeatureFlagsToInteraction
			? {
					prior: Object.fromEntries(allFeatureFlagsAccessed),
					during: {},
				}
			: undefined,
		knownSegments: [],
		cleanupCallbacks: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID,
		changeTimeout,
		trace,
	};
	if (addFeatureFlagsToInteraction) {
		currentFeatureFlagsAccessed.clear();
	}
	interactions.set(interactionId, metrics);

	const segmentObserver: SegmentObserver = {
		onAdd(segment) {
			metrics.knownSegments.push(segment);
		},
		onRemove() {},
	};
	addSegmentObserver(segmentObserver);
	metrics.cleanupCallbacks.push(() => {
		removeSegmentObserver(segmentObserver);
	});
	metrics.cleanupCallbacks.push(() => {
		clearTimeout(metrics.timerID);
	});
	const awaitBM3TTIList = getAwaitBM3TTIList();
	if (awaitBM3TTIList.includes(ufoName)) {
		addHoldByID(interactionId, [], ufoName, ufoName, true);
	}
	if (type === 'transition') {
		getVCObserver().start({ startTime });
		postInteractionLog.startVCObserver({ startTime });
		if (getConfig()?.experimentalInteractionMetrics?.enabled) {
			experimentalVC.start({ startTime });
		}
	}
});

export const addBrowserMetricEvent = withProfiling(function addBrowserMetricEvent(event: BM3Event) {
	const interaction = getActiveInteraction();
	if (interaction) {
		interaction.legacyMetrics = interaction.legacyMetrics || [];
		interaction.legacyMetrics.push(event);

		if (
			(interaction.type === 'page_load' || interaction.type === 'transition') &&
			event.config?.type === 'PAGE_LOAD'
		) {
			interaction.changeTimeout(CLEANUP_TIMEOUT_AFTER_APDEX);
			removeHoldByID(interaction.id, interaction.ufoName);
		}
	}
});

export const addApdexToAll = withProfiling(function addApdexToAll(apdex: ApdexType) {
	interactions.forEach((interaction, key) => {
		interaction.apdex.push(apdex);
		try {
			// for Firefox 102 and older
			performance.measure(`🛸 ${apdex.key} [bm3_tti]`, {
				start: apdex.startTime ?? interaction.start,
				end: apdex.stopTime,
			});
		} catch (e) {
			// do nothing
		}
		if (interaction.type === 'page_load' || interaction.type === 'transition') {
			interaction.changeTimeout(CLEANUP_TIMEOUT_AFTER_APDEX);
			removeHoldByID(key, interaction.ufoName);
		}
	});
});

export const addApdex = withProfiling(function addApdex(
	interactionId: string,
	apdexInfo: {
		key: string;
		stopTime: number;
		startTime?: number;
		labelStack?: LabelStack;
	},
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.apdex.push(apdexInfo);
		try {
			// for Firefox 102 and older
			performance.measure(`🛸 ${apdexInfo.key} [bm3_tti]`, {
				start: apdexInfo.startTime ?? interaction.start,
				end: apdexInfo.stopTime,
			});
		} catch (e) {
			// do nothing
		}
		if (interaction.type === 'page_load' || interaction.type === 'transition') {
			interaction.changeTimeout(CLEANUP_TIMEOUT_AFTER_APDEX);
			removeHoldByID(interactionId, interaction.ufoName);
		}
	}
});

export const addRequestInfo = withProfiling(function addRequestInfo(
	interactionId: string,
	labelStack: LabelStack,
	requestInfo: RequestInfo,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.requestInfo.push({
			labelStack,
			...requestInfo,
		});
	}
});

const isSegmentLabel = withProfiling(function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
});

const getSegmentCacheKey = withProfiling(function getSegmentCacheKey(labelStack: LabelStack) {
	return labelStack
		.map((l) => {
			if (isSegmentLabel(l)) {
				return `${l.name}_${l.segmentId}`;
			}
			return l.name;
		})
		.join('|');
});

export const addSegment = withProfiling(function addSegment(labelStack: LabelStack) {
	const key = getSegmentCacheKey(labelStack);
	const existingSegment = segmentCache.get(key);
	if (!existingSegment) {
		const segmentInfo: SegmentInfo = { labelStack };
		segmentCache.set(key, segmentInfo);
		segmentObservers.forEach((observer) => {
			observer.onAdd(segmentInfo);
		});
	}
});

export const removeSegment = withProfiling(function removeSegment(labelStack: LabelStack) {
	const key = getSegmentCacheKey(labelStack);
	const segmentInfo = segmentCache.get(key);

	if (segmentInfo) {
		segmentCache.delete(JSON.stringify(labelStack));

		segmentObservers.forEach((observer) => {
			observer.onRemove(segmentInfo);
		});
	}
});

export const addRedirect = withProfiling(function addRedirect(
	interactionId: string,
	fromUfoName: string,
	nextUfoName: string,
	nextRouteName: string,
	time: number,
) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		interaction.ufoName = nextUfoName;
		interaction.routeName = nextRouteName;
		interaction.redirects.push({ fromInteractionName: fromUfoName, time });

		if (isPerformanceTracingEnabled()) {
			const prevRedirect = interaction.redirects.at(-2);
			try {
				// for Firefox 102 and older
				performance.measure(`🛸 ${nextUfoName} [redirect]`, {
					start: prevRedirect?.time ?? interaction.start,
					end: time,
				});
			} catch (e) {
				// do nothing
			}
		}
	}
});

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

export const interactionSpans: Span[] = [];

const defaultLabelStack = [{ name: 'custom' }];

export const addCustomSpans = withProfiling(function addCustomSpans(
	name: string,
	start: number,
	end: number = performance.now(),
	size = 0,
	labelStack: LabelStack = defaultLabelStack,
) {
	const customSpan: Span = {
		type: 'custom',
		name,
		start,
		end,
		labelStack,
		size,
	};

	interactionSpans.push(customSpan);
});
