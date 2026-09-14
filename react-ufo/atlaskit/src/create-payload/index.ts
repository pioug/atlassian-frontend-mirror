/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
export const MAX_PAYLOAD_SIZE: any = 230;

export type PageLoadInitialSSRMetrics = {
	SSRDoneTime?: number;
	isBM3ConfigSSRDoneAsFmp?: boolean;
	isUFOConfigSSRDoneAsFmp?: boolean;
};

/**
 * @deprecated Use `import { createPayloads } from '@atlaskit/react-ufo/create-payloads'` instead.
 */
export { createPayloads } from './createPayloads';

/**
 * @deprecated Use `import { createExtraSearchPageInteractionPayload } from '@atlaskit/react-ufo/create-extra-search-page-interaction-payload'` instead.
 */
export { createExtraSearchPageInteractionPayload } from './createExtraSearchPageInteractionPayload';

/**
 * @deprecated Use `import { createInteractionMetricsPayload } from '@atlaskit/react-ufo/create-interaction-metrics-payload'` instead.
 */
export { createInteractionMetricsPayload } from './createInteractionMetricsPayload';

export type { InteractionMetricsPayloadResult } from './InteractionMetricsPayloadResult';

/**
 * @deprecated Use `import { getPayloadSizeAndAnnotate } from '@atlaskit/react-ufo/get-payload-size-and-annotate'` instead.
 */
export { getPayloadSizeAndAnnotate } from './getPayloadSizeAndAnnotate';
/**
 * @deprecated Use `import { getPageVisibilityUpToTTI } from '@atlaskit/react-ufo/get-page-visibility-up-to-tti'` instead.
 */
export { getPageVisibilityUpToTTI } from './getPageVisibilityUpToTTI';
/**
 * @deprecated Use `import { getMoreAccuratePageVisibilityUpToTTI } from '@atlaskit/react-ufo/get-more-accurate-page-visibility-up-to-tti'` instead.
 */
export { getMoreAccuratePageVisibilityUpToTTI } from './getMoreAccuratePageVisibilityUpToTTI';
/**
 * @deprecated Use `import { getResourceTimings } from '@atlaskit/react-ufo/get-resource-timings'` instead.
 */
export { getResourceTimings } from './getResourceTimings';
/**
 * @deprecated Use `import { getBundleEvalTimings } from '@atlaskit/react-ufo/get-bundle-eval-timings'` instead.
 */
export { getBundleEvalTimings } from './getBundleEvalTimings';
/**
 * @deprecated Use `import { getPPSMetrics } from '@atlaskit/react-ufo/get-pps-metrics'` instead.
 */
export { getPPSMetrics } from './getPPSMetrics';
/**
 * @deprecated Use `import { getSSRProperties } from '@atlaskit/react-ufo/get-ssr-properties'` instead.
 */
export { getSSRProperties } from './getSSRProperties';
/**
 * @deprecated Use `import { getAssetsMetrics } from '@atlaskit/react-ufo/get-assets-metrics'` instead.
 */
export { getAssetsMetrics } from './getAssetsMetrics';
/**
 * @deprecated Use `import { getTracingContextData } from '@atlaskit/react-ufo/get-tracing-context-data'` instead.
 */
export { getTracingContextData } from './getTracingContextData';
/**
 * @deprecated Use `import { optimizeCustomData } from '@atlaskit/react-ufo/optimize-custom-data'` instead.
 */
export { optimizeCustomData } from './optimizeCustomData';
/**
 * @deprecated Use `import { optimizeRedirects } from '@atlaskit/react-ufo/optimize-redirects'` instead.
 */
export { optimizeRedirects } from './optimizeRedirects';
/**
 * @deprecated Use `import { objectToArray } from '@atlaskit/react-ufo/object-to-array'` instead.
 */
export { objectToArray } from './objectToArray';
/**
 * @deprecated Use `import { getResourceTimingsPayload } from '@atlaskit/react-ufo/get-resource-timings-payload'` instead.
 */
export { getResourceTimingsPayload } from './getResourceTimingsPayload';
/**
 * @deprecated Use `import { getBm3TrackerTimings } from '@atlaskit/react-ufo/get-bm3-tracker-timings'` instead.
 */
export { getBm3TrackerTimings } from './getBm3TrackerTimings';
/**
 * @deprecated Use `import { getStylesheetMetrics } from '@atlaskit/react-ufo/get-stylesheet-metrics'` instead.
 */
export { getStylesheetMetrics } from './getStylesheetMetrics';
/**
 * @deprecated Use `import { getReactProfilerTimingsForWindow } from '@atlaskit/react-ufo/get-react-profiler-timings-for-window'` instead.
 */
export { getReactProfilerTimingsForWindow } from './getReactProfilerTimingsForWindow';
/**
 * @deprecated Use `import { getReactProfilerTimingsByMetricWindow } from '@atlaskit/react-ufo/get-react-profiler-timings-by-metric-window'` instead.
 */
export { getReactProfilerTimingsByMetricWindow } from './getReactProfilerTimingsByMetricWindow';
/**
 * @deprecated Use `import { getMetricVariantHoldInfo } from '@atlaskit/react-ufo/get-metric-variant-hold-info'` instead.
 */
export { getMetricVariantHoldInfo } from './getMetricVariantHoldInfo';
/**
 * @deprecated Use `import { getSegment3pTimingAbortMarkers } from '@atlaskit/react-ufo/get-segment3p-timing-abort-markers'` instead.
 */
export { getSegment3pTimingAbortMarkers } from './getSegment3pTimingAbortMarkers';
/**
 * @deprecated Use `import { getErrorCounts } from '@atlaskit/react-ufo/get-error-counts'` instead.
 */
export { getErrorCounts } from './getErrorCounts';
/**
 * @deprecated Use `import { getEarliestLegacyStopTime } from '@atlaskit/react-ufo/get-earliest-legacy-stop-time'` instead.
 */
export { getEarliestLegacyStopTime } from './getEarliestLegacyStopTime';
