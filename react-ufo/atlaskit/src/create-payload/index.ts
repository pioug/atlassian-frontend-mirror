import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags';

// Import common utilities

import { getLighthouseMetrics } from '../additional-payload';
import { CHRReporter } from '../assets';
import * as bundleEvalTiming from '../bundle-eval-timing';
import coinflip from '../coinflip';
import type {
	ApdexType,
	BM3Event,
	InteractionMetrics,
	InteractionType,
	RevisionPayload,
} from '../common';
import { type ResourceTiming } from '../common/react-ufo-payload-schema';
import { getConfig, getExperimentalInteractionRate, getUfoNameOverrides } from '../config';
import { getExperimentalVCMetrics } from '../create-experimental-interaction-metrics-payload';
import { getBm3Timings } from '../custom-timings';
import { getGlobalErrorCount } from '../global-error-handler';
import { getPageVisibilityState } from '../hidden-timing';
import * as initialPageLoadExtraTiming from '../initial-page-load-extra-timing';
import type { LabelStack } from '../interaction-context';
import {
	interactionSpans as atlaskitInteractionSpans,
	segmentUnmountCache,
} from '../interaction-metrics';
import { createMemoryStateReport, createPressureStateReport } from '../machine-utilisation';
import type { ResourceTimings } from '../resource-timing';
import * as resourceTiming from '../resource-timing';
import { filterResourceTimings } from '../resource-timing/common/utils/resource-timing-buffer';
import { roundEpsilon } from '../round-number';
import * as ssr from '../ssr';

import type { OptimizedLabelStack } from './common/types';
import {
	buildSegmentTree,
	getOldSegmentsLabelStack,
	labelStackStartWith,
	optimizeLabelStack,
	sanitizeUfoName,
	stringifyLabelStackFully,
} from './common/utils';
import { createCriticalMetricsPayloads } from './critical-metrics-payload';
import type { CriticalMetricsPayload } from './critical-metrics-payload/types';
import { addPerformanceMeasures } from './utils/add-performance-measures';
import { getBrowserMetadataToLegacyFormat } from './utils/get-browser-metadata';
import getInteractionStatus from './utils/get-interaction-status';
import { getNavigationMetricsToLegacyFormat } from './utils/get-navigation-metrics';
import getPageVisibilityUpToTTAI from './utils/get-page-visibility-up-to-ttai';
import { getPaintMetricsToLegacyFormat } from './utils/get-paint-metrics';
import getPayloadSize from './utils/get-payload-size';
import { getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';
import getSSRDoneTimeValue from './utils/get-ssr-done-time-value';
import getSSRSuccessUtil from './utils/get-ssr-success';
import getTTAI from './utils/get-ttai';
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

function getSSRPhaseSuccess(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRPhaseSuccess() : undefined;
}

function getSSRFeatureFlags(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRFeatureFlags() : undefined;
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

	if (fg('platform_ufo_remove_deprecated_config_fields')) {
		if (PPSMetricsAtTTAI !== null) {
			return PPSMetricsAtTTAI;
		}
	} else {
		if (config?.shouldCalculateLighthouseMetricsFromTTAI && PPSMetricsAtTTAI !== null) {
			return PPSMetricsAtTTAI;
		}

		if (PPSMetricsAtTTI !== null) {
			return {
				...PPSMetricsAtTTI,
				'metrics@ttai': PPSMetricsAtTTAI,
			};
		}
	}

	return {};
}

function getSSRProperties(type: InteractionType) {
	const ssrPhases = getSSRPhaseSuccess(type);

	return {
		'ssr:success': ssrPhases?.done != null ? ssrPhases.done : getSSRSuccessUtil(type),
		'ssr:featureFlags': getSSRFeatureFlags(type),
		...(ssrPhases?.earlyFlush != null
			? {
					'ssr:earlyflush:success': ssrPhases.earlyFlush,
				}
			: null),
		...(ssrPhases?.prefetch != null
			? {
					'ssr:prefetch:success': ssrPhases.prefetch,
				}
			: null),
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
	const { customData, cohortingCustomData, legacyMetrics } = interaction;
	const customDataMap = customData.reduce((result, { labelStack, data }) => {
		const label = stringifyLabelStackFully(labelStack);
		const value = result.get(label)?.data ?? {};

		result.set(label, {
			labelStack: optimizeLabelStack(labelStack, getReactUFOPayloadVersion(interaction.type)),
			data: Object.assign(value, data),
		});

		return result;
	}, new Map());

	// Merge cohorting custom data into the same map
	if (cohortingCustomData && cohortingCustomData.size > 0) {
		const label = stringifyLabelStackFully(interaction.labelStack ?? []);
		const value = customDataMap.get(label)?.data ?? {};

		customDataMap.set(label, {
			labelStack: optimizeLabelStack(
				interaction.labelStack ?? [],
				getReactUFOPayloadVersion(interaction.type),
			),
			data: Object.assign(value, Object.fromEntries(cohortingCustomData)),
		});
	}

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
				if (segmentUnmountCache.has(label) && fg('platform_ufo_segment_unmount_count')) {
					timing.unmountCount = segmentUnmountCache.get(label) || 0;
					segmentUnmountCache.delete(label);
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

function getStylesheetMetrics() {
	try {
		const doc = getDocument();
		if (!doc) {
			return {};
		}
		const stylesheets = Array.from(doc.styleSheets);
		const stylesheetCount = stylesheets.length;
		const cssrules = Array.from(doc.styleSheets).reduce((acc, item) => {
			// Other domain stylesheets throw a SecurityError
			try {
				return acc + item.cssRules.length;
			} catch (e) {
				return acc;
			}
		}, 0);

		const styleElements = doc.querySelectorAll('style').length;
		const styleProps = doc.querySelectorAll('[style]');
		const styleDeclarations = Array.from(doc.querySelectorAll('[style]')).reduce((acc, item) => {
			try {
				if ('style' in item) {
					return acc + (item as HTMLDivElement).style.length;
				} else {
					return acc;
				}
			} catch (e) {
				return acc;
			}
		}, 0);

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
	criticalPayloadCount?: number,
	vcMetrics?: Awaited<ReturnType<typeof getVCMetrics>>,
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
		unknownElementName,
		unknownElementHierarchy,
		hydration,
	} = interaction;
	const pageVisibilityAtTTI = getPageVisibilityUpToTTI(interaction);
	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);

	const segments =
		!fg('platform_ufo_remove_deprecated_config_fields') && config.killswitchNestedSegments
			? []
			: knownSegments;
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

		const isBM3ConfigSSRDoneAsFmp = interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp;
		const isUFOConfigSSRDoneAsFmp =
			interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp || !!config?.ssr?.getSSRDoneTime;

		if (
			!experimental &&
			(isBM3ConfigSSRDoneAsFmp || isUFOConfigSSRDoneAsFmp) &&
			SSRDoneTimeValue !== undefined &&
			fg('ufo_chrome_devtools_uplift')
		) {
			try {
				performance.mark(`FMP`, {
					startTime: SSRDoneTimeValue,
					detail: {
						devtools: {
							dataType: 'marker',
						},
					},
				});
			} catch (e) {}
		}

		return {
			...SSRDoneTime,
			isBM3ConfigSSRDoneAsFmp,
			isUFOConfigSSRDoneAsFmp,
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

	const [finalVCMetrics, experimentalMetrics, paintMetrics] = await Promise.all([
		vcMetrics || (await getVCMetrics(interaction)),
		experimental ? getExperimentalVCMetrics(interaction) : Promise.resolve(undefined),
		getPaintMetricsToLegacyFormat(type, end),
	]);

	if (!experimental) {
		fg('ufo_chrome_devtools_uplift') &&
			addPerformanceMeasures(interaction.start, [
				...((finalVCMetrics?.['ufo:vc:rev'] as RevisionPayload | undefined) || []),
			]);
	}

	const getReactHydrationStats = () => {
		if (!isPageLoad || !hydration) {
			return {};
		}
		return { hydration };
	};

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

				// Include CPU usage monitoring data
				'event:cpu:usage': createPressureStateReport(interaction.start, interaction.end),

				'event:memory:usage': createMemoryStateReport(interaction.start, interaction.end),

				...(criticalPayloadCount !== undefined
					? {
							'ufo:multipayload': true,
							'ufo:criticalPayloadCount': criticalPayloadCount,
						}
					: {}),

				// root
				...getBrowserMetadataToLegacyFormat(),
				...getSSRProperties(type),
				...getAssetsMetrics(interaction, pageLoadInteractionMetrics?.SSRDoneTime),
				...getPPSMetrics(interaction),
				...paintMetrics,
				...getNavigationMetricsToLegacyFormat(type),
				...finalVCMetrics,
				...experimentalMetrics,
				...config.additionalPayloadData?.(interaction),
				...getTracingContextData(interaction),
				...getStylesheetMetrics(),
				...getErrorCounts(interaction),
				...getReactHydrationStats(),

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
							: getOldSegmentsLabelStack(segments, interaction.type),
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
					...(unknownElementName ? { unknownElementName } : {}),
					...(unknownElementHierarchy ? { unknownElementHierarchy } : {}),
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

	const payloads: (
		| CriticalMetricsPayload
		| Awaited<ReturnType<typeof createInteractionMetricsPayload>>
	)[] = [];
	const isCriticalMetricsEnabled = fg('platform_ufo_critical_metrics_payload');

	// Calculate VC metrics once to avoid duplicate expensive calculations
	const vcMetrics = await getVCMetrics(interaction);

	// typeof Promise<CriticalMetricsPayload[]>
	const criticalMetricsPayloads = isCriticalMetricsEnabled
		? await createCriticalMetricsPayloads(interactionId, interaction, vcMetrics)
		: [];

	payloads.push(...criticalMetricsPayloads);

	const criticalPayloadCount = isCriticalMetricsEnabled
		? criticalMetricsPayloads.length
		: undefined;

	const interactionMetricsPayload = await createInteractionMetricsPayload(
		modifiedInteraction,
		interactionId,
		undefined,
		criticalPayloadCount,
		vcMetrics,
	);
	payloads.push(interactionMetricsPayload);

	return payloads.filter(Boolean);
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
