import { bind } from 'bind-event-listener';

import { ACTION, ACTION_SUBJECT_ID, type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getNodeQuery,
	getPopupContainerFromEditorView,
	popupWithNestedElement,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';

const TIMEOUT_DURATION = 30000;

const pluginKey = new PluginKey('syncedBlockMenuAndToolbarExperience');

const SYNCED_BLOCK_BUTTON_TEST_IDS = Object.values(SYNCED_BLOCK_BUTTON_TEST_ID);

type SyncedBlockButtonId = (typeof SYNCED_BLOCK_BUTTON_TEST_IDS)[number];

const syncedBlockButtonIds = new Set<SyncedBlockButtonId>(
	SYNCED_BLOCK_BUTTON_TEST_IDS,
);

let targetEl: HTMLElement | undefined;

type ExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	refs: { containerElement?: HTMLElement, popupsMountPoint?: HTMLElement, wrapperElement?: HTMLElement };
}

export const getMenuAndToolbarExperiencesPlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
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

	const createSourcePrimaryToolbarExperience = getCreateSourcePrimaryToolbarExperience({ refs, dispatchAnalyticsEvent });
	const createSourceBlockMenuExperience = getCreateSourceBlockMenuExperience({ refs, dispatchAnalyticsEvent });
	const createSourceQuickInsertMenuExperience = getCreateSourceQuickInsertMenuExperience({ refs, dispatchAnalyticsEvent });
	const deleteReferenceSyncedBlockExperience = getDeleteReferenceSyncedBlockToolbarExperience({ refs, dispatchAnalyticsEvent })

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
			if (!isSyncedBlockButtonId(testId)) {
				return;
			}

			handleButtonClick({
				testId,
				createSourcePrimaryToolbarExperience,
				createSourceBlockMenuExperience,
				createSourceQuickInsertMenuExperience,
				deleteReferenceSyncedBlockExperience
			});
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
				if (testId === SYNCED_BLOCK_BUTTON_TEST_ID.quickInsertCreate) {
					createSourceQuickInsertMenuExperience.start();
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
					createSourcePrimaryToolbarExperience.abort({ reason: 'editor-destroyed' });
					createSourceBlockMenuExperience.abort({ reason: 'editor-destroyed' });
					createSourceQuickInsertMenuExperience.abort({ reason: 'editor-destroyed' });
					deleteReferenceSyncedBlockExperience.abort({ reason: 'editor-destroyed' })
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	})
}

const getCreateSourcePrimaryToolbarExperience = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	return new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.PRIMARY_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedBlockAddedToDomCheck(refs),
		],
	});
};

const getCreateSourceBlockMenuExperience = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	return new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.BLOCK_MENU,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedBlockAddedToDomCheck(refs),
		],
	});
};

const getCreateSourceQuickInsertMenuExperience = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	return new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.QUICK_INSERT,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION}),
			syncedBlockAddedToDomCheck(refs),
		],
	});
};

const getDeleteReferenceSyncedBlockToolbarExperience = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	return new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.REFERENCE_SYNCED_BLOCK_DELETE,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			referenceSyncBlockRemovedFromDomCheck(refs),
		],
	});
};

const isSyncedBlockButtonId = (value: string | undefined): value is SyncedBlockButtonId => {
	return !!value && syncedBlockButtonIds.has(value as SyncedBlockButtonId);
}

type HandleButtonClickProps = {
	createSourceBlockMenuExperience: Experience;
	createSourcePrimaryToolbarExperience: Experience;
	createSourceQuickInsertMenuExperience: Experience;
	deleteReferenceSyncedBlockExperience: Experience;
	testId: SyncedBlockButtonId;
}
const handleButtonClick = ({
	testId,
	createSourcePrimaryToolbarExperience,
	createSourceBlockMenuExperience,
	createSourceQuickInsertMenuExperience,
	deleteReferenceSyncedBlockExperience
}: HandleButtonClickProps) => {
	switch (testId) {
		case SYNCED_BLOCK_BUTTON_TEST_ID.primaryToolbarCreate:
			createSourcePrimaryToolbarExperience.start();
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.blockMenuCreate:
			createSourceBlockMenuExperience.start();
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.quickInsertCreate:
			createSourceQuickInsertMenuExperience.start();
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarReferenceDelete:
			deleteReferenceSyncedBlockExperience.start();
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

const getTarget = (containerElement: HTMLElement | undefined): HTMLElement | null => {
	if (!targetEl) {
		const element = containerElement?.querySelector('.ProseMirror');

		if (!element || !(element instanceof HTMLElement)) {
			return null;
		}

		targetEl = element;
	}

	return targetEl;
};

const syncedBlockAddedToDomCheck = (
	refs: {
		containerElement?: HTMLElement,
		popupsMountPoint?: HTMLElement,
		wrapperElement?: HTMLElement
	}
) => new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		if (mutations.some(isBodiedSyncBlockAddedInMutation)) {
			return { status: 'success' };
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
});

const isBodiedSyncBlockAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isBodiedSyncBlockWithinNode);
};

const isBodiedSyncBlockWithinNode = (node?: Node | null) =>
	getNodeQuery('[data-prosemirror-node-name="bodiedSyncBlock"]')(node);

const referenceSyncBlockRemovedFromDomCheck = (
	refs: {
		containerElement?: HTMLElement,
		popupsMountPoint?: HTMLElement,
		wrapperElement?: HTMLElement
	}
) => new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		if (mutations.some(isSyncBlockRemovedInMutation)) {
			return { status: 'success' };
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
});

const isSyncBlockRemovedInMutation = ({ type, removedNodes }: MutationRecord) => {
	return type === 'childList' && [...removedNodes].some(isSyncBlockWithinNode);
};

const isSyncBlockWithinNode = (node?: Node | null) =>
	getNodeQuery('[data-prosemirror-node-name="syncBlock"]')(node);
