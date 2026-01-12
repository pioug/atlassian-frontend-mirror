import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	UFOExperience,
	ExperiencePerformanceTypes,
	ExperienceTypes,
	ConcurrentExperience,
	type CustomData,
} from '@atlaskit/ufo';
import { type CardStatus } from '../types';
import { type FileAttributes, getFeatureFlagKeysAllProducts } from '@atlaskit/media-common';
import isValidId from 'uuid-validate';
import { UFOExperienceState } from '@atlaskit/ufo';
import {
	extractErrorInfo,
	getRenderErrorRequestMetadata,
	type MediaCardErrorInfo,
	type SSRStatus,
} from './analytics';
import { MediaCardError } from '../errors';
import { getMediaEnvironment, getMediaRegion, type RequestMetadata } from '@atlaskit/media-client';
import { type FileStateFlags } from '../types';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import { type ExperimentalPerformanceResourceTiming } from './mediaPerformanceObserver/types';
import { type Timing } from '@atlaskit/ufo/types';
import { getMediaGlobalScope } from './globalScope/globalScope';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const SAMPLE_RATE = 0.05;

/**
 * Determines if performance events should be sampled for this instance.
 * Approximately 5% of instances will be sampled.
 */
export const shouldPerformanceBeSampled = () => Math.random() < SAMPLE_RATE;

/**
 * Gets the UFO interaction start time.
 * For page_load: returns 0 (relative to page navigation)
 * For SPA transitions: returns performance.now() when transition started
 */
const getInteractionStartTime = (): number => {
	const interaction = getActiveInteraction();
	return interaction?.start ?? 0;
};

/**
 * Finds a performance resource timing entry by matching a full URI.
 * Searches from the end (most recent) to find the latest matching entry.
 */
const findPerformanceEntryByName = (
	name: string,
): ExperimentalPerformanceResourceTiming | undefined => {
	if (typeof performance === 'undefined' || !performance.getEntriesByType) {
		return undefined;
	}

	// For data URIs (base64), there won't be a performance entry
	if (name.startsWith('data:')) {
		return undefined;
	}

	const entries = performance.getEntriesByType('resource');
	const ssrPerformanceEntries = getMediaGlobalScope().performanceEntries ?? [];

	return [...ssrPerformanceEntries, ...entries].find((entry) => name.includes(entry.name)) as ExperimentalPerformanceResourceTiming | undefined;
};

/**
 * Creates timing configuration for the UFO experience based on the performance entry.
 * These timings will be calculated by UFO using the marks we add.
 */
const createTimingsConfig = (prefix: 'ssr' | 'csr'): Timing[] => [
	{
		key: `${prefix}:resourceTiming`,
		startMark: `${prefix}:resourceTiming:start`,
		endMark: `${prefix}:resourceTiming:end`,
	},
	{
		key: `${prefix}:dnsLookup`,
		startMark: `${prefix}:dnsLookup:start`,
		endMark: `${prefix}:dnsLookup:end`,
	},
	{
		key: `${prefix}:tcpHandshake`,
		startMark: `${prefix}:tcpHandshake:start`,
		endMark: `${prefix}:tcpHandshake:end`,
	},
	{
		key: `${prefix}:tlsNegotiation`,
		startMark: `${prefix}:tlsNegotiation:start`,
		endMark: `${prefix}:tlsNegotiation:end`,
	},
	{ key: `${prefix}:ttfb`, startMark: `${prefix}:ttfb:start`, endMark: `${prefix}:ttfb:end` },
	{
		key: `${prefix}:contentDownload`,
		startMark: `${prefix}:contentDownload:start`,
		endMark: `${prefix}:contentDownload:end`,
	},
	{
		key: `${prefix}:redirect`,
		startMark: `${prefix}:redirect:start`,
		endMark: `${prefix}:redirect:end`,
	},
	{
		key: `${prefix}:fetchTime`,
		startMark: `${prefix}:fetchTime:start`,
		endMark: `${prefix}:fetchTime:end`,
	},
];

/**
 * Creates resource timing metadata from a performance entry.
 * Only includes non-timing information (sizes, cache status, protocol, CDN info).
 * Timing durations are captured via marks which feed into the timings config.
 */
const createResourceTimingMetadata = (entry: ExperimentalPerformanceResourceTiming) => {
	return {
		// Size information
		resourceTransferSize: entry.transferSize,
		resourceDecodedBodySize: entry.decodedBodySize,

		// Request info
		resourceInitiatorType: entry.initiatorType,
		resourceNextHopProtocol: entry.nextHopProtocol,

		// Cache status
		resourceBrowserCacheHit: entry.transferSize === 0,

		// Server timing (CDN metrics)
		resourceCdnCacheHit: entry.serverTiming?.some(({ name }) => name === 'cdn-cache-hit') ?? false,
		resourceCdnDownstreamFBL: entry.serverTiming?.find(({ name }) => name === 'cdn-downstream-fbl')
			?.duration,
		resourceCdnUpstreamFBL: entry.serverTiming?.find(({ name }) => name === 'cdn-upstream-fbl')
			?.duration,
	};
};

/**
 * Adds timing marks from a performance resource timing entry to the UFO experience.
 */
const addResourceTimingMarks = (
	experience: UFOExperience,
	entry: ExperimentalPerformanceResourceTiming,
	interactionStartTime: number,
	prefix: 'ssr' | 'csr',
) => {
	const addMark = (name: string, start: number, end: number) => {
		const relativeStart = start - interactionStartTime;
		const relativeEnd = end - interactionStartTime;
		if (relativeEnd > relativeStart && relativeStart >= 0) {
			experience.mark(`${prefix}:${name}:start`, relativeStart);
			experience.mark(`${prefix}:${name}:end`, relativeEnd);
		}
	};

	// Overall resource timing
	addMark('resourceTiming', entry.startTime, entry.responseEnd);

	// DNS lookup
	addMark('dnsLookup', entry.domainLookupStart, entry.domainLookupEnd);

	// TCP handshake
	addMark('tcpHandshake', entry.connectStart, entry.connectEnd);

	// TLS negotiation (only for HTTPS)
	if (entry.secureConnectionStart > 0) {
		addMark('tlsNegotiation', entry.secureConnectionStart, entry.requestStart);
	}

	// Request to first byte (TTFB)
	addMark('ttfb', entry.requestStart, entry.responseStart);

	// Content download
	addMark('contentDownload', entry.responseStart, entry.responseEnd);

	// Redirect time (if any)
	if (entry.redirectStart > 0 && entry.redirectEnd > 0) {
		addMark('redirect', entry.redirectStart, entry.redirectEnd);
	}

	// Total fetch time (without redirect) - from fetchStart to responseEnd
	addMark('fetchTime', entry.fetchStart, entry.responseEnd);
};

const sanitiseFileAttributes = (fileAttributes: FileAttributes) => {
	let sanitisedFileId = 'INVALID_FILE_ID';
	if (fileAttributes.fileId === 'external-image' || isValidId(fileAttributes.fileId)) {
		sanitisedFileId = fileAttributes.fileId;
	}
	return {
		...fileAttributes,
		fileId: sanitisedFileId,
	};
};

const getBasePayloadAttributes = () => ({
	packageName,
	packageVersion,
	mediaEnvironment: getMediaEnvironment(),
	mediaRegion: getMediaRegion(),
});

export type SSRPreviewInfo = {
	/** The srcset of the SSR preview (used to match performance entries) */
	srcset?: string;
	/** The full URI of the SSR preview (used to match performance entries) */
	dataUri?: string;
	/** Whether SSR was attempted (ssr prop was provided) */
	wasSSRAttempted: boolean;
	/** Whether SSR was successful (server or client status is 'success') */
	wasSSRSuccessful: boolean;
};

type SucceedUfoPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	fileStateFlags: FileStateFlags;
};

type FailedProcessingPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	failReason: 'failed-processing';
	fileStateFlags: FileStateFlags;
};

type ErrorUfoPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	request: RequestMetadata | undefined;
	fileStateFlags: FileStateFlags;
} & MediaCardErrorInfo;

export interface UseMediaCardUfoExperienceOptions {
	/** Unique identifier for this experience instance */
	instanceId: string;
	/** Whether to enable UFO tracking for this instance */
	enabled: boolean;
}

export interface StartOptions {
	/**
	 * When true, uses the UFO interaction start time instead of current time.
	 * Use this for SSR non-lazy scenarios where the image loading started at interaction start.
	 */
	useInteractionTime?: boolean;
}

export interface MediaCardUfoExperience {
	/**
	 * Start the UFO experience. Call when card becomes visible.
	 * @param options - Optional configuration for start behavior
	 */
	start: (options?: StartOptions) => void;
	/**
	 * Complete the UFO experience with appropriate timing strategy.
	 * @param status - The final card status
	 * @param fileAttributes - File metadata
	 * @param fileStateFlags - File state flags
	 * @param ssrReliability - SSR reliability status
	 * @param error - Optional error for error status
	 * @param ssrPreviewInfo - SSR preview information for timing lookup
	 */
	complete: (
		status: CardStatus,
		fileAttributes: FileAttributes,
		fileStateFlags: FileStateFlags,
		ssrReliability: SSRStatus,
		error?: MediaCardError,
		ssrPreviewInfo?: SSRPreviewInfo,
	) => void;
	/** Abort the UFO experience. Call on unmount if not completed. */
	abort: (properties?: Partial<SucceedUfoPayload>) => void;
}

/**
 * Creates a new UFO experience instance with the given configuration.
 */
const createExperience = (instanceId: string, timings: Timing[] = []): UFOExperience => {
	return new UFOExperience(
		'media-card-render',
		{
			platform: { component: 'media-card' },
			type: ExperienceTypes.Experience,
			performanceType: ExperiencePerformanceTypes.InlineResult,
			featureFlags: getFeatureFlagKeysAllProducts(),
			timings,
		},
		instanceId,
	);
};

/**
 * Hook to create a UFO experience tied to a media card component lifecycle.
 *
 * This creates a unique UFOExperience instance per component, allowing:
 * - Unique timing config per instance
 * - Direct control over experience lifecycle
 * - Proper cleanup on unmount
 *
 * @example
 * ```tsx
 * const ufoExperience = useMediaCardUfoExperience({
 *   instanceId: internalOccurrenceKey,
 *   enabled: shouldSendPerformanceEvent,
 * });
 *
 * // On card visible
 * ufoExperience.start();
 *
 * // On card complete/error
 * ufoExperience.complete(status, fileAttributes, fileStateFlags, ssrReliability, error, ssrPreviewInfo);
 * ```
 */
export const useMediaCardUfoExperience = ({
	instanceId,
	enabled,
}: UseMediaCardUfoExperienceOptions): MediaCardUfoExperience => {
	// Store the start time when start() is called - experience creation is deferred to complete()
	const startTimeRef = useRef<number | undefined>(undefined);
	const hasStartedRef = useRef(false);
	// Store the experience so abort() can use it after complete() has run
	const experienceRef = useRef<UFOExperience | null>(null);

	// Reset refs when instanceId changes (new card instance)
	useEffect(() => {
		return () => {
			// Note: Don't clear experienceRef here as abort() might still need it
			// The component's cleanup calls abort() which handles final state
			hasStartedRef.current = false;
			startTimeRef.current = undefined;
		};
	}, [instanceId]);

	const start = useCallback(
		(options?: StartOptions) => {
			if (!enabled) {
				return;
			}
			// Store the start time - experience will be created in complete()
			// This allows us to have the correct timings config when creating the experience
			hasStartedRef.current = true;
			startTimeRef.current = options?.useInteractionTime
				? getInteractionStartTime()
				: performance.now();
		},
		[enabled],
	);

	const complete = useCallback(
		(
			status: CardStatus,
			fileAttributes: FileAttributes,
			fileStateFlags: FileStateFlags,
			ssrReliability: SSRStatus,
			error: MediaCardError = new MediaCardError('missing-error-data'),
			ssrPreviewInfo?: SSRPreviewInfo,
		) => {
			// Only complete for terminal statuses - ignore intermediate statuses like 'loading-preview'
			if (!['complete', 'error', 'failed-processing'].includes(status)) {
				return;
			}

			if (!enabled || !hasStartedRef.current) {
				return;
			}

			const interactionStartTime = getInteractionStartTime();

			// Determine timings config based on SSR status
			let timingsConfig: Timing[] = [];
			let resourceTimingEntry: ExperimentalPerformanceResourceTiming | undefined;

			if (ssrPreviewInfo?.wasSSRSuccessful && ssrPreviewInfo.dataUri) {
				resourceTimingEntry = findPerformanceEntryByName(
					ssrPreviewInfo.srcset ?? ssrPreviewInfo.dataUri,
				);
				if (resourceTimingEntry) {
					timingsConfig = createTimingsConfig('ssr');
				}
			}

			// Create the experience with the correct timings config
			const experience = createExperience(instanceId, timingsConfig);
			experienceRef.current = experience;
			experience.start(startTimeRef.current);

			let endTime = performance.now();

			// Add timing marks and metadata based on strategy
			if (ssrPreviewInfo?.wasSSRSuccessful && ssrPreviewInfo.dataUri) {
				if (resourceTimingEntry) {
					endTime = resourceTimingEntry.responseEnd;
					addResourceTimingMarks(experience, resourceTimingEntry, interactionStartTime, 'ssr');
					experience.addMetadata({
						...createResourceTimingMetadata(resourceTimingEntry),
						timingStrategy: 'ssr-resource-timing',
					});
				} else {
					experience.addMetadata({
						timingStrategy: 'ssr-no-entry-found',
					});
				}
			} else if (ssrPreviewInfo?.wasSSRAttempted) {
				// Strategy 2: SSR was attempted but failed - use interaction start time
				experience.addMetadata({
					timingStrategy: 'ssr-failed',
					interactionStartTime,
				});
				experience.mark('interactionStart', 0);
			} else {
				// Strategy 3: No SSR - CSR mount-based behavior
				experience.addMetadata({
					timingStrategy: 'csr-mount-based',
				});
			}

			// Complete the experience with appropriate state
			const sanitisedFileAttributes = sanitiseFileAttributes(fileAttributes);

			switch (status) {
				case 'complete':
					experience.addMetadata({
						fileAttributes: sanitisedFileAttributes,
						ssrReliability,
						fileStateFlags,
						...getBasePayloadAttributes(),
					});
					experience.transition(UFOExperienceState.SUCCEEDED, endTime);
					break;
				case 'failed-processing':
					experience.failure({
						metadata: {
							fileAttributes: sanitisedFileAttributes,
							ssrReliability,
							fileStateFlags,
							failReason: 'failed-processing',
							...getBasePayloadAttributes(),
						},
					});
					break;
				case 'error':
					experience.failure({
						metadata: {
							fileAttributes: sanitisedFileAttributes,
							ssrReliability,
							fileStateFlags,
							...extractErrorInfo(error),
							request: getRenderErrorRequestMetadata(error),
							...getBasePayloadAttributes(),
						},
					});
					break;
			}

			// Reset state after completion
			hasStartedRef.current = false;
			startTimeRef.current = undefined;
		},
		[enabled, instanceId],
	);

	const abort = useCallback(
		(properties?: Partial<SucceedUfoPayload>) => {
			if (!enabled) {
				return;
			}

			// Use existing experience if available (created by complete()),
			// otherwise create new one if experience was started but not completed
			let experience = experienceRef.current;
			if (!experience) {
				if (!hasStartedRef.current) {
					return;
				}
				experience = createExperience(instanceId);
				experienceRef.current = experience;
				experience.start(startTimeRef.current);
			}

			const metadata: CustomData = { ...getBasePayloadAttributes() };

			if (properties?.fileAttributes) {
				metadata.fileAttributes = sanitiseFileAttributes(properties.fileAttributes);
			}
			if (properties?.fileStateFlags) {
				metadata.fileStateFlags = properties.fileStateFlags as unknown as CustomData;
			}
			if (properties?.ssrReliability) {
				metadata.ssrReliability = properties.ssrReliability as unknown as CustomData;
			}

			// UFO will ignore abort if experience is already in final state
			experience.abort({ metadata });

			// Reset state after abort
			hasStartedRef.current = false;
			startTimeRef.current = undefined;
		},
		[enabled, instanceId],
	);

	return useMemo(
		() => ({
			start,
			complete,
			abort,
		}),
		[start, complete, abort],
	);
};

// ============================================================================
// Legacy exports for backwards compatibility
// These will be removed once all consumers are migrated to the hook
// ============================================================================

let concurrentExperience: ConcurrentExperience | undefined;

const getExperience = (id: string) => {
	if (!concurrentExperience) {
		const inlineExperience = {
			platform: { component: 'media-card' },
			type: ExperienceTypes.Experience,
			performanceType: ExperiencePerformanceTypes.InlineResult,
			featureFlags: getFeatureFlagKeysAllProducts(),
		};
		concurrentExperience = new ConcurrentExperience('media-card-render', inlineExperience);
	}
	return concurrentExperience.getInstance(id);
};

export const startUfoExperience = (id: string, startTime?: number) => {
	getExperience(id).start(startTime);
};

export const completeUfoExperience = (
	id: string,
	status: CardStatus,
	fileAttributes: FileAttributes,
	fileStateFlags: FileStateFlags,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	ssrPreviewInfo?: SSRPreviewInfo,
) => {
	// Only complete for terminal statuses - ignore intermediate statuses like 'loading-preview'
	if (!['complete', 'error', 'failed-processing'].includes(status)) {
		return;
	}

	const experience = getExperience(id);
	const interactionStartTime = getInteractionStartTime();

	// Determine timing strategy based on SSR status
	if (ssrPreviewInfo?.wasSSRSuccessful && ssrPreviewInfo.dataUri) {
		const entry = findPerformanceEntryByName(ssrPreviewInfo.srcset ?? ssrPreviewInfo.dataUri);

		if (entry) {
			addResourceTimingMarks(experience, entry, interactionStartTime, 'ssr');
			experience.addMetadata({
				...createResourceTimingMetadata(entry),
				timingStrategy: 'ssr-resource-timing',
			});
		} else {
			experience.addMetadata({
				timingStrategy: 'ssr-no-entry-found',
			});
		}
	} else if (ssrPreviewInfo?.wasSSRAttempted) {
		experience.addMetadata({
			timingStrategy: 'ssr-failed',
			interactionStartTime,
		});
		experience.mark('interactionStart', 0);
	} else {
		experience.addMetadata({
			timingStrategy: 'csr-mount-based',
		});
	}

	const sanitisedFileAttributes = sanitiseFileAttributes(fileAttributes);

	switch (status) {
		case 'complete':
			experience.success({
				metadata: {
					fileAttributes: sanitisedFileAttributes,
					ssrReliability,
					fileStateFlags,
					...getBasePayloadAttributes(),
				},
			});
			break;
		case 'failed-processing':
			experience.failure({
				metadata: {
					fileAttributes: sanitisedFileAttributes,
					ssrReliability,
					fileStateFlags,
					failReason: 'failed-processing',
					...getBasePayloadAttributes(),
				},
			});
			break;
		case 'error':
			experience.failure({
				metadata: {
					fileAttributes: sanitisedFileAttributes,
					ssrReliability,
					fileStateFlags,
					...extractErrorInfo(error),
					request: getRenderErrorRequestMetadata(error),
					...getBasePayloadAttributes(),
				},
			});
			break;
	}
};

export const abortUfoExperience = (id: string, properties?: Partial<SucceedUfoPayload>) => {
	const metadata: CustomData = { ...getBasePayloadAttributes() };

	if (properties?.fileAttributes) {
		metadata.fileAttributes = sanitiseFileAttributes(properties.fileAttributes);
	}
	if (properties?.fileStateFlags) {
		metadata.fileStateFlags = properties.fileStateFlags as unknown as CustomData;
	}
	if (properties?.ssrReliability) {
		metadata.ssrReliability = properties.ssrReliability as unknown as CustomData;
	}

	getExperience(id).abort({ metadata });
};

// Suppress unused type warnings - these are used for type documentation
export type { FailedProcessingPayload as _FailedProcessingPayload };
export type { ErrorUfoPayload as _ErrorUfoPayload };
