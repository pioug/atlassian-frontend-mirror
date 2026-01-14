import {
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type AnalyticsEventPayload as EditorAnalyticsEventPayload,
	type DispatchAnalyticsEvent,
	type ExperienceEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import type { AnalyticsEventPayload as RendererAnalyticsEventPayload } from '@atlaskit/renderer';

export const setupExperienceTracking = (
	syncBlockStoreManager: SyncBlockStoreManager,
	fireAnalyticsEvent?: ((payload: RendererAnalyticsEventPayload) => void),
) => {
	if (!fireAnalyticsEvent) {
		return;
	}

	const dispatchAnalyticsEvent = createExperienceDispatcher(fireAnalyticsEvent);

	syncBlockStoreManager.referenceManager.setExperiences(
		getFetchExperience(dispatchAnalyticsEvent),
		getFetchSourceInfoExperience(dispatchAnalyticsEvent),
		getSaveReferenceExperience(dispatchAnalyticsEvent)
	)
}

export const createExperienceDispatcher = (
	fireAnalyticsEvent?: ((payload: RendererAnalyticsEventPayload) => void),
): DispatchAnalyticsEvent => {
	return (payload: EditorAnalyticsEventPayload) => {
		// Runtime type guard - only forward experience events
		if (payload.action === 'experienceMeasured' || payload.action === 'experienceSampled') {
			fireAnalyticsEvent?.(payload as ExperienceEventPayload);
		}
	};
};

/**
 * This experience tracks when a reference sync block data is fetched from the BE.
 *
 * Start: When the fetchNodesData function is called.
 * Success: When the fetching the data is successful within 1500ms of start.
 * Failure: When 1500ms passes without the data being successfully fetched, or the fetch fails
 */
export const getFetchExperience = (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 1500 }),
		],
	});
};

/**
 * This experience tracks when a reference sync block source info data (title, url) is fetched from the BE.
 *
 * Start: When the fetchSourceInfo function is called.
 * Success: When the fetching the data is successful within 2500ms of start.
 * Failure: When 2500ms passes without the data being successfully fetched, or the fetch fails
 */
export const getFetchSourceInfoExperience = (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 2500 }),
		],
	});
};

/**
 * This experience tracks when a reference sync block is saved to the BE.
 *
 * Start: When the flush sync block function is called.
 * Success: When the sync block save is successful within 1500ms of start.
 * Failure: When 1500ms passes before the sync block save is marked as successful
 */
export const getSaveReferenceExperience = (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 1500 }),
		],
	});
};
