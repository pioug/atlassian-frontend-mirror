import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type ExperienceOptions, EXPERIENCE_ABORT_REASON } from '../../types'
import { getAddedResourceIds, wasSyncBlockDeletedOrAddedByHistory, getTarget } from '../utils/experience-tracking-utils';

const isPastedFromFabricEditor = (html?: string): boolean =>
 	!!html && html.indexOf('data-pm-slice="') >= 0;

const pluginKey = new PluginKey('createReferenceSyncBlockExperience');

const START_METHOD = {
	PASTE: 'paste',
	UNDO: 'undo',
	REDO: 'redo',
};

/**
 * This experience tracks when a reference sync block is inserted.
 *
 * Start: When user pastes a sync block from editor and createSyncedBlock is called
 * Success: When the sync block is added to the DOM within 500ms of start
 * Failure: When 500ms passes without the reference sync block being added to the DOM
 */
export const getCreateReferenceExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	const experience = getCreateReferenceExperience({ refs, dispatchAnalyticsEvent });

	return new SafePlugin({
		key: pluginKey,
		view: () => {
			return {
				destroy: () => {
					experience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
				},
			};
		},
		props: {
			handlePaste: (_view, rawEvent, slice) => {
				const event = rawEvent as ClipboardEvent;
				const html = event.clipboardData?.getData('text/html');

				// do not start on paste from renderer, because this flattens the content and does not create a reference block
				if (isPastedFromFabricEditor(html)) {
					slice.content.forEach((node) => {
						if (node.type.name === 'syncBlock' || node.type.name === 'bodiedSyncBlock') {
							experience.start({method: START_METHOD.PASTE})
						}
					});
				}
			},
		},
		appendTransaction: (transactions, oldState, newState) => {
			transactions.forEach((tr) => {
				const { hasAddedSyncBlock, isUndo } = wasSyncBlockDeletedOrAddedByHistory(tr, oldState, newState);
				if (hasAddedSyncBlock) {
					experience.start({
						method: isUndo ? START_METHOD.UNDO : START_METHOD.REDO
					});
				}
			});

			return null;
		},
	})
}

const getCreateReferenceExperience = ({refs, dispatchAnalyticsEvent}: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_CREATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 500 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					const insertedResourceIds = getAddedResourceIds(mutations, '[data-prosemirror-node-name="syncBlock"]');
					if (insertedResourceIds.length > 0) {
						return {
							status: 'success',
							metadata: { insertedResourceIds }
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


