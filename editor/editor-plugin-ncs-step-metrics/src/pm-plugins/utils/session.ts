import type { NcsSessionStepMetrics } from '@atlaskit/editor-common/analytics';
import { NCS_STORAGE } from '@atlaskit/editor-common/ncs-step-metrics';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { StorageClient } from '@atlaskit/frontend-utilities';

import { getPayload } from './analytics';
import { calculateP90Value } from './calculateP90Value';

const storageClient = new StorageClient(NCS_STORAGE.NCS_STORAGE_CLIENT_KEY);

/**
 * This function transforms the NCS session step metrics
 * into a format suitable for analytics events.
 * @param metrics - The NCS session step metrics to be transformed.
 */
const transformSessionStepMetrics = (metrics: NcsSessionStepMetrics) => {
	return {
		ncsSessionId: metrics.ncsSessionId,
		totalStepSize: metrics.totalStepSize,
		numberOfSteps: metrics.numberOfSteps,
		maxStepSize: metrics.maxStepSize,
		p90StepSize: calculateP90Value(metrics.stepSizeSumForP90),
	};
};

/**
 * Gets the current NCS session step metrics from storage.
 * @param sessionId - The session ID for which to retrieve the metrics.
 */
export const getNcsSessionStepMetrics = (sessionId: string): NcsSessionStepMetrics | undefined => {
	if (!sessionId) {
		return;
	}

	const ncsSessionStepMetrics = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_SESSION_STEP_METRICS) || '{}',
	);

	const current = ncsSessionStepMetrics[sessionId];
	if (current) {
		return transformSessionStepMetrics(current);
	}
	return undefined;
};

/**
 * Clears the NCS session step metrics and the active session from storage.
 * @param sessionId - The session ID for which to clear the metrics.
 */
export const clearNcsSessionStepMetrics = (sessionId: string): void => {
	if (!sessionId) {
		return;
	}

	// Clear the current NCS session step metrics from storage
	const ncsSessionStepMetrics = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_SESSION_STEP_METRICS) || '{}',
	);
	if (ncsSessionStepMetrics[sessionId]) {
		delete ncsSessionStepMetrics[sessionId];
		if (Object.keys(ncsSessionStepMetrics).length === 0) {
			storageClient.removeItem(NCS_STORAGE.NCS_SESSION_STEP_METRICS);
		} else {
			storageClient.setItemWithExpiry(
				NCS_STORAGE.NCS_SESSION_STEP_METRICS,
				JSON.stringify(ncsSessionStepMetrics),
			);
		}
	}

	// Clear the active session from storage
	clearNcsActiveSession(sessionId);
};

/**
 * Clears the active NCS session from storage.
 * @param sessionId - The session ID for which to clear the active session.
 */
export const clearNcsActiveSession = (sessionId?: string): void => {
	if (!sessionId) {
		return;
	}

	const activeSessions = JSON.parse(storageClient.getItem(NCS_STORAGE.NCS_ACTIVE_SESSIONS) || '{}');
	if (activeSessions[sessionId]) {
		delete activeSessions[sessionId];
		if (Object.keys(activeSessions).length === 0) {
			storageClient.removeItem(NCS_STORAGE.NCS_ACTIVE_SESSIONS);
		} else {
			storageClient.setItemWithExpiry(
				NCS_STORAGE.NCS_ACTIVE_SESSIONS,
				JSON.stringify(activeSessions),
			);
		}
	}
};

/**
 * This function checks for any unfinished NCS sessions
 * If it finds any, and the session is not active, it sends the analytics event
 * @param api - The public plugin API to access the analytics plugin.
 */
export const checkForUnfinishedNcsSessions = (api: PublicPluginAPI<[AnalyticsPlugin]>): void => {
	const ncsSessionStepMetrics = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_SESSION_STEP_METRICS) || '{}',
	);

	const activeNcsSessions = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_ACTIVE_SESSIONS) || '{}',
	);

	Object.keys(ncsSessionStepMetrics).forEach((id) => {
		if (!activeNcsSessions[id]) {
			const metrics = transformSessionStepMetrics(ncsSessionStepMetrics[id]);
			if (metrics) {
				const payload = getPayload(metrics);
				api?.analytics?.actions?.fireAnalyticsEvent(payload);
				clearNcsSessionStepMetrics(id);
			}
		}
	});
};
