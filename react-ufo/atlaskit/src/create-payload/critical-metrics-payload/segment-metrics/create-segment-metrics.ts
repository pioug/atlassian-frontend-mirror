import { type InteractionMetrics } from '../../../common';
import { getConfig } from '../../../config';
import getBrowserMetadata from '../../utils/get-browser-metadata';
import getPageVisibilityUpToTTAI from '../../utils/get-page-visibility-up-to-ttai';
import { LATEST_REACT_UFO_PAYLOAD_VERSION } from '../../utils/get-react-ufo-payload-version';
import { type CriticalMetricsPayload, type CriticalMetricsPayloadProperties } from '../types';

import getIsRootSegment from './get-is-root-segment';
import getSegmentId from './get-segment-id';
import getSegmentStatus from './get-segment-status';

export async function createSegmentMetricsPayloads(
	interactionId: string,
	interaction: InteractionMetrics,
) {
	const config = getConfig();
	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	// Get browser metadata (using compact nested format)
	const browserMetadata = getBrowserMetadata();

	// Process cohorting custom data
	const cohortingCustomData = interaction.cohortingCustomData?.size
		? Object.fromEntries(interaction.cohortingCustomData)
		: undefined;

	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);

	const {
		knownSegments,
		reactProfilerTimings,
		rate,
		routeName,
		previousInteractionName,
		isPreviousInteractionAborted,
		abortedByInteractionName,
	} = interaction;

	// Group segments by name and select the first segment for each name
	const segmentsByName = new Map<
		string,
		{ segment: (typeof knownSegments)[0]; firstMountTime: number }
	>();

	for (const segment of knownSegments) {
		const segmentId = getSegmentId(segment.labelStack);

		// skip if no segmentId
		if (!segmentId) {
			continue;
		}

		const name = segment.labelStack[segment.labelStack.length - 1].name;
		const isRootSegment = getIsRootSegment(segment.labelStack);

		const segmentProfilerTimings = reactProfilerTimings
			.filter((timing) => {
				const timingSegmentId = getSegmentId(timing.labelStack);
				// check if labelStack matches exactly
				return timingSegmentId === segmentId;
			})
			.sort((a, b) => {
				return a.startTime - b.startTime;
			});

		const firstMountTiming = segmentProfilerTimings.find((timing) => {
			return timing.type === 'mount';
		});

		if (!firstMountTiming) {
			continue;
		}

		const firstMountTime = isRootSegment ? interaction.start : firstMountTiming.startTime;

		// Check if we already have a segment with this name
		const existingEntry = segmentsByName.get(name);
		if (!existingEntry || firstMountTime < existingEntry.firstMountTime) {
			// Either first time seeing this name, or this segment mounted earlier
			segmentsByName.set(name, { segment, firstMountTime });
		}
	}

	// Create payloads only for the selected segments (first one per name)
	const payloads: CriticalMetricsPayload[] = [];
	for (const { segment } of segmentsByName.values()) {
		const segmentId = getSegmentId(segment.labelStack);
		const name = segment.labelStack[segment.labelStack.length - 1].name;
		const isRootSegment = getIsRootSegment(segment.labelStack);

		const segmentProfilerTimings = reactProfilerTimings
			.filter((timing) => {
				const timingSegmentId = getSegmentId(timing.labelStack);
				// check if labelStack matches exactly
				return timingSegmentId === segmentId;
			})
			.sort((a, b) => {
				return a.startTime - b.startTime;
			});

		const firstMountTiming = segmentProfilerTimings.find((timing) => {
			return timing.type === 'mount';
		});

		// We already checked this exists in the grouping phase
		if (!firstMountTiming) {
			continue;
		}

		const lastTiming = segmentProfilerTimings[segmentProfilerTimings.length - 1];

		const startTime = isRootSegment ? interaction.start : firstMountTiming.startTime;
		const endTime = lastTiming.commitTime;

		const ttai = Math.round(endTime - startTime);

		const { status, abortReason: segmentAbortReason } = getSegmentStatus(interaction, segment);
		if (status !== 'SUCCEEDED') {
			// To reduce payload sent from the client, we don't send critical perf metrics for non-success interactions
			continue;
		}

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
			'experience:name': name,

			// Browser metadata (compact nested format)
			browser: browserMetadata.browser,
			device: browserMetadata.device,
			network: browserMetadata.network,
			time: browserMetadata.time,

			metrics: {
				ttai,
				tti: ttai,
			},

			interactionId,
			type: 'page_segment_load',
			rate,
			routeName: routeName ?? undefined,

			// Performance timings
			start: Math.round(startTime),
			end: Math.round(endTime),

			// Status and outcome
			status,
			abortReason: segmentAbortReason,
			previousInteractionName,
			isPreviousInteractionAborted,
			abortedByInteractionName,
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

		payloads.push(payload);
	}

	return payloads;
}
