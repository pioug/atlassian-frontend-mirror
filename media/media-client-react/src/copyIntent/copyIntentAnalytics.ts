import { isRequestError } from '@atlaskit/media-client';

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
};

export const getCopyIntentErrorPayload = (error: any, fileId = '') => {
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

export const getCopyIntentSuccessPayload = (fileId = '') => {
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
