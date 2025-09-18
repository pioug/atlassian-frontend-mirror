import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../coinflip';
import type { InteractionMetrics } from '../common';
import type { RevisionPayload } from '../common/vc/types';
import { DEFAULT_TTVC_REVISION, getConfig, getExtraInteractionRate } from '../config';
import {
	buildSegmentTree,
	getOldSegmentsLabelStack,
	optimizeLabelStack,
	sanitizeUfoName,
} from '../create-payload/common/utils';
import { getMoreAccuratePageVisibilityUpToTTAI } from '../create-payload/utils/get-more-accurate-page-visibility-up-to-ttai';
import getPageVisibilityUpToTTAI from '../create-payload/utils/get-page-visibility-up-to-ttai';
import getPayloadSize from '../create-payload/utils/get-payload-size';
import { getReactUFOPayloadVersion } from '../create-payload/utils/get-react-ufo-payload-version';
import getTTAI from '../create-payload/utils/get-ttai';
import getVCMetrics from '../create-payload/utils/get-vc-metrics';
import { optimizeApdex } from '../create-payload/utils/optimize-apdex';
import { optimizeCustomTimings } from '../create-payload/utils/optimize-custom-timings';
import { optimizeHoldInfo } from '../create-payload/utils/optimize-hold-info';
import { optimizeMarks } from '../create-payload/utils/optimize-marks';
import { optimizeReactProfilerTimings } from '../create-payload/utils/optimize-react-profiler-timings';
import { optimizeRequestInfo } from '../create-payload/utils/optimize-request-info';
import { optimizeSpans } from '../create-payload/utils/optimize-spans';
import type { LabelStack } from '../interaction-context';
import { interactionSpans as atlaskitInteractionSpans } from '../interaction-metrics';

async function createInteractionExtraLogPayload(
	interactionId: string,
	interaction: InteractionMetrics,
) {
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
		knownSegments,
	} = interaction;

	const sanitisedUfoName = sanitizeUfoName(ufoName);
	const configRate = getExtraInteractionRate(sanitisedUfoName, type);
	if (!coinflip(configRate)) {
		return null;
	}

	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);
	const isPageLoad = type === 'page_load' || type === 'transition';
	if (!isPageLoad) {
		// Only create payload for page load
		return null;
	}

	const calculatePageVisibilityFromTheStartOfPageLoad =
		config.enableBetterPageVisibilityApi && isPageLoad;

	const moreAccuratePageVisibilityAtTTAI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTAI(interaction)
		: null;

	const extraTTAI = getTTAI(interaction) ?? undefined;

	const newUFOName = sanitizeUfoName(ufoName);

	const finalVCMetrics = await getVCMetrics(interaction, true);

	// Check if VC is clean and has valid metric
	const vcRevisionPayload = finalVCMetrics?.['ufo:vc:rev'] as RevisionPayload;
	const effectiveVCRevisionPayload = vcRevisionPayload?.find(
		({ revision }) => revision === DEFAULT_TTVC_REVISION,
	);
	if (
		!effectiveVCRevisionPayload?.clean ||
		effectiveVCRevisionPayload?.['metric:vc90'] === undefined ||
		typeof effectiveVCRevisionPayload?.['metric:vc90'] !== 'number' ||
		extraTTAI === undefined ||
		typeof extraTTAI !== 'number' ||
		interaction.errors.length > 0
	) {
		return null;
	}

	// Helper function to check if labelStack contains third-party type
	const isThirdParty = (labelStack?: LabelStack | null) => {
		return labelStack?.some((entry) => 'type' in entry && entry.type === 'third-party') ?? false;
	};

	// Pre-filter 3p data
	const filteredData = {
		errors: interaction.errors.filter((error) => isThirdParty(error.labelStack)),
		spans: [...interaction.spans, ...atlaskitInteractionSpans].filter((span) =>
			isThirdParty(span.labelStack),
		),
		requestInfo: interaction.requestInfo.filter((req) => isThirdParty(req.labelStack)),
		customTimings: interaction.customTimings.filter((timing) => isThirdParty(timing.labelStack)),
		apdex: interaction.apdex.filter((apdex) => isThirdParty(apdex.labelStack)),
		reactProfilerTimings: interaction.reactProfilerTimings.filter((timing) =>
			isThirdParty(timing.labelStack),
		),
		customData: interaction.customData.filter((data) => isThirdParty(data.labelStack)),
		segments: knownSegments.filter((segment) => isThirdParty(segment.labelStack)),
		marks: interaction.marks.filter((mark) => isThirdParty(mark.labelStack)),
	};
	// Clear atlaskit spans after filtering
	atlaskitInteractionSpans.length = 0;

	// Detailed payload
	const getDetailedInteractionMetrics = () => {
		return {
			errors: filteredData.errors.map(({ labelStack, ...others }) => ({
				...others,
				labelStack:
					labelStack && optimizeLabelStack(labelStack, getReactUFOPayloadVersion(interaction.type)),
			})),
			holdActive: interaction.hold3pActive ? [...interaction.hold3pActive.values()] : [],
			holdInfo: optimizeHoldInfo(
				interaction.hold3pInfo ?? [],
				start,
				getReactUFOPayloadVersion(interaction.type),
			),
			spans: optimizeSpans(filteredData.spans, start, getReactUFOPayloadVersion(interaction.type)),
			requestInfo: optimizeRequestInfo(
				filteredData.requestInfo,
				start,
				getReactUFOPayloadVersion(interaction.type),
			),
			customTimings: optimizeCustomTimings(filteredData.customTimings, start),
		};
	};

	const segments3p =
		!fg('platform_ufo_remove_deprecated_config_fields') && config.killswitchNestedSegments
			? []
			: filteredData.segments;
	const segmentTree =
		getReactUFOPayloadVersion(interaction.type) === '2.0.0'
			? buildSegmentTree(segments3p.map((segment) => segment.labelStack))
			: {};
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
				'experience:key': 'custom.interaction-extra-metrics',
				'experience:name': newUFOName,
				interactionMetrics: {
					namePrefix: config.namePrefix || '',
					segmentPrefix: config.segmentPrefix || '',
					interactionId,
					pageVisibilityAtTTAI,
					experimental__pageVisibilityAtTTAI: moreAccuratePageVisibilityAtTTAI,
					// raw interaction metrics
					rate,
					routeName,
					type,
					abortReason,
					previousInteractionName,
					isPreviousInteractionAborted,
					abortedByInteractionName,

					// performance
					end: Math.round(end),
					start: Math.round(start),
					'metric:ttai:3p': extraTTAI,
					...finalVCMetrics,
					segments:
						getReactUFOPayloadVersion(interaction.type) === '2.0.0'
							? segmentTree
							: getOldSegmentsLabelStack(segments3p, interaction.type),
					marks: optimizeMarks(filteredData.marks, getReactUFOPayloadVersion(interaction.type)),
					apdex: optimizeApdex(filteredData.apdex, getReactUFOPayloadVersion(interaction.type)),
					reactProfilerTimings: optimizeReactProfilerTimings(
						filteredData.reactProfilerTimings,
						start,
						getReactUFOPayloadVersion(interaction.type),
					),
					customData: filteredData.customData,
					...getDetailedInteractionMetrics(),
				},
				'vc:effective:revision': DEFAULT_TTVC_REVISION,
			},
		},
	};

	payload.attributes.properties['event:sizeInKb'] = getPayloadSize(payload.attributes.properties);
	return payload;
}

export default createInteractionExtraLogPayload;
