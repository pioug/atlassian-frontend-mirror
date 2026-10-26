import type {
	FileAttributes,
	MediaTraceContext,
	WithFileAttributes,
	WithTraceContext,
} from '@atlaskit/media-common/analytics/types';

import { type MediaViewerFailureAttributes } from '../..';
import { getErrorDetail } from '../../../getErrorDetail';
import { getPrimaryErrorReason } from '../../../getPrimaryErrorReason';
import { getRequestMetadata } from '../../../getRequestMetadata';
import { getSecondaryErrorReason } from '../../../getSecondaryErrorReason';
import { MediaViewerError } from '../../../MediaViewerError';
import type { WarmUpOutcome } from '../../../warmedImages';
import { type MediaFileEventPayload } from './_mediaFile';

/** Fired when a warm-up request fails for a reason other than an abort. Never sampled. */
export type PreloadFailedEventPayload = MediaFileEventPayload<
	MediaViewerFailureAttributes & {
		/** Whether `ImageViewer` had already taken the warm-up when it failed. */
		wasTaken: boolean;
		durationMs: number;
	},
	'preloadFailed'
>;

/** Fired once per sampled warm-up, when it leaves the warmed image store. */
export type PreloadEndedEventPayload = MediaFileEventPayload<
	WithFileAttributes &
		WithTraceContext & {
			outcome: WarmUpOutcome;
			/** Whether the image had finished downloading by then. */
			resolved: boolean;
			sizeBytes?: number;
			durationMs: number;
			isSamplingEnabled: boolean;
			samplingRate: number;
		},
	'preloadEnded'
>;

export type MediaViewerPreloadEventPayload = PreloadFailedEventPayload | PreloadEndedEventPayload;

export const createPreloadFailedEventPayload = ({
	error,
	wasTaken,
	durationMs,
	fileAttributes,
	traceContext,
}: {
	error: unknown;
	wasTaken: boolean;
	durationMs: number;
	fileAttributes: FileAttributes;
	traceContext?: MediaTraceContext;
}): PreloadFailedEventPayload => {
	const viewerError = new MediaViewerError(
		'preload-image-fetch',
		error instanceof Error ? error : undefined,
	);
	const requestMetadata = getRequestMetadata(viewerError);
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'preloadFailed',
		attributes: {
			status: 'fail',
			failReason: getPrimaryErrorReason(viewerError),
			error: getSecondaryErrorReason(viewerError),
			errorDetail: getErrorDetail(viewerError),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			fileMimetype: fileAttributes.fileMimetype,
			fileMediatype: fileAttributes.fileMediatype,
			fileAttributes,
			traceContext,
			wasTaken,
			durationMs,
		},
	};
};

export const createPreloadEndedEventPayload = ({
	outcome,
	blob,
	durationMs,
	fileAttributes,
	traceContext,
	samplingRate,
}: {
	outcome: WarmUpOutcome;
	blob: Blob | undefined;
	durationMs: number;
	fileAttributes: FileAttributes;
	traceContext?: MediaTraceContext;
	samplingRate: number;
}): PreloadEndedEventPayload => ({
	eventType: 'operational',
	actionSubject: 'mediaFile',
	action: 'preloadEnded',
	attributes: {
		outcome,
		resolved: !!blob,
		sizeBytes: blob?.size,
		durationMs,
		fileAttributes,
		traceContext,
		isSamplingEnabled: samplingRate < 1,
		samplingRate,
	},
});
