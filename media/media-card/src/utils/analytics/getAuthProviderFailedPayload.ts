import { isCommonMediaClientError } from '@atlaskit/media-client';

import { getCollectionNameFromAuthContext } from './analytics';
import type { AuthProviderFailedAnalyticsPayload } from './analytics';

// Similar to extractErrorInfo but works with raw Error (not MediaCardError)
const extractAuthProviderErrorInfo = (error: Error) => {
	if (isCommonMediaClientError(error)) {
		return {
			failReason: error.reason,
			error: error.reason,
			errorDetail: error.innerError?.message ?? error.message,
		};
	}
	return {
		failReason: error.name || 'unknown',
		error: error.name || '',
		errorDetail: error.message,
	};
};

export const getAuthProviderFailedPayload = (
	durationMs: number,
	timeoutMs: number,
	error: Error,
	authContext?: { access?: Array<{ type: string; name?: string }>; collectionName?: string },
): AuthProviderFailedAnalyticsPayload => {
	const errorInfo = extractAuthProviderErrorInfo(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaAuthProvider',
		attributes: {
			status: 'failed',
			durationMs,
			timeoutMs,
			collectionName: getCollectionNameFromAuthContext(authContext),
			...errorInfo,
		},
	};
};
