import Bowser from 'bowser-ultralight';

import { getLighthouseMetrics } from '../additional-payload';
import { CHRReporter } from '../assets';
import * as bundleEvalTiming from '../bundle-eval-timing';
import coinflip from '../coinflip';
import type { ApdexType, BM3Event, InteractionMetrics, InteractionType } from '../common';
import { type ResourceTiming } from '../common/react-ufo-payload-schema';
import { getConfig, getExperimentalInteractionRate, getUfoNameOverrides } from '../config';
import { getExperimentalVCMetrics } from '../create-experimental-interaction-metrics-payload';
import { getBm3Timings } from '../custom-timings';
import { getGlobalErrorCount } from '../global-error-handler';
import { getPageVisibilityState } from '../hidden-timing';
import * as initialPageLoadExtraTiming from '../initial-page-load-extra-timing';
import type { LabelStack } from '../interaction-context';
import { interactionSpans as atlaskitInteractionSpans } from '../interaction-metrics';
import type { ResourceTimings } from '../resource-timing';
import * as resourceTiming from '../resource-timing';
import { filterResourceTimings } from '../resource-timing/common/utils/resource-timing-buffer';
import { roundEpsilon } from '../round-number';
import * as ssr from '../ssr';

import type { OptimizedLabelStack } from './common/types';
import {
	buildSegmentTree,
	labelStackStartWith,
	optimizeLabelStack,
	sanitizeUfoName,
	stringifyLabelStackFully,
} from './common/utils';
import getInteractionStatus from './utils/get-interaction-status';
import getPageVisibilityUpToTTAI from './utils/get-page-visibility-up-to-ttai';
import { getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';
import getSSRDoneTimeValue from './utils/get-ssr-done-time-value';
import getVCMetrics from './utils/get-vc-metrics';

function getUfoNameOverride(interaction: InteractionMetrics): string {
	const { ufoName, apdex } = interaction;
	try {
		const ufoNameOverrides = getUfoNameOverrides();
		if (ufoNameOverrides != null) {
			const metricKey = apdex.length > 0 ? apdex[0].key : '';
			if (ufoNameOverrides[ufoName][metricKey]) {
				return ufoNameOverrides[ufoName][metricKey];
			}
		}
		return ufoName;
	} catch (e: unknown) {
		return ufoName;
	}
}

function getEarliestLegacyStopTime(interaction: InteractionMetrics, labelStack: LabelStack) {
	let earliestLegacyStopTime: number | null = null;
	interaction.apdex.forEach((a) => {
		if (!a?.stopTime) {
			return;
		}
		if (!labelStackStartWith(a.labelStack ?? [], labelStack)) {
			return;
		}
		if (a.stopTime > interaction.start && (earliestLegacyStopTime ?? a.stopTime) >= a.stopTime) {
			earliestLegacyStopTime = a.stopTime;
		}
	});

	return earliestLegacyStopTime;
}

function getBm3EndTimeOrFallbackValue(
	interaction: InteractionMetrics,
	labelStack: LabelStack = [],
	fallbackValue = interaction.end,
) {
	if (interaction.type === 'press') {
		return fallbackValue;
	}

	return getEarliestLegacyStopTime(interaction, labelStack) ?? fallbackValue;
}

function getPageVisibilityUpToTTI(interaction: InteractionMetrics) {
	const { start } = interaction;
	const bm3EndTimeOrInteractionEndTime = getBm3EndTimeOrFallbackValue(interaction);
	return getPageVisibilityState(start, bm3EndTimeOrInteractionEndTime);
}

function getVisibilityStateFromPerformance(stop: number) {
	try {
		const results = performance.getEntriesByType('visibility-state');
		if (!results || results.length === 0) {
			return null;
		}
		return results.reduce((acc: null | string = null, { name, startTime }) => {
			if (startTime > stop) {
				return acc;
			}
			if (acc === null && name === null) {
				return null;
			}
			if (acc === null) {
				return name;
			}
			if (acc !== name) {
				return 'mixed';
			}
			return acc;
		}, null);
	} catch (e) {
		return null;
	}
}

function getMoreAccuratePageVisibilityUpToTTI(interaction: InteractionMetrics) {
	const old = getPageVisibilityUpToTTI(interaction);
	const tti = getEarliestLegacyStopTime(interaction, []);
	if (!tti) {
		return old;
	}
	const buffered = getVisibilityStateFromPerformance(tti);
	if (!buffered) {
		return old;
	}
	if (buffered !== old) {
		return 'mixed';
	}
	return old;
}

function getMoreAccuratePageVisibilityUpToTTAI(interaction: InteractionMetrics) {
	const old = getPageVisibilityUpToTTAI(interaction);
	const buffered = getVisibilityStateFromPerformance(interaction.end);
	if (!buffered) {
		return old;
	}
	if (buffered !== old) {
		return 'mixed';
	}
	return old;
}

function getResourceTimings(start: number, end: number) {
	return resourceTiming.getResourceTimings(start, end) ?? undefined;
}

function getBundleEvalTimings(start: number) {
	return bundleEvalTiming.getBundleEvalTimings(start);
}

function getSSRSuccess(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRSuccess() : undefined;
}

function getSSRFeatureFlags(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRFeatureFlags() : undefined;
}

const getLCP: (end: number) => Promise<number | null> = (end) => {
	return new Promise((resolve) => {
		let observer: PerformanceObserver;
		const timeout = setTimeout(() => {
			observer?.disconnect();
			resolve(null);
		}, 200);

		const performanceObserverCallback: PerformanceObserverCallback = (list) => {
			const entries = Array.from(list.getEntries());
			const lastEntry = entries.reduce<PerformanceEntry | null>((agg, entry) => {
				// Use the latest LCP candidate before TTAI
				if (entry.startTime <= end && (agg === null || agg.startTime < entry.startTime)) {
					return entry;
				}
				return agg;
			}, null);

			clearTimeout(timeout);

			if (!lastEntry || lastEntry === null) {
				resolve(null);
			} else {
				resolve(lastEntry.startTime);
			}
		};

		observer = new PerformanceObserver(performanceObserverCallback);
		observer.observe({ type: 'largest-contentful-paint', buffered: true });
	});
};

async function getPaintMetrics(type: InteractionType, end: number) {
	if (type !== 'page_load') {
		return {};
	}
	const metrics: Record<string, number> = {};
	performance.getEntriesByType('paint').forEach((entry) => {
		if (entry.name === 'first-paint') {
			metrics['metric:fp'] = Math.round(entry.startTime);
		}
		if (entry.name === 'first-contentful-paint') {
			metrics['metric:fcp'] = Math.round(entry.startTime);
		}
	});

	const lcp = await getLCP(end);
	if (lcp) {
		metrics['metric:lcp'] = Math.round(lcp);
	}

	return metrics;
}

function getTTAI(interaction: InteractionMetrics) {
	const { start, end } = interaction;
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	return !interaction.abortReason && pageVisibilityUpToTTAI === 'visible'
		? Math.round(end - start)
		: undefined;
}

function getNavigationMetrics(type: InteractionType) {
	if (type !== 'page_load') {
		return {};
	}
	const entries = performance.getEntriesByType('navigation');
	if (entries.length === 0) {
		return {};
	}
	const navigation = entries[0] as PerformanceNavigationTiming;

	const metrics = {
		// From https://www.w3.org/TR/resource-timing/
		redirectStart: Math.round(navigation.redirectStart),
		redirectEnd: Math.round(navigation.redirectEnd),
		fetchStart: Math.round(navigation.fetchStart),
		domainLookupStart: Math.round(navigation.domainLookupStart),
		domainLookupEnd: Math.round(navigation.domainLookupEnd),
		connectStart: Math.round(navigation.connectStart),
		connectEnd: Math.round(navigation.connectEnd),
		secureConnectionStart: Math.round(navigation.secureConnectionStart),
		requestStart: Math.round(navigation.requestStart),
		responseStart: Math.round(navigation.responseStart),
		responseEnd: Math.round(navigation.responseEnd),
		encodedBodySize: Math.round(navigation.encodedBodySize),
		decodedBodySize: Math.round(navigation.decodedBodySize),
		transferSize: Math.round(navigation.transferSize),

		// From https://www.w3.org/TR/navigation-timing-2/
		redirectCount: navigation.redirectCount,
		type: navigation.type,
		unloadEventEnd: Math.round(navigation.unloadEventEnd),
		unloadEventStart: Math.round(navigation.unloadEventStart),
		workerStart: Math.round(navigation.workerStart),

		nextHopProtocol: navigation.nextHopProtocol,

		// The following properties are ignored because they provided limited value on a modern stack (e.g. the content
		// is usually rendered and interactive before the dom is fully parsed, dont't play well with streamed content...)
		//   * domComplete
		//   * domContentLoadedEventEnd
		//   * domContentLoadedEventStart
		//   * domInteractive
		//   * loadEventEnd
		//   * loadEventStart
	};
	return {
		'metrics:navigation': metrics,
	};
}

function getPPSMetrics(interaction: InteractionMetrics) {
	const { start, end } = interaction;
	const config = getConfig();
	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	const tti = interaction.apdex?.[0]?.stopTime;
	const ttai =
		interactionStatus.originalInteractionStatus === 'SUCCEEDED' &&
		pageVisibilityUpToTTAI === 'visible'
			? Math.round(end - start)
			: undefined;

	const PPSMetricsAtTTI = tti !== undefined ? getLighthouseMetrics({ start, stop: tti }) : null;
	const PPSMetricsAtTTAI =
		ttai !== undefined
			? getLighthouseMetrics({
					start,
					stop: interaction.end,
				})
			: null;

	if (config?.shouldCalculateLighthouseMetricsFromTTAI && PPSMetricsAtTTAI !== null) {
		return PPSMetricsAtTTAI;
	}

	if (PPSMetricsAtTTI !== null) {
		return {
			...PPSMetricsAtTTI,
			'metrics@ttai': PPSMetricsAtTTAI,
		};
	}

	return {};
}

function getSSRProperties(type: InteractionType) {
	return {
		'ssr:success': getSSRSuccess(type),
		'ssr:featureFlags': getSSRFeatureFlags(type),
	};
}

function getAssetsMetrics(interaction: InteractionMetrics, SSRDoneTime: number | undefined) {
	try {
		const config = getConfig();
		const { type } = interaction;
		const allowedTypes = ['page_load'];
		const assetsConfig = config?.assetsConfig;
		if (!allowedTypes.includes(type) || !assetsConfig) {
			// Skip if: type not allowed or assetsClassification isn't configured
			return {};
		}
		const reporter = new CHRReporter();
		const resourceTimings = filterResourceTimings(interaction.start, interaction.end);
		const assets = reporter.get(resourceTimings, assetsConfig, SSRDoneTime);
		if (assets) {
			// Only add assets in case it exists
			return { 'event:assets': assets };
		}
		return {};
	} catch (error) {
		// Skip CHR in case of error
		return {};
	}
}

function getBrowserMetadata() {
	const data: {
		'event:browser:name'?: string;
		'event:browser:version'?: string;
		'event:cpus'?: number;
		'event:memory'?: number;
		'event:network:effectiveType'?: string;
		'event:network:rtt'?: number;
		'event:network:downlink'?: number;
		'event:localHour'?: number;
		'event:localDayOfWeek'?: number;
		'event:localTimezoneOffset'?: number;
	} = {};

	const now = new Date();
	data['event:localHour'] = now.getHours(); // returns the hours for this date according to local time
	data['event:localDayOfWeek'] = now.getDay(); // Sunday - Saturday : 0 - 6
	data['event:localTimezoneOffset'] = now.getTimezoneOffset(); // A number representing the difference, in minutes, between the date as evaluated in the UTC time zone and as evaluated in the local time zone.

	if (navigator.userAgent != null) {
		const browser = Bowser.getParser(navigator.userAgent);
		data['event:browser:name'] = browser.getBrowserName();
		data['event:browser:version'] = browser.getBrowserVersion();
	}

	if (navigator.hardwareConcurrency != null) {
		data['event:cpus'] = navigator.hardwareConcurrency;
	}

	if ((navigator as any).deviceMemory != null) {
		data['event:memory'] = (navigator as any).deviceMemory;
	}

	// eslint-disable-next-line compat/compat
	if ((navigator as any).connection != null) {
		data['event:network:effectiveType'] = (navigator as any).connection.effectiveType;
		data['event:network:rtt'] = (navigator as any).connection.rtt;
		data['event:network:downlink'] = (navigator as any).connection.downlink;
	}

	return data;
}

function getTracingContextData(interaction: InteractionMetrics) {
	const { trace, start } = interaction;
	let tracingContextData = {};

	if (trace) {
		tracingContextData = {
			'ufo:tracingContext': {
				'X-B3-TraceId': trace.traceId,
				'X-B3-SpanId': trace.spanId,
				// eslint-disable-next-line compat/compat
				browserTimeOrigin: +(performance.timeOrigin + start).toFixed(2),
			},
		};
	}

	return tracingContextData;
}

function optimizeCustomData(interaction: InteractionMetrics) {
	const { customData, legacyMetrics } = interaction;
	const customDataMap = customData.reduce((result, { labelStack, data }) => {
		const label = stringifyLabelStackFully(labelStack);
		const value = result.get(label)?.data ?? {};

		result.set(label, {
			labelStack: optimizeLabelStack(labelStack, getReactUFOPayloadVersion(interaction.type)),
			data: Object.assign(value, data),
		});

		return result;
	}, new Map());

	if (legacyMetrics) {
		const legacyMetricsFiltered = legacyMetrics
			.filter((item) => item.type === 'PAGE_LOAD')
			.reduce((result: any, currentValue) => {
				for (const [key, value] of Object.entries(currentValue.custom || {})) {
					const label = stringifyLabelStackFully([]);
					const labelValue = result.get(label)?.data ?? {};
					result.set(label, {
						labelStack: optimizeLabelStack([], getReactUFOPayloadVersion(interaction.type)),
						data: Object.assign(labelValue, { [key]: value }),
					});
				}
				return result;
			}, new Map());
		return [...customDataMap.values(), ...legacyMetricsFiltered.values()];
	}

	return [...customDataMap.values()];
}

function optimizeReactProfilerTimings(
	reactProfilerTimings: InteractionMetrics['reactProfilerTimings'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const reactProfilerTimingsMap = reactProfilerTimings.reduce(
		(result, { labelStack, startTime, commitTime, actualDuration, type }) => {
			if (labelStack && startTime >= interactionStart) {
				const label = stringifyLabelStackFully(labelStack);
				const start = Math.round(startTime);
				const end = Math.round(commitTime);

				const timing = result.get(label) || {
					labelStack: optimizeLabelStack(labelStack, reactUFOVersion),
					startTime: start,
					endTime: end,
					mountCount: 0,
					rerenderCount: 0,
					renderDuration: 0,
				};

				if (start < timing.startTime) {
					timing.startTime = start;
				}
				if (end > timing.endTime) {
					timing.endTime = end;
				}
				if (type === 'mount') {
					timing.mountCount += 1;
				}
				if (type === 'update') {
					timing.rerenderCount += 1;
				}
				timing.renderDuration += Math.round(actualDuration);

				result.set(label, timing);
			}

			return result;
		},
		new Map(),
	);

	return [...reactProfilerTimingsMap.values()];
}

function optimizeRedirects(redirects: InteractionMetrics['redirects'], interactionStart: number) {
	let lastRedirectTime = interactionStart;
	const updatedRedirects = redirects
		.sort((a, b) => a.time - b.time)
		.reduce(
			(result, redirect) => {
				const { fromInteractionName, time } = redirect;

				if (lastRedirectTime >= interactionStart) {
					result.push({
						labelStack: [{ n: fromInteractionName }],
						startTime: Math.round(lastRedirectTime),
						endTime: Math.round(time),
					});
				}
				lastRedirectTime = time;

				return result;
			},
			[] as {
				labelStack: OptimizedLabelStack;
				startTime: number;
				endTime: number;
			}[],
		);

	return updatedRedirects;
}

function optimizeHoldInfo(
	holdInfo: InteractionMetrics['holdInfo'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const holdInfoMap = holdInfo.reduce((result, hold) => {
		const { labelStack, name, start, end, ignoreOnSubmit } = hold;

		if (labelStack && !ignoreOnSubmit && start >= interactionStart) {
			const label = stringifyLabelStackFully([...labelStack, { name }]);
			const startTime = Math.round(start);
			const endTime = Math.round(end);

			const timing = result.get(label) || {
				labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
				startTime,
				endTime,
			};

			if (startTime < timing.startTime) {
				timing.startTime = startTime;
			}
			if (endTime > timing.endTime) {
				timing.endTime = endTime;
			}

			result.set(label, timing);
		}

		return result;
	}, new Map());

	return [...holdInfoMap.values()];
}

function optimizeSpans(
	spans: InteractionMetrics['spans'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const updatedSpans = spans.reduce(
		(result, span) => {
			const { labelStack, type, name, start, end } = span;

			if (labelStack && start >= interactionStart) {
				result.push({
					labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
					startTime: Math.round(start),
					endTime: Math.round(end),
					type,
				});
			}

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
			type: string;
		}[],
	);

	return updatedSpans;
}

function optimizeRequestInfo(
	requestInfo: InteractionMetrics['requestInfo'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const updatedRequestInfo = requestInfo.reduce(
		(result, reqInfo) => {
			const { labelStack, name, start, end, networkStart, networkComplete } = reqInfo;
			const startTime = networkStart ?? start;
			const endTime = networkComplete ?? end;

			if (labelStack && start >= interactionStart && endTime) {
				result.push({
					labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
					startTime: Math.round(startTime),
					endTime: Math.round(endTime),
				});
			}

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
		}[],
	);

	return updatedRequestInfo;
}

function optimizeCustomTimings(
	customTimings: InteractionMetrics['customTimings'],
	interactionStart: number,
) {
	return customTimings.reduce(
		(result, item) => {
			Object.keys(item.data).forEach((key) => {
				if (item.data[key].startTime >= interactionStart) {
					result.push({
						labelStack: [{ n: key }],
						startTime: Math.round(item.data[key].startTime),
						endTime: Math.round(item.data[key].endTime),
					});
				}
			});

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
		}[],
	);
}

function optimizeMarks(
	marks: InteractionMetrics['marks'],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	return marks.map(({ labelStack, time, ...others }) => ({
		...others,
		labelStack: labelStack && optimizeLabelStack(labelStack, reactUFOVersion),
		time: Math.round(time),
	}));
}

function optimizeApdex(
	apdex: ApdexType[],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	return apdex.map(({ stopTime, labelStack, ...others }) => ({
		...others,
		stopTime: Math.round(stopTime),
		...(labelStack ? { labelStack: optimizeLabelStack(labelStack, reactUFOVersion) } : {}),
	}));
}

function objectToArray(obj: Record<string, any> = {}) {
	return Object.keys(obj).reduce(
		(result, key) => {
			result.push({
				label: key,
				data: obj[key],
			});

			return result;
		},
		[] as { label: string; data: any }[],
	);
}

function getBM3SubmetricsTimings(submetrics?: BM3Event[]) {
	if (!submetrics) {
		return null;
	}
	const submetricsTimings: any = submetrics
		.filter((item) => {
			return typeof item.stop === 'number' && !!item.key && typeof item.start === 'number';
		})
		.map((item) => {
			let childSubmetrics;
			const newKey = `include/${item.key}`;
			if (item.submetrics) {
				childSubmetrics = getBM3SubmetricsTimings(item.submetrics);
			}
			return {
				[newKey]: {
					endTime: item.stop! - item.start!,
					startTime: item.start!,
				},
				...(childSubmetrics ? childSubmetrics : {}),
			};
		});

	return submetricsTimings;
}

function getBm3TrackerTimings(interaction: InteractionMetrics) {
	const interactionLegacyMetrics = interaction.legacyMetrics;
	if (!interactionLegacyMetrics) {
		return {};
	}
	const legacyMetrics = interactionLegacyMetrics
		.map((item) => {
			return {
				key: item.key,
				startTime: item.start,
				stopTime: item.stop,
				type: item.config?.type,
				reactUFOName: item.config?.reactUFOName,
				fmp: item.marks?.['fmp'] || item.stop,
				source: 'bm3',
				timings: getBm3Timings(item.marks, item.config.timings),
				submetrics: getBM3SubmetricsTimings(item.submetrics),
				pageVisibleState: item.pageVisibleState,
			};
		})
		.filter((item) => !!item.type);
	return { legacyMetrics };
}

function getPayloadSize(payload: object): number {
	return Math.round(new TextEncoder().encode(JSON.stringify(payload)).length / 1024);
}

function getStylesheetMetrics() {
	try {
		const stylesheets = Array.from(document.styleSheets);
		const stylesheetCount = stylesheets.length;
		const cssrules = Array.from(document.styleSheets).reduce((acc, item) => {
			// Other domain stylesheets throw a SecurityError
			try {
				return acc + item.cssRules.length;
			} catch (e) {
				return acc;
			}
		}, 0);

		const styleElements = document.querySelectorAll('style').length;
		const styleProps = document.querySelectorAll('[style]');
		const styleDeclarations = Array.from(document.querySelectorAll('[style]')).reduce(
			(acc, item) => {
				try {
					if ('style' in item) {
						return acc + (item as HTMLDivElement).style.length;
					} else {
						return acc;
					}
				} catch (e) {
					return acc;
				}
			},
			0,
		);

		return {
			'ufo:stylesheets': stylesheetCount,
			'ufo:styleElements': styleElements,
			'ufo:styleProps': styleProps.length,
			'ufo:styleDeclarations': styleDeclarations,
			'ufo:cssrules': cssrules,
		};
	} catch (e) {
		return {};
	}
}

let regularTTAI: number | undefined;
let expTTAI: number | undefined;

function getErrorCounts(interaction: InteractionMetrics) {
	return {
		'ufo:errors:globalCount': getGlobalErrorCount(),
		'ufo:errors:count': interaction.errors.length,
	};
}

type PageLoadInitialSSRMetrics = {
	SSRDoneTime?: number;
	isBM3ConfigSSRDoneAsFmp?: boolean;
	isUFOConfigSSRDoneAsFmp?: boolean;
};

async function createInteractionMetricsPayload(
	interaction: InteractionMetrics,
	interactionId: string,
	experimental?: boolean,
) {
	const interactionPayloadStart = performance.now();
	const config = getConfig();
	if (!config) {
		throw Error('UFO Configuration not provided');
	}
	const {
		end,
		start,
		ufoName,
		knownSegments,
		rate,
		type,
		abortReason,
		routeName,
		featureFlags,
		previousInteractionName,
		isPreviousInteractionAborted,
		abortedByInteractionName,
		responsiveness,
	} = interaction;
	const pageVisibilityAtTTI = getPageVisibilityUpToTTI(interaction);
	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);

	const segments = config.killswitchNestedSegments ? [] : knownSegments;
	const segmentTree =
		getReactUFOPayloadVersion(interaction.type) === '2.0.0'
			? buildSegmentTree(segments.map((segment) => segment.labelStack))
			: {};
	const isDetailedPayload = pageVisibilityAtTTAI === 'visible';
	const isPageLoad = type === 'page_load';

	const calculatePageVisibilityFromTheStartOfPageLoad =
		config.enableBetterPageVisibilityApi && isPageLoad;

	const moreAccuratePageVisibilityAtTTI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTI(interaction)
		: null;
	const moreAccuratePageVisibilityAtTTAI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTAI(interaction)
		: null;

	const labelStack: { labelStack?: OptimizedLabelStack } = interaction.labelStack
		? {
				labelStack: optimizeLabelStack(
					interaction.labelStack,
					getReactUFOPayloadVersion(interaction.type),
				),
			}
		: {};
	// Page Load
	const getInitialPageLoadSSRMetrics: () => PageLoadInitialSSRMetrics = () => {
		if (!isPageLoad) {
			return {};
		}
		const config = getConfig();
		const SSRDoneTimeValue = getSSRDoneTimeValue(config);
		const SSRDoneTime =
			SSRDoneTimeValue !== undefined ? { SSRDoneTime: Math.round(SSRDoneTimeValue) } : {};
		return {
			...SSRDoneTime,
			isBM3ConfigSSRDoneAsFmp: interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp,
			isUFOConfigSSRDoneAsFmp:
				interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp || !!config?.ssr?.getSSRDoneTime,
		};
	};
	const pageLoadInteractionMetrics = getInitialPageLoadSSRMetrics();

	// Detailed payload. Page visibility = visible
	const getDetailedInteractionMetrics = (resourceTimings: ResourceTimings) => {
		if (experimental || window.__UFO_COMPACT_PAYLOAD__ || !isDetailedPayload) {
			return {};
		}

		const spans = [...interaction.spans, ...atlaskitInteractionSpans];
		atlaskitInteractionSpans.length = 0;

		return {
			errors: interaction.errors.map(({ labelStack, ...others }) => ({
				...others,
				labelStack:
					labelStack && optimizeLabelStack(labelStack, getReactUFOPayloadVersion(interaction.type)),
			})),
			holdActive: [...interaction.holdActive.values()],
			redirects: optimizeRedirects(interaction.redirects, start),
			holdInfo: optimizeHoldInfo(
				experimental ? interaction.holdExpInfo : interaction.holdInfo,
				start,
				getReactUFOPayloadVersion(interaction.type),
			),
			spans: optimizeSpans(spans, start, getReactUFOPayloadVersion(interaction.type)),
			requestInfo: optimizeRequestInfo(
				interaction.requestInfo,
				start,
				getReactUFOPayloadVersion(interaction.type),
			),
			customTimings: optimizeCustomTimings(interaction.customTimings, start),
			bundleEvalTimings: objectToArray(getBundleEvalTimings(start)),
			resourceTimings: objectToArray(resourceTimings) as ResourceTiming[],
		};
	};
	// Page load & detailed payload
	const getPageLoadDetailedInteractionMetrics = () => {
		if (!isPageLoad || !isDetailedPayload) {
			return {};
		}
		const config = getConfig();
		return {
			initialPageLoadExtraTimings: objectToArray(initialPageLoadExtraTiming.getTimings()),
			SSRTimings: config?.ssr?.getSSRTimings
				? config.ssr.getSSRTimings()
				: objectToArray(ssr.getSSRTimings()),
		};
	};

	if (experimental) {
		expTTAI = getTTAI(interaction);
	} else {
		regularTTAI = getTTAI(interaction);
	}

	const newUFOName = sanitizeUfoName(ufoName);
	const resourceTimings = getResourceTimings(start, end);

	const [vcMetrics, experimentalMetrics, paintMetrics] = await Promise.all([
		getVCMetrics(interaction),
		experimental ? getExperimentalVCMetrics(interaction) : Promise.resolve(undefined),
		getPaintMetrics(type, end),
	]);

	const payload = {
		actionSubject: 'experience',
		action: 'measured',
		eventType: 'operational',
		source: 'measured',
		tags: ['observability'],
		attributes: {
			properties: {
				// basic
				'event:hostname': window.location?.hostname || 'unknown',
				'event:product': config.product,
				'event:schema': '1.0.0',
				'event:sizeInKb': 0,
				'event:source': {
					name: 'react-ufo/web',
					version: getReactUFOPayloadVersion(interaction.type),
				},
				'event:region': config.region || 'unknown',
				'experience:key': experimental
					? 'custom.experimental-interaction-metrics'
					: 'custom.interaction-metrics',
				'experience:name': newUFOName,

				// root
				...getBrowserMetadata(),
				...getSSRProperties(type),
				...getAssetsMetrics(interaction, pageLoadInteractionMetrics?.SSRDoneTime),
				...getPPSMetrics(interaction),
				...paintMetrics,
				...getNavigationMetrics(type),
				...vcMetrics,
				...experimentalMetrics,
				...config.additionalPayloadData?.(interaction),
				...getTracingContextData(interaction),
				...getStylesheetMetrics(),
				...getErrorCounts(interaction),

				interactionMetrics: {
					namePrefix: config.namePrefix || '',
					segmentPrefix: config.segmentPrefix || '',
					interactionId,
					pageVisibilityAtTTI,
					pageVisibilityAtTTAI,
					experimental__pageVisibilityAtTTI: moreAccuratePageVisibilityAtTTI,
					experimental__pageVisibilityAtTTAI: moreAccuratePageVisibilityAtTTAI,

					// raw interaction metrics
					rate,
					routeName,
					type,
					abortReason,
					featureFlags,
					previousInteractionName,
					isPreviousInteractionAborted,
					abortedByInteractionName,

					// performance
					apdex: optimizeApdex(interaction.apdex, getReactUFOPayloadVersion(interaction.type)),
					end: Math.round(end),
					start: Math.round(start),
					segments:
						getReactUFOPayloadVersion(interaction.type) === '2.0.0'
							? segmentTree
							: segments.map(({ labelStack, ...others }) => ({
									...others,
									labelStack: optimizeLabelStack(
										labelStack,
										getReactUFOPayloadVersion(interaction.type),
									),
								})),
					marks: optimizeMarks(interaction.marks, getReactUFOPayloadVersion(interaction.type)),
					customData: optimizeCustomData(interaction),
					reactProfilerTimings: optimizeReactProfilerTimings(
						interaction.reactProfilerTimings,
						start,
						getReactUFOPayloadVersion(interaction.type),
					),
					...(responsiveness ? { responsiveness } : {}),
					...labelStack,
					...pageLoadInteractionMetrics,
					...getDetailedInteractionMetrics(resourceTimings),
					...getPageLoadDetailedInteractionMetrics(),
					...getBm3TrackerTimings(interaction),
					'metric:ttai': experimental ? regularTTAI || expTTAI : undefined,
					'metric:experimental:ttai': expTTAI,
				},
				'ufo:payloadTime': roundEpsilon(performance.now() - interactionPayloadStart),
			},
		},
	};

	if (experimental) {
		regularTTAI = undefined;
		expTTAI = undefined;
	}

	payload.attributes.properties['event:sizeInKb'] = getPayloadSize(payload.attributes.properties);
	return payload;
}

export async function createPayloads(interactionId: string, interaction: InteractionMetrics) {
	const ufoNameOverride = getUfoNameOverride(interaction);
	const modifiedInteraction = { ...interaction, ufoName: ufoNameOverride };
	const interactionMetricsPayload = await createInteractionMetricsPayload(
		modifiedInteraction,
		interactionId,
	);

	return [interactionMetricsPayload];
}

export async function createExperimentalMetricsPayload(
	interactionId: string,
	interaction: InteractionMetrics,
) {
	const config = getConfig();

	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	const ufoName = sanitizeUfoName(interaction.ufoName);
	const rate = getExperimentalInteractionRate(ufoName, interaction.type);

	if (!coinflip(rate)) {
		return null;
	}

	const pageVisibilityState = getPageVisibilityState(interaction.start, interaction.end);

	if (pageVisibilityState !== 'visible') {
		return null;
	}

	const result = await createInteractionMetricsPayload(interaction, interactionId, true);

	return result;
}
