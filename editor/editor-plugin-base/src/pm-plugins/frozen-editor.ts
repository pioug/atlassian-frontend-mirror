import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	BROWSER_FREEZE_INTERACTION_TYPE,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { countNodes } from '@atlaskit/editor-common/count-nodes';
import {
	isPerformanceAPIAvailable,
	isPerformanceObserverAvailable,
} from '@atlaskit/editor-common/is-performance-api-available';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	BrowserFreezetracking,
	ExtractInjectionAPI,
	InputTracking,
} from '@atlaskit/editor-common/types';
import { getAnalyticsEventSeverity, type SEVERITY } from '@atlaskit/editor-common/utils/analytics';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BasePlugin } from '../index';
import { setInteractionType } from '../utils/frozen-editor';
import InputLatencyTracker from '../utils/input-latency-tracking';

export const frozenEditorPluginKey = new PluginKey('frozenEditor');

const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
const DEFAULT_SLOW_THRESHOLD = 300;
export const DEFAULT_FREEZE_THRESHOLD = 600;
export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
const DEFAULT_TRACK_SEVERITY_ENABLED = false;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = 100;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = 500;

const dispatchLongTaskEvent =
	(contextIdentifierPlugin: ExtractInjectionAPI<BasePlugin>['contextIdentifier'] | undefined) =>
	(
		dispatchAnalyticsEvent: DispatchAnalyticsEvent,
		view: EditorView,
		time: number,
		getNodeCount: (state: EditorState) => object,
		interactionType?: BROWSER_FREEZE_INTERACTION_TYPE,
		severity?: SEVERITY,
	) => {
		const { state } = view;
		const nodesCount = getNodeCount(state);

		return dispatchAnalyticsEvent({
			action: ACTION.BROWSER_FREEZE,
			actionSubject: ACTION_SUBJECT.EDITOR,
			attributes: {
				objectId:
					contextIdentifierPlugin?.sharedState.currentState()?.contextIdentifierProvider?.objectId,
				freezeTime: time,
				nodeSize: state.doc.nodeSize,
				...nodesCount,
				interactionType,
				severity,
			},
			eventType: EVENT_TYPE.OPERATIONAL,
		});
	};

export default (
		contextIdentifierPlugin: ExtractInjectionAPI<BasePlugin>['contextIdentifier'] | undefined,
	) =>
	(
		dispatchAnalyticsEvent: DispatchAnalyticsEvent,
		inputTracking?: InputTracking,
		browserFreezeTracking?: BrowserFreezetracking,
	) => {
		let interactionType: BROWSER_FREEZE_INTERACTION_TYPE;
		let inputLatencyTracker: InputLatencyTracker | null = null;

		if (browserFreezeTracking?.trackInteractionType) {
			interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.LOADING);
		}

		const samplingRate =
			inputTracking && typeof inputTracking.samplingRate === 'number'
				? inputTracking.samplingRate
				: DEFAULT_KEYSTROKE_SAMPLING_LIMIT;

		//TODO: get right values here based on appearance
		const slowThreshold = DEFAULT_SLOW_THRESHOLD;
		//TODO: get right values here based on appearance
		const freezeThreshold = DEFAULT_FREEZE_THRESHOLD;

		const allowCountNodes = inputTracking && inputTracking.countNodes;
		let prevNodeCountState: EditorState | null = null;
		let prevNodeCount: object = {};

		// Cache the result as we were calling this multiple times
		// and has potential to be expensive
		const getNodeCount = (state: EditorState) => {
			if (state === prevNodeCountState) {
				return prevNodeCount;
			}

			prevNodeCount = allowCountNodes ? countNodes(state) : {};
			prevNodeCountState = state;

			return prevNodeCount;
		};

		const shouldTrackSeverity = inputTracking?.trackSeverity || DEFAULT_TRACK_SEVERITY_ENABLED;
		const severityThresholdNormal =
			inputTracking?.severityNormalThreshold || DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
		const severityThresholdDegraded =
			inputTracking?.severityDegradedThreshold || DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;

		const createDispatchSample =
			(
				action:
					| ACTION.INPUT_PERF_SAMPLING
					| ACTION.INPUT_PERF_SAMPLING_SINGLE_KEYPRESS
					| ACTION.INPUT_PERF_SAMPLING_RENDERED,
				view: EditorView,
			) =>
			(time: number, severity: SEVERITY) => {
				const { state } = view;
				const nodesCount = getNodeCount(state);

				const samplePayload: AnalyticsEventPayload = {
					action,
					actionSubject: ACTION_SUBJECT.EDITOR,
					attributes: {
						time,
						nodeSize: state.doc.nodeSize,
						...nodesCount,
						objectId:
							contextIdentifierPlugin?.sharedState.currentState()?.contextIdentifierProvider
								?.objectId,
						severity: shouldTrackSeverity ? severity : undefined,
					},
					eventType: EVENT_TYPE.OPERATIONAL,
				};

				dispatchAnalyticsEvent(samplePayload);
			};

		const createDispatchAverage =
			(action: ACTION.INPUT_PERF_SAMPLING_AVG, view: EditorView) =>
			(
				{ mean, median, sampleSize }: { mean: number; median: number; sampleSize: number },
				severity: SEVERITY,
			) => {
				const { state } = view;
				const nodeCount = getNodeCount(state);

				const averagePayload: AnalyticsEventPayload = {
					action,
					actionSubject: ACTION_SUBJECT.EDITOR,
					attributes: {
						mean,
						median,
						sampleSize,
						...nodeCount,
						nodeSize: state.doc.nodeSize,
						severity: shouldTrackSeverity ? severity : undefined,
						objectId:
							contextIdentifierPlugin?.sharedState.currentState()?.contextIdentifierProvider
								?.objectId,
					},
					eventType: EVENT_TYPE.OPERATIONAL,
				};

				dispatchAnalyticsEvent(averagePayload);
			};

		return new SafePlugin({
			key: frozenEditorPluginKey,
			props: isPerformanceAPIAvailable()
				? {
						handleTextInput(view) {
							if (browserFreezeTracking?.trackInteractionType) {
								interactionType = BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
							}

							if (inputLatencyTracker) {
								const end = inputLatencyTracker.start();

								// This is called after all handleTextInput events are executed which means first handleTextInput time incorporates following handleTextInput processing time
								// Also this is called before browser rendering so it doesn't count it.
								requestAnimationFrame(end);
							}

							return false;
						},
						handleDOMEvents: browserFreezeTracking?.trackInteractionType
							? {
									click: () => {
										interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.CLICKING);
										return false;
									},
									paste: () => {
										interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.PASTING);
										return false;
									},
								}
							: undefined,
					}
				: undefined,
			view(view) {
				if (!isPerformanceObserverAvailable()) {
					return {};
				}

				inputLatencyTracker = new InputLatencyTracker({
					samplingRate,
					slowThreshold,
					normalThreshold: severityThresholdNormal,
					degradedThreshold: severityThresholdDegraded,
					dispatchSample: createDispatchSample(ACTION.INPUT_PERF_SAMPLING, view),
					dispatchAverage: createDispatchAverage(ACTION.INPUT_PERF_SAMPLING_AVG, view),
					onSlowInput: (time) => {
						const { state } = view;
						const nodesCount = getNodeCount(state);

						dispatchAnalyticsEvent({
							action: ACTION.SLOW_INPUT,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes: {
								time,
								nodeSize: state.doc.nodeSize,
								...nodesCount,
								objectId:
									contextIdentifierPlugin?.sharedState.currentState()?.contextIdentifierProvider
										?.objectId,
							},
							eventType: EVENT_TYPE.OPERATIONAL,
						});
					},
				});

				let observer: PerformanceObserver | undefined;
				try {
					observer = new PerformanceObserver((list) => {
						const perfEntries = list.getEntries();
						for (let i = 0; i < perfEntries.length; i++) {
							const { duration } = perfEntries[i];
							if (duration > freezeThreshold) {
								dispatchLongTaskEvent(contextIdentifierPlugin)(
									dispatchAnalyticsEvent,
									view,
									duration,
									getNodeCount,
									browserFreezeTracking?.trackInteractionType ? interactionType : undefined,
									getAnalyticsEventSeverity(
										duration,
										//TODO: get right values here
										severityThresholdNormal,
										severityThresholdDegraded,
									),
								);
							}
						}
					});

					// register observer for long task notifications
					observer.observe({ entryTypes: ['longtask'] });
				} catch (e) {}

				return {
					destroy: () => {
						inputLatencyTracker?.flush();
						observer?.disconnect();
					},
				};
			},
		});
	};
