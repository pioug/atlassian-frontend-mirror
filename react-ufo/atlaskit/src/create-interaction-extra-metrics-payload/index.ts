import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../coinflip';
import type {
	AbortReasonType,
	CustomData,
	HoldActive,
	InteractionMetrics,
	MarkType,
} from '../common';
import type { PageVisibility } from '../common/react-ufo-payload-schema';
import type { RevisionPayload, VCResult } from '../common/vc/types';
import { DEFAULT_TTVC_REVISION, getConfig, getExtraInteractionRate } from '../config';
import type { OptimizedLabelStack } from '../create-payload/common/types';
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
import type { UFOSegmentType } from '../segment/segment';

async function createInteractionExtraLogPayload(
	interactionId: string,
	interaction: InteractionMetrics,
	lastInteractionFinish: InteractionMetrics | null,
	lastInteractionFinishVCResult?: VCResult,
): Promise<{
	actionSubject: string;
	action: string;
	eventType: string;
	source: string;
	tags: string[];
	attributes: {
		properties: {
			// basic
			'event:hostname': string;
			'event:product': string;
			'event:schema': string;
			'event:sizeInKb': number;
			'event:source': {
				name: string;
				version: string;
			};
			'event:region': string;
			'experience:key': string;
			'experience:name': string;
			interactionMetrics: {
				errors: {
					labelStack:
						| string
						| {
								t?: UFOSegmentType | undefined;
								s?: string | undefined;
								n: string;
						  }[]
						| null;
					name: string;
					errorType: string;
					errorMessage: string;
					errorStack?: string;
					forcedError?: boolean;
					errorHash?: string;
					errorStatusCode?: number;
				}[];
				holdActive: HoldActive[];
				holdInfo: any[];
				spans: {
					labelStack: OptimizedLabelStack;
					startTime: number;
					endTime: number;
					type: string;
				}[];
				requestInfo: {
					labelStack: OptimizedLabelStack;
					startTime: number;
					endTime: number;
				}[];
				customTimings: {
					labelStack: OptimizedLabelStack;
					startTime: number;
					endTime: number;
				}[];
				segments: {};
				marks: {
					labelStack:
						| string
						| {
								t?: UFOSegmentType | undefined;
								s?: string | undefined;
								n: string;
						  }[]
						| null;
					time: number;
					type: MarkType;
					name: string;
				}[];
				apdex: {
					labelStack?:
						| string
						| {
								t?: UFOSegmentType | undefined;
								s?: string | undefined;
								n: string;
						  }[]
						| undefined;
					stopTime: number;
					key: string;
					startTime?: number;
				}[];
				reactProfilerTimings: any[];
				customData: {
					labelStack: LabelStack;
					data: CustomData;
				}[];
				'metric:vc90'?: number | null;
				namePrefix: string;
				segmentPrefix: string;
				interactionId: string;
				pageVisibilityAtTTAI: PageVisibility;
				experimental__pageVisibilityAtTTAI: PageVisibility | null;
				// raw interaction metrics
				rate: number;
				routeName: string | null;
				type: 'page_load' | 'transition';
				abortReason: AbortReasonType | undefined;
				previousInteractionName: string | undefined;
				isPreviousInteractionAborted: boolean;
				abortedByInteractionName: string | undefined;
				// performance
				end: number;
				start: number;
				'metric:ttai:3p': number;
			};
			'vc:effective:revision': string;
			lastInteractionFinish: {
				start: number | undefined;
				end: number | undefined;
				ttai: number | undefined;
				vc90: number | null;
				vcClean: boolean;
			};
		};
	};
} | null> {
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
		minorInteractions,
	} = interaction;

	const sanitisedUfoName = sanitizeUfoName(ufoName);
	const configRate = getExtraInteractionRate(sanitisedUfoName, type);
	if (!coinflip(configRate)) {
		return null;
	}

	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);
	const isPageLoad = type === 'page_load' || type === 'transition';
	if (!isPageLoad || (minorInteractions !== undefined && minorInteractions.length > 0)) {
		// Not send if aborted by minor interaction for now
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

	// Get normal TTAI & VC90 for last finished interaction (without 3p)
	if (
		!lastInteractionFinish ||
		lastInteractionFinish?.abortReason ||
		lastInteractionFinish?.errors?.length
	) {
		return null;
	}

	const normalTTAI = getTTAI(lastInteractionFinish) ?? undefined;
	const lastInteractionFinishStart =
		typeof lastInteractionFinish.start === 'number'
			? Math.round(lastInteractionFinish.start)
			: undefined;
	const lastInteractionFinishEnd =
		typeof lastInteractionFinish.end === 'number'
			? Math.round(lastInteractionFinish.end)
			: undefined;

	let lastInteractionFinishVC90: number | null = null;
	let lastInteractionFinishVCClean: boolean = false;

	if (lastInteractionFinishVCResult) {
		const lastInteractionFinishVCRev = lastInteractionFinishVCResult[
			'ufo:vc:rev'
		] as RevisionPayload;
		const lastInteractionFinishRevision = lastInteractionFinishVCRev?.find(
			({ revision }) => revision === DEFAULT_TTVC_REVISION,
		);
		if (lastInteractionFinishRevision?.clean) {
			lastInteractionFinishVCClean = true;
			lastInteractionFinishVC90 = lastInteractionFinishRevision['metric:vc90'];
		} else {
			return null;
		}
	} else if (
		normalTTAI !== undefined &&
		typeof normalTTAI === 'number' &&
		normalTTAI === extraTTAI
	) {
		// Because TTAI is equal between with and without 3p, we can assume VC90 is also equal
		lastInteractionFinishVC90 = effectiveVCRevisionPayload?.['metric:vc90'];
		lastInteractionFinishVCClean = effectiveVCRevisionPayload?.clean;
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
				lastInteractionFinish: {
					start: lastInteractionFinishStart,
					end: lastInteractionFinishEnd,
					ttai: normalTTAI,
					vc90: lastInteractionFinishVC90,
					vcClean: lastInteractionFinishVCClean,
				},
			},
		},
	};

	payload.attributes.properties['event:sizeInKb'] = getPayloadSize(payload.attributes.properties);
	return payload;
}

export default createInteractionExtraLogPayload;
