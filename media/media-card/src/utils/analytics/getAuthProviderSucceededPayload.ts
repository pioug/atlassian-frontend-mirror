import { getCollectionNameFromAuthContext } from './analytics';
import type { AuthProviderSucceededAnalyticsPayload } from './analytics';

export const getAuthProviderSucceededPayload = (
	durationMs: number,
	timeoutMs: number,
	authContext?: { access?: Array<{ type: string; name?: string }>; collectionName?: string },
): AuthProviderSucceededAnalyticsPayload => ({
	eventType: 'operational',
	action: 'succeeded',
	actionSubject: 'mediaAuthProvider',
	attributes: {
		status: 'succeeded',
		durationMs,
		timeoutMs,
		collectionName: getCollectionNameFromAuthContext(authContext),
	},
});
