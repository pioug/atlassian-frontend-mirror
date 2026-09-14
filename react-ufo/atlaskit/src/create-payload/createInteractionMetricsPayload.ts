import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { InteractionMetrics, RevisionPayload } from '../common';
import { getConfig, shouldUseRawDataThirdPartyBehavior } from '../config';
import {
	getEarliestHiddenTiming,
	getHasHiddenTimingBeforeSetup,
	getPageVisibilityTimeline,
	isOpenedInBackground,
	isTabThrottled,
} from '../hidden-timing';
import * as initialPageLoadExtraTiming from '../initial-page-load-extra-timing';
import { interactionSpans as atlaskitInteractionSpans } from '../interaction-metrics';
import { createMemoryStateReport, createPressureStateReport } from '../machine-utilisation';
import type { ResourceTimings } from '../resource-timing';
import { roundEpsilon } from '../round-number';
import * as ssr from '../ssr';
import { getHasAbortingEventDuringSSR } from '../vc/vc-observer-new/get-has-aborting-event-during-ssr';

import type { InteractionMetricsPayloadResult } from './InteractionMetricsPayloadResult';
import type { OptimizedLabelStack } from './common/types';
import { buildSegmentTree } from './common/utils/build-segment-tree';
import { getOldSegmentsLabelStack } from './common/utils/get-old-segments-label-stack';
import { LabelStackRegistry } from './common/utils/label-stack-registry';
import { optimizeLabelStackWithRegistry } from './common/utils/optimize-label-stack-with-registry';
import { sanitizeUfoName } from './common/utils/sanitize-ufo-name';
import { getAssetsMetrics } from './getAssetsMetrics';
import { getBm3TrackerTimings } from './getBm3TrackerTimings';
import { getBundleEvalTimings } from './getBundleEvalTimings';
import { getErrorCounts } from './getErrorCounts';
import { getMetricVariantHoldInfo } from './getMetricVariantHoldInfo';
import { getPreloadInfoPayload } from './getPreloadInfoPayload';
import { getMoreAccuratePageVisibilityUpToTTI } from './getMoreAccuratePageVisibilityUpToTTI';
import { getPPSMetrics } from './getPPSMetrics';
import { getPageVisibilityUpToTTI } from './getPageVisibilityUpToTTI';
import { getPayloadSizeAndAnnotate } from './getPayloadSizeAndAnnotate';
import { getReactProfilerTimingsByMetricWindow } from './getReactProfilerTimingsByMetricWindow';
import { getReactProfilerTimingsForWindow } from './getReactProfilerTimingsForWindow';
import { getResourceTimings } from './getResourceTimings';
import { getResourceTimingsPayload } from './getResourceTimingsPayload';
import { getSSRProperties } from './getSSRProperties';
import { getSegment3pTimingAbortMarkers } from './getSegment3pTimingAbortMarkers';
import { getStylesheetMetrics } from './getStylesheetMetrics';
import { getTracingContextData } from './getTracingContextData';
import { objectToArray } from './objectToArray';
import { optimizeCustomData } from './optimizeCustomData';
import { optimizeRedirects } from './optimizeRedirects';
import { addPerformanceMeasures } from './utils/add-performance-measures';
import { applySegment3pDataBudget } from './utils/apply-segment3p-data-budget';
import { buildSegment3pData } from './utils/build-segment3p-data';
import { getBatteryInfoToLegacyFormat } from './utils/get-battery-info-to-legacy-format';
import { getBrowserMetadataToLegacyFormat } from './utils/get-browser-metadata-to-legacy-format';
import { getMoreAccuratePageVisibilityUpToTTAI } from './utils/get-more-accurate-page-visibility-up-to-ttai';
import { getNavigationMetricsToLegacyFormat } from './utils/get-navigation-metrics-to-legacy-format';
import getPageVisibilityUpToTTAI from './utils/get-page-visibility-up-to-ttai';
import { getPaintMetricsToLegacyFormat } from './utils/get-paint-metrics-to-legacy-format';
import getPayloadSize from './utils/get-payload-size';
import { getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';
import getSSRDoneTimeValue from './utils/get-ssr-done-time-value';
import getVCMetrics from './utils/get-vc-metrics';
import { optimizeApdex } from './utils/optimize-apdex';
import { optimizeCustomTimings } from './utils/optimize-custom-timings';
import { optimizeHoldInfo } from './utils/optimize-hold-info';
import { optimizeMarks } from './utils/optimize-marks';
import { optimizeReactProfilerTimings } from './utils/optimize-react-profiler-timings';
import { optimizeRequestInfo } from './utils/optimize-request-info';
import { optimizeSpans } from './utils/optimize-spans';
import { trimVcDebugData } from './utils/trim-vc-debug-data';

import type { PageLoadInitialSSRMetrics } from './index';
import { MAX_PAYLOAD_SIZE } from './index';

export async function createInteractionMetricsPayload(
	interaction: InteractionMetrics,
	interactionId: string,
	vcMetrics?: Awaited<ReturnType<typeof getVCMetrics>>,
): Promise<InteractionMetricsPayloadResult> {
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

	const reactUFOVersion = getReactUFOPayloadVersion(interaction.type);
	const registry =
		reactUFOVersion === '2.0.0' && fg('platform_ufo_labelstack_dedup')
			? new LabelStackRegistry()
			: undefined;

	const segments =
		!fg('platform_ufo_remove_deprecated_config_fields') && config.killswitchNestedSegments
			? []
			: knownSegments;
	const segmentTree =
		reactUFOVersion === '2.0.0'
			? buildSegmentTree(segments.map((segment) => segment.labelStack))
			: {};
	const isDetailedPayload = pageVisibilityAtTTAI === 'visible';
	const isPageLoadEvent = type === 'page_load' || type === 'transition';
	const isPageLoad = type === 'page_load';

	const calculatePageVisibilityFromTheStartOfPageLoad =
		config.enableBetterPageVisibilityApi && isPageLoadEvent;

	const moreAccuratePageVisibilityAtTTI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTI(interaction)
		: null;
	const moreAccuratePageVisibilityAtTTAI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTAI(interaction)
		: null;

	const labelStack: { labelStack?: OptimizedLabelStack } = interaction.labelStack
		? {
				labelStack: optimizeLabelStackWithRegistry(
					interaction.labelStack,
					reactUFOVersion,
					registry,
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

		if ((isBM3ConfigSSRDoneAsFmp || isUFOConfigSSRDoneAsFmp) && SSRDoneTimeValue !== undefined) {
			try {
				performance.mark(`FMP`, {
					startTime: SSRDoneTimeValue,
					detail: {
						devtools: {
							dataType: 'marker',
						},
					},
				});
			} catch {}
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
		if (window.__UFO_COMPACT_PAYLOAD__ || !isDetailedPayload) {
			return {};
		}

		const spans = [...interaction.spans, ...atlaskitInteractionSpans];
		atlaskitInteractionSpans.length = 0;

		const shouldInclude3pHolds = shouldUseRawDataThirdPartyBehavior(ufoName, type);

		const metricVariantPayload = interaction.metricWindows
			? {
					...getReactProfilerTimingsByMetricWindow(interaction, reactUFOVersion, registry),
					metricWindows: Object.fromEntries(
						Object.entries(interaction.metricWindows).map(([name, window]) => [
							name,
							window
								? {
										...window,
										start: Math.round(window.start),
										end: Math.round(window.end),
									}
								: window,
						]),
					),
					...(interaction.lifecycleObservations
						? {
								lifecycleObservations: interaction.lifecycleObservations.map((observation) => ({
									...observation,
									timestamp: Math.round(observation.timestamp),
								})),
							}
						: {}),
				}
			: {};

		const basePayload = {
			...metricVariantPayload,
			...getMetricVariantHoldInfo(interaction, start, reactUFOVersion, registry),
			errors: interaction.errors.map(({ labelStack, ...others }) => ({
				...others,
				labelStack:
					labelStack && optimizeLabelStackWithRegistry(labelStack, reactUFOVersion, registry),
			})),
			holdActive: [...interaction.holdActive.values()],
			redirects: optimizeRedirects(interaction.redirects, start),
			holdInfo: optimizeHoldInfo(interaction.holdInfo, start, reactUFOVersion, registry),
			spans: optimizeSpans(spans, start, reactUFOVersion, registry),
			requestInfo: optimizeRequestInfo(interaction.requestInfo, start, reactUFOVersion, registry),
			customTimings: optimizeCustomTimings(interaction.customTimings, start),
			bundleEvalTimings: objectToArray(getBundleEvalTimings(start)),
			resourceTimings: getResourceTimingsPayload(resourceTimings),
			...(interaction.segment3pTimings && interaction.segmentExtraData
				? (() => {
						const grouped = buildSegment3pData(
							interaction.segment3pTimings,
							interaction.segmentExtraData,
						);
						if (!grouped) {
							return {};
						}
						// B1+B2: apply soft/hard budget cap with suffix-level drop order
						return { segment3pData: applySegment3pDataBudget(grouped) };
					})()
				: {}),
			...getSegment3pTimingAbortMarkers(interaction.segment3pTimings),
			...(interaction.excluded3pSegmentData &&
			Object.keys(interaction.excluded3pSegmentData).length > 0
				? { excluded3pSegments: Object.values(interaction.excluded3pSegmentData) }
				: {}),
		};

		// Include third-party holds when feature flag is active
		if (shouldInclude3pHolds) {
			return {
				...basePayload,
				hold3pActive: interaction.hold3pActive ? [...interaction.hold3pActive.values()] : [],
				hold3pInfo: optimizeHoldInfo(
					interaction.hold3pInfo ?? [],
					start,
					reactUFOVersion,
					registry,
				),
			};
		}

		return basePayload;
	};
	// Page load & detailed payload
	const getPageLoadDetailedInteractionMetrics = () => {
		if (!isPageLoad || !isDetailedPayload) {
			return {};
		}

		const initialPageLoadExtraTimings = objectToArray(initialPageLoadExtraTiming.getTimings());
		const config = getConfig();

		const defaultSSRTimings = objectToArray(ssr.getSSRTimings());
		const ssrTimingsFromConfig = config?.ssr?.getSSRTimings?.();

		return {
			initialPageLoadExtraTimings,
			SSRTimings: ssrTimingsFromConfig
				? [...ssrTimingsFromConfig, ...defaultSSRTimings]
				: defaultSSRTimings,
		};
	};

	const newUFOName = sanitizeUfoName(ufoName);
	const resourceTimings = getResourceTimings(start, end);
	const standardReactProfilerTimings = getReactProfilerTimingsForWindow(
		interaction.reactProfilerTimings,
		interaction.metricWindows?.standard,
	);

	const [finalVCMetrics, paintMetrics, batteryInfo] = await Promise.all([
		vcMetrics || (await getVCMetrics(interaction)),
		getPaintMetricsToLegacyFormat(type, end),
		getBatteryInfoToLegacyFormat(),
	]);

	addPerformanceMeasures(interaction.start, [
		...((finalVCMetrics?.['ufo:vc:rev'] as RevisionPayload | undefined) || []),
	]);

	const getReactHydrationStats = () => {
		if (!hydration) {
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
				'event:population': config.population,
				'event:schema': '1.0.0',
				'event:sizeInKb': 0,
				'event:source': {
					name: 'react-ufo/web',
					version: reactUFOVersion,
				},
				'event:region': config.region || 'unknown',
				// Only emitted when a product explicitly provides the signal. Absent (not `false`)
				// for products that have not yet wired up a sandbox source, so we never report a
				// sandbox tenant as non-sandbox.
				...(config.isSandbox !== undefined ? { 'event:isSandbox': config.isSandbox } : {}),
				'experience:key': 'custom.interaction-metrics',
				'experience:name': newUFOName,

				// Include CPU usage monitoring data
				'event:cpu:usage': createPressureStateReport(interaction.start, interaction.end),

				'event:memory:usage': createMemoryStateReport(interaction.start, interaction.end),

				'ufo:pageVisibilityHiddenTimestamp': getEarliestHiddenTiming(
					interaction.start,
					interaction.end,
				),

				'ufo:wasPageHiddenBeforeInit': getHasHiddenTimingBeforeSetup(),

				'ufo:isOpenedInBackground': isOpenedInBackground(interaction.type),

				'ufo:isTabThrottled': isTabThrottled(start, end),

				'ufo:pageVisibilityTimeline': getPageVisibilityTimeline(start, end),

				'ufo:hasAbortingInteractionDuringSSR': getHasAbortingEventDuringSSR(),

				// root
				...getBrowserMetadataToLegacyFormat(),
				...batteryInfo,
				...getSSRProperties(type),
				...getAssetsMetrics(interaction, pageLoadInteractionMetrics?.SSRDoneTime),
				...getPPSMetrics(interaction),
				...paintMetrics,
				...getNavigationMetricsToLegacyFormat(type),
				...finalVCMetrics,
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
					apdex: optimizeApdex(interaction.apdex, reactUFOVersion, registry),
					end: Math.round(end),
					...(interaction.end3p ? { end3p: Math.round(interaction.end3p) } : {}),
					start: Math.round(start),
					segments:
						reactUFOVersion === '2.0.0'
							? segmentTree
							: getOldSegmentsLabelStack(segments, interaction.type),
					marks: optimizeMarks(interaction.marks, reactUFOVersion, registry),
					customData: optimizeCustomData(interaction, registry),
					reactProfilerTimings: optimizeReactProfilerTimings(
						standardReactProfilerTimings,
						start,
						reactUFOVersion,
						registry,
					),
					minorInteractions: interaction.minorInteractions,
					...getPreloadInfoPayload(interaction, start),
					...(responsiveness ? { responsiveness } : {}),
					...labelStack,
					...pageLoadInteractionMetrics,
					...getDetailedInteractionMetrics(resourceTimings),
					...getPageLoadDetailedInteractionMetrics(),
					...getBm3TrackerTimings(interaction),
					'metric:ttai': undefined,
					...(unknownElementName ? { unknownElementName } : {}),
					...(unknownElementHierarchy ? { unknownElementHierarchy } : {}),
					...(registry && registry.size > 0 ? { _ls: registry.getLookupTable() } : {}),
				},
				'ufo:payloadTime': roundEpsilon(performance.now() - interactionPayloadStart),
			},
		},
	};

	const size = getPayloadSizeAndAnnotate(payload.attributes.properties);
	const vcRev = (payload.attributes.properties as Record<string, any>)['ufo:vc:rev'];
	if (Array.isArray(vcRev)) {
		const rawData = vcRev.find((item: { revision: string }) => item.revision === 'raw-handler');
		if (rawData) {
			const rawDataSize = getPayloadSize(rawData);
			(payload.attributes.properties as Record<string, unknown>)['ufo:vc:raw:size'] = rawDataSize;
			if (size > MAX_PAYLOAD_SIZE && vcRev.length > 0) {
				(payload.attributes.properties as Record<string, unknown>)[
					'ufo:vc:raw:preservedOverBudget'
				] = true;
			}
		}
	}
	payload.attributes.properties['event:sizeInKb'] = getPayloadSizeAndAnnotate(
		payload.attributes.properties,
	);

	// in order of importance, first one being least important
	// we can add more fields as necessary
	const interactionMetricsFieldsToTrim = [
		'requestInfo',
		'resourceTimings',
		'excluded3pSegments',
		'segment3pData',
		'segment3pTimingAborts',
	];

	// Top-level properties that can be trimmed if payload exceeds size limit
	const topLevelFieldsToTrim = ['ufo:pageVisibilityTimeline'];
	type TrimmableProperties = typeof payload.attributes.properties & {
		interactionMetrics?: typeof payload.attributes.properties.interactionMetrics &
			Record<string, unknown>;
		'event:isTrimmed'?: boolean;
		'event:trimmedFields'?: string[];
	};
	const properties = payload.attributes.properties as TrimmableProperties;
	const interactionMetrics = properties.interactionMetrics as
		| (typeof properties.interactionMetrics & Record<string, unknown>)
		| undefined;

	if (interactionMetrics) {
		for (const field of interactionMetricsFieldsToTrim) {
			if (getPayloadSizeAndAnnotate(properties) <= MAX_PAYLOAD_SIZE) {
				continue;
			}

			interactionMetrics[field] = undefined;
			properties['event:isTrimmed'] = true;

			let trimmedFields = properties['event:trimmedFields'];
			if (!Array.isArray(trimmedFields)) {
				trimmedFields = [];
			}
			trimmedFields.push(`interactionMetrics.${field}`);
			properties['event:trimmedFields'] = trimmedFields;
		}
	}
	// Trim top-level properties if payload still exceeds the limit
	for (const field of topLevelFieldsToTrim) {
		if (getPayloadSizeAndAnnotate(properties) <= MAX_PAYLOAD_SIZE) {
			continue;
		}

		(properties as Record<string, unknown>)[field] = undefined;
		properties['event:isTrimmed'] = true;

		let trimmedFields = properties['event:trimmedFields'];
		if (!Array.isArray(trimmedFields)) {
			trimmedFields = [];
		}
		trimmedFields.push(field);
		properties['event:trimmedFields'] = trimmedFields;
	}

	// If the payload size continues to exceed the limit and interactionMetrics is already trimmed,
	// trim VC debug data (early viewport checkpoints). PIR-30543 - AFO-5033
	trimVcDebugData(properties, getPayloadSizeAndAnnotate(properties), MAX_PAYLOAD_SIZE);

	return payload as InteractionMetricsPayloadResult;
}
