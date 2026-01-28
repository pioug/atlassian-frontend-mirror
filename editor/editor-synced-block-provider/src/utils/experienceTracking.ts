import {
	type AnalyticsEventPayload as EditorAnalyticsEventPayload,
	type DispatchAnalyticsEvent,
	type ExperienceEventPayload,
	type SyncBlockEventPayload,
	type RendererSyncBlockEventPayload,
	ACTION,
} from '@atlaskit/editor-common/analytics';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';

const TIMEOUT_DURATION = 30000;

export const createExperienceDispatcher = (
	fireAnalyticsEvent?: ((payload: SyncBlockEventPayload) => void) | ((payload: RendererSyncBlockEventPayload) => void),
): DispatchAnalyticsEvent => {
	return (payload: EditorAnalyticsEventPayload) => {
		// Runtime type guard - only forward experience events
		if (payload.action === ACTION.EXPERIENCE_MEASURED || payload.action === ACTION.EXPERIENCE_SAMPLED) {
			fireAnalyticsEvent?.(payload as ExperienceEventPayload);
		}
	};
};

/**
 * This experience tracks when a source sync block is saved to the BE.
 *
 * Start: When the flush source sync block function is called.
 * Success: When the sync block save is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the sync block being successfully saved
 */
export const getSaveSourceExperience = (fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_UPDATE,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};

/**
 * This experience tracks when a reference sync block is saved to the BE.
 *
 * Start: When the flush sync block function is called.
 * Success: When the sync block save is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the sync block being successfully saved
 */
export const getSaveReferenceExperience = (fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.REFERENCE_SYNCED_BLOCK_UPDATE,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};


/**
 * This experience tracks when a reference sync block data is fetched from the BE.
 *
 * Start: When the fetchNodesData function is called.
 * Success: When the fetching the data is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the data being successfully fetched, or the fetch fails
 */
export const getFetchExperience = (fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_FETCH,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};

/**
 * This experience tracks when a reference sync block source info data (title, url) is fetched from the BE.
 *
 * Start: When the fetchSourceInfo function is called.
 * Success: When the fetching the data is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the data being successfully fetched, or the fetch fails
 */
export const getFetchSourceInfoExperience = (fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_GET_SOURCE_INFO,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};

/**
 * This experience tracks when a source sync block is deleted from the BE.
 *
 * Start: When the fetchSourceInfo function is called.
 * Success: When the fetching the data is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the data being successfully fetched, or the fetch fails
 */
export const getDeleteSourceExperience = (fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_DELETE,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};

/**
 * This experience tracks when a source sync block is created and registered to the BE.
 *
 * Start: When the fetchSourceInfo function is called.
 * Success: When the fetching the data is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the data being successfully fetched, or the fetch fails
 */
export const getCreateSourceExperience = (fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};

/**
 * This experience tracks when a source sync block is created and registered to the BE.
 *
 * Start: When the fetchSourceInfo function is called.
 * Success: When the fetching the data is successful within the timeout duration of start.
 * Failure: When the timeout duration passes without the data being successfully fetched, or the fetch fails
 */
export const getFetchReferencesExperience = (fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) => {
	return new Experience(EXPERIENCE_ID.ASYNC_OPERATION, {
		action: ACTION.SYNCED_BLOCK_FETCH_REFERENCES,
		dispatchAnalyticsEvent: createExperienceDispatcher(fireAnalyticsEvent),
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
		],
	});
};
