import { NCS_STORAGE } from '@atlaskit/editor-common/ncs-step-metrics';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { StorageClient } from '@atlaskit/frontend-utilities';

import { CollabEditPlugin } from '../collabEditPluginType';

type StepSessionMetrics = {
	totalStepSize: number;
	numberOfSteps: number;
	maxStepSize: number;
	stepSizeSumForP90: number[];
};

const storageClient = new StorageClient(NCS_STORAGE.NCS_STORAGE_CLIENT_KEY);

/**
 * Gets the current step session metrics for a given session ID
 * If the session ID does not exist, it initializes a new metrics object.
 * It calculates the total size of the steps, the number of steps,
 * the maximum step size, and the sum of step sizes for P90 calculation.
 *
 * @param metrics - The existing metrics object from local storage.
 * @param sessionId - The session ID for which to get the metrics.
 * @param steps - The steps to calculate the metrics from.
 * @returns The updated step session metrics for the given session ID.
 */
export const getNcsSessionStepMetrics = (
	metrics: { [sessionId: string]: StepSessionMetrics },
	sessionId: string,
	steps: Step[],
): StepSessionMetrics => {
	const current: StepSessionMetrics = metrics[sessionId] ?? {
		ncsSessionId: sessionId,
		totalStepSize: 0,
		numberOfSteps: 0,
		maxStepSize: 0,
		stepSizeSumForP90: [],
	};

	steps.forEach((step) => {
		const stepSize = JSON.stringify(step).length;
		current.totalStepSize += stepSize;
		current.numberOfSteps += 1;
		current.maxStepSize = Math.max(current.maxStepSize, stepSize || 0);
		current.stepSizeSumForP90.push(stepSize || 0);
	});

	return current;
};

/**
 * Gets the current active sessions from local storage
 * If the session ID does not exist, it initializes a new active session.
 *
 * This is used in the ncsStepMetricsPlugin to determine if the session is still active
 * before sending the ncs steps analytics event.
 *
 * @param sessionId - The session ID to check or update in local storage.
 * @returns void
 */
export const updateNcsActiveSessions = (sessionId: string) => {
	const currentActiveSessions = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_ACTIVE_SESSIONS) || '{}',
	);

	if (!currentActiveSessions[sessionId]) {
		storageClient.setItemWithExpiry(
			NCS_STORAGE.NCS_ACTIVE_SESSIONS,
			JSON.stringify({
				...currentActiveSessions,
				[sessionId]: true,
			}),
		);
	}
};

type UpdateNcsSessionStepMetricProps = {
	api: ExtractInjectionAPI<CollabEditPlugin> | undefined;
	steps: Step[];
};

/**
 * Updates the step session metrics in local storage for a given session ID.
 * It calculates the metrics based on the provided steps and updates the storage.
 *
 * @param api - The API to access the collab edit plugin.
 * @param steps - The steps to calculate the metrics from.
 * @return void
 */
export const updateNcsSessionStepMetrics = ({ api, steps }: UpdateNcsSessionStepMetricProps) => {
	const sessionId = api?.collabEdit?.sharedState.currentState()?.sessionId;
	if (!sessionId) {
		return;
	}

	const existingMetrics = JSON.parse(
		storageClient.getItem(NCS_STORAGE.NCS_SESSION_STEP_METRICS) || '{}',
	);
	const ncsSessionStepMetrics = getNcsSessionStepMetrics(existingMetrics, sessionId, steps);
	storageClient.setItemWithExpiry(
		NCS_STORAGE.NCS_SESSION_STEP_METRICS,
		JSON.stringify({
			...existingMetrics,
			[sessionId]: ncsSessionStepMetrics,
		}),
	);

	updateNcsActiveSessions(sessionId);
};
