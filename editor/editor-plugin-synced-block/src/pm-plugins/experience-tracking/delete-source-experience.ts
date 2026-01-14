import { bind } from 'bind-event-listener';

import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { EXPERIENCE_ABORT_REASON, type ExperienceOptions, type ProviderExperienceOptions } from '../../types'
import { getRemovedResourceIds, getTarget } from '../utils/experience-tracking-utils';

const pluginKey = new PluginKey('deleteSourceSyncBlockExperience');

const START_METHOD = {
	DELETE_CONFIRM_BUTTON: 'delete-confirm-button',
};

/**
 * This experience tracks when a source sync block is deleted.
 *
 * Start: When user clicks the delete button in the delete modal
 * Success: When the sync block is removed from the DOM within 2000ms of start
 * Failure: When 2000ms passes without the source sync block being removed from the DOM
 */
export const getDeleteSourceExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
	syncBlockStore,
}: ProviderExperienceOptions) => {
	const experience = getDeleteSourceExperience({ refs, dispatchAnalyticsEvent });
	syncBlockStore.sourceManager.setDeleteExperience(experience);

	const unbindClickListener = bind(document, {
		type: 'click',
		listener: (event: MouseEvent) => {
			const target = event.target as Element | null;
			if (!target) {
				return;
			}

			const button = target.closest('button[data-testid]');
			if (!button || !(button instanceof HTMLButtonElement)) {
				return;
			}

			const testId = button.dataset.testid;
			if (isSyncedBlockDeleteButtonId(testId)) {
				experience.start({ method: START_METHOD.DELETE_CONFIRM_BUTTON})
			}
		}
	});

	return new SafePlugin({
		key: pluginKey,
		view: () => {
			return {
				destroy: () => {
					experience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
					unbindClickListener();
				},
			};
		},
	})
}

export const getDeleteSourceExperience = ({ refs, dispatchAnalyticsEvent }: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 2000 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					const deletedResourceIds = getRemovedResourceIds(mutations, '[data-prosemirror-node-name="bodiedSyncBlock"]');
					if (deletedResourceIds.length > 0) {
						return {
							status: 'success',
							metadata: { deletedResourceIds }
						};
					}

					return undefined;
				},
				observeConfig: () => {
					return {
						target: getTarget(refs.containerElement),
						options: {
							childList: true,
						},
					};
				},
			}),
		],
	});
};

const isSyncedBlockDeleteButtonId = (testId?: string) =>
	testId === 'synced-block-delete-confirmation-modal-delete-button';
