import { bind } from 'bind-event-listener';

import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
	popupWithNestedElement,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { EXPERIENCE_ABORT_REASON, type ExperienceOptions, type ProviderExperienceOptions } from '../../types'
import { getAddedResourceIds, getTarget } from '../utils/experience-tracking-utils';

const pluginKey = new PluginKey('createSourceSyncBlockExperience');

const START_METHOD = {
	BLOCK_MENU: 'block-menu',
	PINNED_TOOLBAR: 'pinned-toolbar',
	QUICK_INSERT: 'quick-insert',
}

const SYNCED_BLOCK_CREATE_BUTTON_IDS = [
	'create-synced-block-toolbar-btn',
	'create-synced-block-block-menu-btn',
	'create-synced-block-quick-insert-btn',
] as const;

type SyncedBlockCreateButtonId = (typeof SYNCED_BLOCK_CREATE_BUTTON_IDS)[number];

const syncedBlockCreateButtonIds = new Set<SyncedBlockCreateButtonId>(
	SYNCED_BLOCK_CREATE_BUTTON_IDS,
);

/**
 * This experience tracks when a source sync block is inserted.
 *
 * Start: When user inserts a sync block via block menu, quick insert or pinned toolbar
 * Success: When the sync block is added to the DOM within 3000ms of start
 * Failure: When 3000ms passes without the source sync block being added to the DOM
 */
export const getCreateSourceExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
	syncBlockStore,
}: ProviderExperienceOptions) => {
	let popupsTargetEl: HTMLElement | undefined;
	let editorViewEl: HTMLElement | undefined;

	const getPopupsTarget = () => {
		if (!popupsTargetEl) {
			popupsTargetEl =
				refs.popupsMountPoint ||
				refs.wrapperElement ||
				getPopupContainerFromEditorView(editorViewEl);
		}
		return popupsTargetEl;
	};

	const experience = getCreateSourceExperience({ refs, dispatchAnalyticsEvent });
	syncBlockStore.sourceManager.setCreateExperience(experience);

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
			if (!isSyncedBlockCreateButtonId(testId)) {
				return;
			}

			handleButtonClick(testId, experience);
		}
	});

	const unbindKeydownListener = bind(document, {
		type: 'keydown',
		listener: (event: KeyboardEvent) => {
			if (isEnterKey(event.key)) {
				const typeaheadPopup = popupWithNestedElement(getPopupsTarget(),'.fabric-editor-typeahead');
				if (!typeaheadPopup || !(typeaheadPopup instanceof HTMLElement)) {
					return;
				}

				const firstItem = typeaheadPopup.querySelector('[role="option"]');
				if (!firstItem || !(firstItem instanceof HTMLElement)) {
					return;
				}

				const testId = firstItem.dataset.testid;
				if (testId === 'create-synced-block-quick-insert-btn') {
					experience.start({ method: START_METHOD.QUICK_INSERT })
				}
			}
		},
		options: { capture: true }
	})

	return new SafePlugin({
		key: pluginKey,
		view: (editorView) => {
			editorViewEl = editorView.dom;

			return {
				destroy: () => {
					experience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	})
}

const getCreateSourceExperience = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 3000 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					const createdResourceIds = getAddedResourceIds(mutations, '[data-prosemirror-node-name="bodiedSyncBlock"]');
					if (createdResourceIds.length > 0) {
						return {
							status: 'success',
							metadata: { createdResourceIds }
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

const isSyncedBlockCreateButtonId = (value: string | undefined): value is SyncedBlockCreateButtonId => {
	return !!value && syncedBlockCreateButtonIds.has(value as SyncedBlockCreateButtonId);
}

const handleButtonClick = (
	testId: SyncedBlockCreateButtonId,
	experience: Experience,
) => {
	switch (testId) {
		case 'create-synced-block-toolbar-btn':
			experience.start({ method: START_METHOD.PINNED_TOOLBAR });
			break;
		case 'create-synced-block-block-menu-btn':
			experience.start({ method: START_METHOD.BLOCK_MENU });
			break;
		case 'create-synced-block-quick-insert-btn':
			experience.start({ method: START_METHOD.QUICK_INSERT });
			break;
		default: {
			// Exhaustiveness check: if a new SyncedBlockToolbarButtonId is added
			// but not handled above, TypeScript will error here.
			const _exhaustiveCheck: never = testId;
			return _exhaustiveCheck;
		}
	}
}

const isEnterKey = (key: string) => {
	return key === 'Enter';
};
