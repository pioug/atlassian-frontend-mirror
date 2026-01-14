import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { EXPERIENCE_ABORT_REASON, type ExperienceOptions, type ProviderExperienceOptions } from '../../types'

const pluginKey = new PluginKey('providerOnlySyncBlockExperiences');

export const getProviderOnlyExperiencesPlugin = ({
	refs,
	dispatchAnalyticsEvent,
	syncBlockStore
}: ProviderExperienceOptions) => {
	const saveSourceExperience = getSaveSourceExperience({ refs, dispatchAnalyticsEvent });
	syncBlockStore.sourceManager.setSaveExperience(saveSourceExperience);

	const saveReferenceExperience = getSaveReferenceExperience({ refs, dispatchAnalyticsEvent });
	const fetchExperience = getFetchExperience({ refs, dispatchAnalyticsEvent });
	const fetchSourceInfoExperience = getFetchSourceInfoExperience({ refs, dispatchAnalyticsEvent });
	syncBlockStore.referenceManager.setExperiences(fetchExperience, fetchSourceInfoExperience, saveReferenceExperience);

	return new SafePlugin({
		key: pluginKey,
		view: () => {
			return {
				destroy: () => {
					saveSourceExperience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
					saveReferenceExperience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED});
					fetchExperience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
					fetchSourceInfoExperience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
				},
			};
		},
	})
}

/**
 * This experience tracks when a source sync block is saved to the BE.
 *
 * Start: When the flush source sync block function is called.
 * Success: When the sync block save is successful within 1500ms of start.
 * Failure: When 1500ms passes without the sync block being successfully saved
 */
const getSaveSourceExperience = ({ dispatchAnalyticsEvent }: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 1500 }),
		],
	});
};

/**
 * This experience tracks when a reference sync block is saved to the BE.
 *
 * Start: When the flush sync block function is called.
 * Success: When the sync block save is successful within 1500ms of start.
 * Failure: When 1500ms passes without the sync block being successfully saved
 */
const getSaveReferenceExperience = ({dispatchAnalyticsEvent}: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 1500 }),
		],
	});
};


/**
 * This experience tracks when a reference sync block data is fetched from the BE.
 *
 * Start: When the fetchNodesData function is called.
 * Success: When the fetching the data is successful within 1500ms of start.
 * Failure: When 1500ms passes without the data being successfully fetched, or the fetch fails
 */
const getFetchExperience = ({ dispatchAnalyticsEvent }: ExperienceOptions) => {
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
const getFetchSourceInfoExperience = ({ dispatchAnalyticsEvent }: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 2500 }),
		],
	});
};

