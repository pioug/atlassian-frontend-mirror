import { getLighthouseMetrics } from '../../additional-payload';
import type { HoldInfo, InteractionMetrics, RevisionPayload } from '../../common';
import type { VCResult } from '../../common/vc/types';
import { getConfig } from '../../config';
import { getPageVisibilityState } from '../../hidden-timing';
import { sanitizeUfoName } from '../common/utils';
import getBrowserMetadata from '../utils/get-browser-metadata';
import { getFMP } from '../utils/get-fmp';
import getInteractionStatus from '../utils/get-interaction-status';
import getNavigationMetrics from '../utils/get-navigation-metrics';
import getPageVisibilityUpToTTAI from '../utils/get-page-visibility-up-to-ttai';
import getPaintMetrics from '../utils/get-paint-metrics';
import { LATEST_REACT_UFO_PAYLOAD_VERSION } from '../utils/get-react-ufo-payload-version';
import getSSRSuccess from '../utils/get-ssr-success';
import getTTAI from '../utils/get-ttai';
import { getTTI } from '../utils/get-tti';
import getVCMetrics from '../utils/get-vc-metrics';

import type { CriticalMetricsPayload, CriticalMetricsPayloadProperties } from './types';

// Re-export types for convenience
export type { CriticalMetricsPayload, CriticalMetricsPayloadProperties } from './types';

// Local utility functions
function getPageVisibilityUpToTTI(interaction: InteractionMetrics) {
	const { start } = interaction;
	const bm3EndTimeOrInteractionEndTime = interaction.apdex?.[0]?.stopTime ?? interaction.end;
	return getPageVisibilityState(start, bm3EndTimeOrInteractionEndTime);
}

// TODO Write tests for this function
export async function createRootCriticalMetricsPayload(
	interactionId: string,
	interaction: InteractionMetrics,
	vcMetrics?: VCResult & { 'metric:vc90'?: number | null },
): Promise<CriticalMetricsPayload | null> {
	const config = getConfig();
	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	const {
		end,
		start,
		ufoName,
		rate,
		type,
		abortReason,
		routeName,
		previousInteractionName,
		isPreviousInteractionAborted,
		abortedByInteractionName,
		holdInfo,
		responsiveness,
	} = interaction;

	const pageVisibilityAtTTI = getPageVisibilityUpToTTI(interaction);
	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);
	const interactionStatus = getInteractionStatus(interaction);

	if (interactionStatus.originalInteractionStatus !== 'SUCCEEDED') {
		// To reduce payload sent from the client, we don't send critical perf metrics for non-success interactions
		return null;
	}

	const newUFOName = sanitizeUfoName(ufoName);

	// Get performance metrics
	const ttai = getTTAI(interaction);
	const paintMetrics = await getPaintMetrics(type, end);
	const navigationMetrics = getNavigationMetrics(type);
	const ssrSuccess = getSSRSuccess(type);

	// Calculate BM3 metrics (TTI and FMP) directly
	const tti = getTTI(interaction, newUFOName);
	const fmp = getFMP(interaction, newUFOName);

	// Get browser metadata (using compact nested format)
	const browserMetadata = getBrowserMetadata();

	const lighthouseMetrics = getLighthouseMetrics({ start, stop: end });

	// Use provided vcMetrics or calculate if not provided
	const finalVCMetrics = vcMetrics || (await getVCMetrics(interaction));

	const ttvc = (finalVCMetrics['ufo:vc:rev'] as RevisionPayload)
		?.map((revision) => {
			if (revision['metric:vc90'] === null || revision.clean !== true) {
				return null;
			}
			return {
				revision: revision.revision,
				vc90: revision['metric:vc90'],
			};
		})
		.filter((revision): revision is { revision: string; vc90: number } => revision != null);

	// find earliest hold
	const earliestHold = holdInfo?.reduce(
		(a, b) => {
			if (a && a.start < b.start) {
				return a;
			}
			return b;
		},
		null as HoldInfo | null,
	);

	// Process cohorting custom data
	const cohortingCustomData = interaction.cohortingCustomData?.size
		? Object.fromEntries(interaction.cohortingCustomData)
		: undefined;

	const properties: CriticalMetricsPayloadProperties = {
		// Basic metadata
		'event:hostname': window.location?.hostname || 'unknown',
		'event:product': config.product,
		'event:schema': '1.0.0',
		'event:region': config.region || 'unknown',
		'event:source': {
			name: 'react-ufo/web',
			version: LATEST_REACT_UFO_PAYLOAD_VERSION,
		},
		'experience:key': 'custom.ufo.critical-metrics',
		'experience:name': newUFOName,

		// Browser metadata (compact nested format)
		browser: browserMetadata.browser,
		device: browserMetadata.device,
		network: browserMetadata.network,
		time: browserMetadata.time,

		metrics: {
			fp: paintMetrics.fp,
			fcp: paintMetrics.fcp,
			lcp: paintMetrics.lcp,
			ttai,
			tti,
			fmp,
			tbt: lighthouseMetrics['metric:tbt'],
			tbtObserved: lighthouseMetrics['metric:tbt:observed'],
			cls: lighthouseMetrics['metric:cls'],
			ttvc: ttvc ?? undefined,
			earliestHoldStart: earliestHold?.start ? Math.round(earliestHold.start - start) : undefined, // for interaction response
			inputDelay: responsiveness?.inputDelay ? Math.round(responsiveness.inputDelay) : undefined,
			inp: responsiveness?.experimentalInputToNextPaint
				? Math.round(responsiveness.experimentalInputToNextPaint)
				: undefined,
			...(navigationMetrics && { navigation: navigationMetrics }),
		},

		...(ssrSuccess !== undefined && { ssrSuccess }),
		interactionId,
		type,
		rate,
		routeName: routeName ?? undefined,

		// Performance timings
		start: Math.round(start),
		end: Math.round(end),

		// Status and outcome
		status: interactionStatus.originalInteractionStatus,
		abortReason,
		previousInteractionName,
		isPreviousInteractionAborted,
		abortedByInteractionName,
		pageVisibilityAtTTI: pageVisibilityAtTTI ?? undefined,
		pageVisibilityAtTTAI,

		// Basic error count (not detailed error count)
		errorCount: interaction.errors.length,

		// Cohorting custom data
		...(Object.keys(cohortingCustomData || {}).length > 0 && { cohortingCustomData }),
	};

	const payload: CriticalMetricsPayload = {
		actionSubject: 'experience',
		action: 'measured',
		eventType: 'operational',
		source: 'measured',
		tags: ['observability'],
		attributes: {
			properties: properties as CriticalMetricsPayloadProperties,
		},
	};

	return payload;
}
