import type { Identifier } from '@atlaskit/media-client/identifier';
import { isErrorFileState } from '@atlaskit/media-client/is-error-file-state';
import { isFileIdentifier } from '@atlaskit/media-client/is-file-identifier';
import { isImageRepresentationReady } from '@atlaskit/media-client/is-image-representation-ready';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { MediaType } from '@atlaskit/media-common/main-types';
import { getMediaTypeFromMimeType } from '@atlaskit/media-common/mediaTypeUtils';
import { sanitiseAnalyticsPayload } from '@atlaskit/media-common/sanitisePayload';
import type { FileState } from '@atlaskit/media-state/file-state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import {
	createPreloadEndedEventPayload,
	createPreloadFailedEventPayload,
	type MediaViewerPreloadEventPayload,
} from './analytics/events/operational/preload';
import { loadImageViewerChunk, loadMediaViewerChunk } from './chunkLoaders';
import {
	getImageViewerRequestParams,
	IMAGE_VIEWER_FETCH_MAX_RES,
} from './viewers/image/imageRequestParams';
import { getWarmedImageKey, hasWarmedImage, setWarmedImage } from './warmedImages';

export type {
	MediaViewerPreloadEventPayload,
	PreloadEndedEventPayload,
	PreloadFailedEventPayload,
} from './analytics/events/operational/preload';

/**
 * Share of warm-ups that report `preloadEnded`, which measures how many warm-ups the
 * viewer takes. `preloadFailed` is never sampled.
 */
const PRELOAD_ENDED_SAMPLING_RATE = 0.1;

/**
 * A warm-up is speculative, so it doesn't retry a failure with backoff. Retrying a
 * 5xx would add load when the image endpoint is already struggling, and the viewer
 * makes its own request on open anyway. media-client's Edge network-error fallback
 * still applies. `fetchRetry` waits `startTimeoutInMs` even
 * after the last attempt, so it is zero: a failed warm-up a viewer has taken then
 * hands over to the viewer's own request without a pause.
 */
const WARM_UP_CLIENT_OPTIONS = { retryOptions: { maxAttempts: 1, startTimeoutInMs: 0 } };

/** SVGs are rendered by `SvgViewer`, which does not go through the image endpoint. */
const SVG_MIME_TYPE = 'image/svg+xml';

/**
 * Effective connection types where speculatively downloading a full resolution
 * image costs the user more than the latency it saves.
 */
const METERED_EFFECTIVE_TYPES = ['slow-2g', '2g', '3g'];

const isMeteredConnection = (): boolean => {
	if (typeof navigator === 'undefined') {
		return false;
	}

	const { connection } = navigator as Navigator & {
		connection?: { saveData?: boolean; effectiveType?: string };
	};

	if (!connection) {
		return false;
	}

	return (
		!!connection.saveData ||
		(!!connection.effectiveType && METERED_EFFECTIVE_TYPES.includes(connection.effectiveType))
	);
};

export type PreloadMediaViewerOptions = {
	/**
	 * Returns the media client for the image request. Only called when an image is
	 * actually warmed, so the control arm never creates a client.
	 */
	getMediaClient: () => MediaClient;
	identifier: Identifier;
	/** Mime type of the target file, when the caller knows it. */
	mimeType?: string;
	/** Media type of the target file. Derived from `mimeType` when omitted. */
	mediaType?: MediaType;
	/**
	 * File state for the target file, when the caller already has it. Used to
	 * skip the image warm-up in the cases where `ImageViewer` would not request
	 * the image endpoint anyway.
	 */
	fileState?: FileState;
	traceContext?: MediaTraceContext;
	/**
	 * Receives the warm-up's operational events, for the caller to fire on the media
	 * channel with its own analytics. Errors it throws are ignored.
	 */
	onAnalyticsEvent?: (payload: MediaViewerPreloadEventPayload) => void;
};

/**
 * Speculatively warms what the media viewer needs to display `identifier`, so
 * that opening it is closer to instant. Intended to be called from a hover or
 * focus handler on whatever opens the viewer.
 *
 * Two things get warmed:
 *  - the lazily loaded viewer chunks, and
 *  - the full resolution image binary, whose in-flight request is kept in
 *    `./warmedImages` for `ImageViewer` to take instead of issuing its own.
 *
 * The image request starts once media-client has resolved the watermark version
 * it carries, because the version is part of the warmed image's key.
 *
 * The image binary is only warmed when the file is known to be a non-SVG image,
 * because `ImageViewer` is the only viewer that makes this request. Callers that
 * know nothing about the file still get the chunk warm-up.
 *
 * Safe to call repeatedly and safe to call for files the user never opens: an
 * image already being warmed is not requested again, a failed image request is not
 * retried and its rejection is handled, and no image is fetched on metered or slow
 * connections. Failures and outcomes go to `onAnalyticsEvent`.
 *
 * This is the exposure point for the `platform_media_viewer_preload_on_hover`
 * experiment. Callers attach their handlers in both arms, and the exposure fires
 * here before the arms differ, so both arms are exposed on the same hover or focus.
 */
export const preloadMediaViewer = ({
	getMediaClient,
	identifier,
	mimeType,
	mediaType,
	fileState,
	traceContext,
	onAnalyticsEvent,
}: PreloadMediaViewerOptions): void => {
	// External images need no warm-up: the viewer renders the same `dataURI` the
	// card is already displaying. Checked before the exposure, so neither arm is
	// exposed for them.
	if (!isFileIdentifier(identifier)) {
		return;
	}

	if (!isExperimentEnabled('platform_media_viewer_preload_on_hover')) {
		return;
	}

	void loadMediaViewerChunk().catch(() => {});

	const resolvedMediaType =
		mediaType ?? (mimeType ? getMediaTypeFromMimeType(mimeType) : undefined);

	if (resolvedMediaType !== 'image' || mimeType === SVG_MIME_TYPE) {
		return;
	}

	void loadImageViewerChunk().catch(() => {});

	if (fileState) {
		// `ImageViewer` renders `fileState.preview` directly when one exists
		// (typically a local upload preview) without touching the image endpoint.
		if (!isErrorFileState(fileState) && fileState.preview) {
			return;
		}

		// Otherwise it waits for the backend image representation before fetching.
		if (!isImageRepresentationReady(fileState)) {
			return;
		}
	}

	if (isMeteredConnection()) {
		return;
	}

	const mediaClient = getMediaClient();
	const { id, collectionName } = identifier;

	const warmImage = (watermarkVersion: string | undefined) => {
		const key = getWarmedImageKey({ id, collectionName, watermarkVersion });

		// An existing entry is either still downloading or already resolved. Either way
		// the viewer can take it, so there is nothing to do. Checked after the version
		// resolves, so repeated hovers still make one request.
		if (hasWarmedImage(key)) {
			return;
		}

		const controller = new AbortController();
		const startedAt = Date.now();
		const fileSize = fileState && !isErrorFileState(fileState) ? fileState.size : undefined;
		const fileAttributes = {
			fileId: id,
			fileMediatype: resolvedMediaType,
			fileMimetype: mimeType,
			...(fileSize !== undefined && { fileSize }),
		};

		const report = (createPayload: () => MediaViewerPreloadEventPayload) => {
			try {
				// Sanitised here, as every media channel event is, so each caller sends the
				// same masked payload.
				onAnalyticsEvent?.(
					sanitiseAnalyticsPayload(createPayload()) as MediaViewerPreloadEventPayload,
				);
			} catch {
				// Analytics must never break the warm-up.
			}
		};
		const isSampled = !!onAnalyticsEvent && Math.random() < PRELOAD_ENDED_SAMPLING_RATE;

		setWarmedImage(
			key,
			{
				image: mediaClient.getImage(
					id,
					getImageViewerRequestParams(collectionName),
					controller,
					IMAGE_VIEWER_FETCH_MAX_RES,
					traceContext,
					WARM_UP_CLIENT_OPTIONS,
				),
				controller,
			},
			onAnalyticsEvent && {
				onEnd: isSampled
					? (outcome, blob) =>
							report(() =>
								createPreloadEndedEventPayload({
									outcome,
									blob,
									durationMs: Date.now() - startedAt,
									fileAttributes,
									traceContext,
									samplingRate: PRELOAD_ENDED_SAMPLING_RATE,
								}),
							)
					: undefined,
				onError: (error, wasTaken) =>
					report(() =>
						createPreloadFailedEventPayload({
							error,
							wasTaken,
							durationMs: Date.now() - startedAt,
							fileAttributes,
							traceContext,
						}),
					),
			},
		);
	};

	// The key carries the watermark version the image request is made with, so a
	// warm-up made before a watermark config change never reaches a viewer opened after
	// it. If auth fails, the image request would fail too, so only the chunks are warmed
	// and the viewer's own request reports the failure. Called inside a promise, so a
	// throw (say, from an older media-client without the method) can't reach the hover
	// handler that called this.
	void Promise.resolve()
		.then(() => mediaClient.getImageWatermarkVersion(collectionName))
		.then(warmImage, () => {});
};
