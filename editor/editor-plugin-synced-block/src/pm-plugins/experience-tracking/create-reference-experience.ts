import { ACTION_SUBJECT, ACTION_SUBJECT_ID, type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const isPastedFromFabricEditor = (html?: string): boolean =>
 	!!html && html.indexOf('data-pm-slice="') >= 0;


const pluginKey = new PluginKey('createReferenceSyncBlockExperience');

type CreateReferenceExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: { containerElement?: HTMLElement };
};

const START_METHOD = {
	PASTE: 'paste',
};

const ABORT_REASON = {
	EDITOR_DESTROYED: 'editor-destroyed',
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
}: CreateReferenceExperienceOptions) => {
	const experience = getCreateReferenceExperience({ refs, dispatchAnalyticsEvent });

	return new SafePlugin({
		key: pluginKey,
		view: () => {
			return {
				destroy: () => {
					experience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
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
		}
	})
}

const getCreateReferenceExperience = ({refs, dispatchAnalyticsEvent}: CreateReferenceExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_CREATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 500 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					if (mutations.some(isReferenceSyncBlockAddedInMutation)) {
						return { status: 'success' };
					}

					return undefined;
				},
				observeConfig: () => {
					const proseMirrorElement = refs.containerElement?.querySelector('.ProseMirror');

					if (!proseMirrorElement || !(proseMirrorElement instanceof HTMLElement)) {
						return null;
					}

					return {
						target: proseMirrorElement,
						options: {
							childList: true,
						},
					};
				},
			}),
		],
	});
};

const isReferenceSyncBlockAddedInMutation = ({ type, addedNodes }: MutationRecord): boolean =>
	type === 'childList' && [...addedNodes].some(isReferenceSyncBlockNode);

const isReferenceSyncBlockNode = (node?: Node | null): boolean => {
	if (!(node instanceof HTMLElement)) {
		return false;
	}

	return !!node.querySelector('[data-prosemirror-node-name="syncBlock"]');
};
