import { isRequestError } from '@atlaskit/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common';

const getRequestErrorDetails = (err: any) => {
	if (isRequestError(err)) {
		return {
			request: {
				statusCode: err.metadata?.statusCode,
				traceContext: err.metadata?.traceContext,
				mediaEnv: err.metadata?.mediaEnv,
				mediaRegion: err.metadata?.mediaRegion,
			},
		};
	}

	return undefined;
};

export const getCopyIntentErrorPayload = (error: any, fileId = ''): {
    eventType: string; action: string; actionSubject: string; failReason: string; attributes: {
        request?: {
            statusCode: number | undefined;
            traceContext: MediaTraceContext | undefined;
            mediaEnv: string | undefined;
            mediaRegion: string | undefined;
        } | undefined;
        status: string;
        fileAttributes: {
            fileId: string;
        };
    };
} => {
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaCopyIntent',
		failReason: isRequestError(error) ? error.reason : 'nativeError',
		attributes: {
			status: 'fail',
			fileAttributes: {
				fileId,
			},
			...getRequestErrorDetails(error),
		},
	};
};

export const getCopyIntentSuccessPayload = (fileId = ''): {
    eventType: string;
    action: string;
    actionSubject: string;
    attributes: {
        fileAttributes: {
            fileId: string;
        };
    };
} => {
	return {
		eventType: 'operational',
		action: 'succeeded',
		actionSubject: 'mediaCopyIntent',
		attributes: {
			fileAttributes: {
				fileId,
			},
		},
	};
};
