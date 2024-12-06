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
import { ExperimentalInteractionMetrics } from '../create-experimental-interaction-metrics-payload';
import { clearActiveTrace, type TraceIdContext } from '../experience-trace-id-context';
import { allFeatureFlagsAccessed, currentFeatureFlagsAccessed } from '../feature-flags-accessed';
import type { LabelStack } from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { getVCObserver } from '../vc';

import {
	addHoldCriterion,
	addSegmentObserver,
	callCancelCallbacks,
	callCleanUpCallbacks,
	getSegmentCacheKey,
	isPerformanceTracingEnabled,
	labelStackToString,
	pushToQueue,
	reactProfilerTimingMap,
	removeHoldCriterion,
	removeSegmentObserver,
} from './common';
import interactions, {
	CLEANUP_TIMEOUT,
	CLEANUP_TIMEOUT_AFTER_APDEX,
	interactionQueue,
	moduleLoadingRequests,
	segmentCache,
	type SegmentObserver,
	segmentObservers,
} from './common/constants';
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
export const experimentalInteractionLog = new ExperimentalInteractionMetrics();

export function getActiveInteraction() {
	const interactionId = getInteractionId();
	if (!interactionId.current) {
		return;
	}
	return interactions.get(interactionId.current);
}

export function remove(interactionId: string) {
	interactions.delete(interactionId);
}

export function updatePageLoadInteractionName(
	ufoName: string,
	routeName: string | null | undefined = ufoName,
) {
	const interaction = getActiveInteraction();
	if (!interaction || (interaction.type !== 'page_load' && interaction.type !== 'transition')) {
		return;
	}
	interaction.ufoName = ufoName;
	interaction.routeName = routeName;
}

export function addMetadata(interactionId: string, data: Record<string, unknown>) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		Object.keys(data).forEach((key) => {
			interaction.metaData[key] = data[key];
		});
	}
}

export function addCustomData(interactionId: string, labelStack: LabelStack, data: CustomData) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		Object.keys(data).forEach((i) => {
			interaction.customData.push({ labelStack, data: { [i]: data[i] } });
		});
	}
}

export function addCustomTiming(interactionId: string, labelStack: LabelStack, data: CustomTiming) {
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
}

export function addMark(
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
}

export function addMarkToAll(
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
}

export function addSpan(
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
}

export function addSpanToAll(
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
}

export function addPreload(moduleId: string, timestamp: number) {
	addMarkToAll('bundle_preload', moduleId, null, timestamp);
}
export function addLoad(identifier: string, start: number, end: number) {
	addSpanToAll('bundle_load', identifier, null, start, end - start);
}

export function extractModuleName(input: string): string {
	let result = input ?? '';

	result = result.replace(/^\.\/src\/packages\//, '');
	result = result.replace(/^\.\/node_modules\//, '');
	result = result.replace(/(\/src)?\/(index|main)\.(tsx|ts|js|jsx)$/, '');

	return result;
}

export function addHold(
	interactionId: string,
	labelStack: LabelStack,
	name: string,
	experimental: boolean,
) {
	const interaction = interactions.get(interactionId);
	const id = createUUID();
	if (interaction != null) {
		const holdActive = { labelStack, name, start: 0 };
		const start = performance.now();
		if (getConfig()?.enableExperimentalHolds && experimental) {
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
}

export function addHoldByID(
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
}

export function removeHoldByID(interactionId: string, id: string) {
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
}

export function getCurrentInteractionType(interactionId: string) {
	const interaction = interactions.get(interactionId);
	if (interaction) {
		return interaction.type;
	}
	return null;
}

export const ModuleLoadingProfiler = {
	onPreload(moduleId: string, _priority?: number) {
		addPreload(extractModuleName(moduleId), performance.now());
	},
	onLoadStart(info: LoadProfilerEventInfo): void {
		const timeoutId = setTimeout(() => {
			delete moduleLoadingRequests[info.identifier];
		}, 30000);
		const request = {
			start: performance.now(),
			timeoutId,
		};
		moduleLoadingRequests[info.identifier] = request;
	},
	onLoadComplete(info: LoadProfilerEventInfo): void {
		const request = moduleLoadingRequests[info.identifier];
		if (request) {
			clearTimeout(request.timeoutId);
			delete moduleLoadingRequests[info.identifier];
			addLoad(extractModuleName(info.identifier), request.start, performance.now());
		}
	},
	placeholderFallBackMounted(id: string, moduleId: string): void {
		const interactionId = getInteractionId();
		const currentInteractionId = interactionId.current;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		addHoldByID(currentInteractionId!, [], moduleId, id);
	},
	placeholderFallBackUnmounted(id: string): void {
		const interactionId = getInteractionId();
		const currentInteractionId = interactionId.current;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		removeHoldByID(currentInteractionId!, id);
	},
};

export function addError(
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
}

export function addErrorToAll(
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
}

export const addProfilerTimings = (
	interactionId: string,
	labelStack: LabelStack,
	type: 'mount' | 'update' | 'nested-update',
	actualDuration: number,
	baseDuration: number,
	startTime: number,
	commitTime: number,
) => {
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
};

let handleInteraction = pushToQueue;

const finishInteraction = (
	id: string,
	data: InteractionMetrics,
	endTime: number = performance.now(),
) => {
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

	PreviousInteractionLog.name = data.ufoName || 'unknown';
	PreviousInteractionLog.isAborted = data.abortReason != null;
	if (data.ufoName) {
		handleInteraction(id, data);
	}

	if (isPerformanceTracingEnabled()) {
		reactProfilerTimingMap(data);
	}

	try {
		// dispatch a global window event to notify the measure is completed
		window.dispatchEvent(
			new CustomEvent<InteractionMetrics>('UFO_FINISH_INTERACTION', { detail: data }),
		);
	} catch (error) {
		// do nothing
	}
};

export const sinkInteractionHandler = (sinkFn: (id: string, data: InteractionMetrics) => void) => {
	if (handleInteraction === pushToQueue) {
		handleInteraction = sinkFn;
		interactionQueue.forEach((interaction) => {
			sinkFn(interaction.id, interaction.data);
		});
		interactionQueue.length = 0;
	}
};

export const sinkExperimentalHandler = (
	sinkFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
) => {
	experimentalInteractionLog.sinkHandler(sinkFn);
};

export const sinkPostInteractionLogHandler = (
	sinkFn: (output: PostInteractionLogOutput) => void | Promise<void>,
) => {
	postInteractionLog.sinkHandler(sinkFn);
};

// a flag to prevent mutliple submittions
let activeSubmitted = false;

export function tryComplete(interactionId: string, endTime?: number) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		const noMoreActiveHolds = interaction.holdActive.size === 0;
		const noMoreExpHolds = interaction.holdExpActive.size === 0;

		const postInteraction = () => {
			if (getConfig()?.postInteractionLog?.enabled) {
				postInteractionLog.onInteractionComplete(interaction);
			}
			remove(interactionId);
			activeSubmitted = false;
		};

		if (noMoreActiveHolds) {
			if (!activeSubmitted) {
				finishInteraction(interactionId, interaction, endTime);
				activeSubmitted = true;
			}

			if (noMoreExpHolds) {
				if (getConfig()?.enableExperimentalHolds) {
					experimentalInteractionLog.onInteractionComplete(interactionId, interaction, endTime);
				}
				postInteraction();
			}
		}
	}
}

export function abort(interactionId: string, abortReason: AbortReasonType) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		callCancelCallbacks(interaction);
		interaction.abortReason = abortReason;
		finishInteraction(interactionId, interaction);
		if (getConfig()?.enableExperimentalHolds) {
			experimentalInteractionLog.onInteractionComplete(interactionId, interaction);
		}
		remove(interactionId);
	}
}

export function abortByNewInteraction(interactionId: string, interactionName: string) {
	const interaction = interactions.get(interactionId);
	if (interaction != null) {
		callCancelCallbacks(interaction);
		interaction.abortReason = 'new_interaction';
		interaction.abortedByInteractionName = interactionName;
		finishInteraction(interactionId, interaction);
		if (getConfig()?.enableExperimentalHolds) {
			experimentalInteractionLog.onInteractionComplete(interactionId, interaction);
		}
		remove(interactionId);
	}
}

export function abortAll(abortReason: AbortReasonType, abortedByInteractionName?: string) {
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
		if (getConfig()?.enableExperimentalHolds) {
			experimentalInteractionLog.onInteractionComplete(interactionId, interaction);
		}
		remove(interactionId);
	});
}

export function addOnCancelCallback(id: string, cancelCallback: () => void) {
	const interaction = interactions.get(id);

	interaction?.cancelCallbacks.push(cancelCallback);
}

export function addNewInteraction(
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
	}
}

export function addBrowserMetricEvent(event: BM3Event) {
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
}

export function addApdexToAll(apdex: ApdexType) {
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
}

export function addApdex(
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
}

export function addRequestInfo(
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
}

export function addSegment(labelStack: LabelStack) {
	const key = getSegmentCacheKey(labelStack);
	const existingSegment = segmentCache.get(key);
	if (!existingSegment) {
		const segmentInfo: SegmentInfo = { labelStack };
		segmentCache.set(key, segmentInfo);
		segmentObservers.forEach((observer) => {
			observer.onAdd(segmentInfo);
		});
	}
}

export function removeSegment(labelStack: LabelStack) {
	const key = getSegmentCacheKey(labelStack);
	const segmentInfo = segmentCache.get(key);

	if (segmentInfo) {
		segmentCache.delete(JSON.stringify(labelStack));

		segmentObservers.forEach((observer) => {
			observer.onRemove(segmentInfo);
		});
	}
}

export function addRedirect(
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
}

export const interactionSpans: Span[] = [];

const defaultLabelStack = [{ name: 'custom' }];

export function addCustomSpans(
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
}
