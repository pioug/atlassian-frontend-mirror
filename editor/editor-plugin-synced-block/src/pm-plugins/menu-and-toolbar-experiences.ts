import { bind } from 'bind-event-listener';

import {
	ACTION,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
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

const syncedBlockButtonIds = new Set<SyncedBlockButtonId>(SYNCED_BLOCK_BUTTON_TEST_IDS);

let targetEl: HTMLElement | undefined;

type ExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: {
		containerElement?: HTMLElement;
		popupsMountPoint?: HTMLElement;
		wrapperElement?: HTMLElement;
	};
};

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

	const createSourcePrimaryToolbarExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.PRIMARY_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedBlockAddedToDomCheck(refs),
		],
	});

	const createSourceBlockMenuExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.BLOCK_MENU,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedBlockAddedToDomCheck(refs),
		],
	});

	const createSourceQuickInsertMenuExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.SYNCED_BLOCK_CREATE,
		actionSubjectId: ACTION_SUBJECT_ID.QUICK_INSERT,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedBlockAddedToDomCheck(refs),
		],
	});

	const deleteReferenceSyncedBlockExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.REFERENCE_SYNCED_BLOCK_DELETE,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			referenceSyncBlockRemovedFromDomCheck(refs),
		],
	});

	const unsyncReferenceSyncedBlockExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.REFERENCE_SYNCED_BLOCK_UNSYNC,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			referenceSyncBlockRemovedFromDomCheck(refs),
		],
	});

	const unsyncSourceSyncedBlockExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.SYNCED_BLOCK_UNSYNC,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncBlockDeleteConfirmationModalAddedCheck(refs),
		],
	});

	const deleteSourceSyncedBlockExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.SYNCED_BLOCK_DELETE,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncBlockDeleteConfirmationModalAddedCheck(refs),
		],
	});

	const syncedLocationsExperience = new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
		action: ACTION.SYNCED_BLOCK_VIEW_SYNCED_LOCATIONS,
		actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			syncedLocationsDropdownOpenedCheck(refs),
		],
	});

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

			if (button.disabled) {
				return;
			}

			handleButtonClick({
				testId,
				button,
				createSourcePrimaryToolbarExperience,
				createSourceBlockMenuExperience,
				createSourceQuickInsertMenuExperience,
				deleteReferenceSyncedBlockExperience,
				unsyncReferenceSyncedBlockExperience,
				unsyncSourceSyncedBlockExperience,
				deleteSourceSyncedBlockExperience,
				syncedLocationsExperience,
			});
		},
		options: { capture: true },
	});

	const unbindKeydownListener = bind(document, {
		type: 'keydown',
		listener: (event: KeyboardEvent) => {
			if (isEnterKey(event.key)) {
				const typeaheadPopup = popupWithNestedElement(
					getPopupsTarget(),
					'.fabric-editor-typeahead',
				);
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
		options: { capture: true },
	});

	return new SafePlugin({
		key: pluginKey,
		view: (editorView) => {
			editorViewEl = editorView.dom;

			return {
				destroy: () => {
					createSourcePrimaryToolbarExperience.abort({ reason: 'editorDestroyed' });
					createSourceBlockMenuExperience.abort({ reason: 'editorDestroyed' });
					createSourceQuickInsertMenuExperience.abort({ reason: 'editorDestroyed' });
					deleteReferenceSyncedBlockExperience.abort({ reason: 'editorDestroyed' });
					deleteSourceSyncedBlockExperience?.abort({ reason: 'editorDestroyed' });
					unsyncReferenceSyncedBlockExperience?.abort({ reason: 'editorDestroyed' });
					unsyncSourceSyncedBlockExperience?.abort({ reason: 'editorDestroyed' });
					syncedLocationsExperience?.abort({ reason: 'editorDestroyed' });
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	});
};

const isSyncedBlockButtonId = (value: string | undefined): value is SyncedBlockButtonId => {
	return !!value && syncedBlockButtonIds.has(value as SyncedBlockButtonId);
};

type HandleButtonClickProps = {
	button: HTMLButtonElement;
	createSourceBlockMenuExperience: Experience;
	createSourcePrimaryToolbarExperience: Experience;
	createSourceQuickInsertMenuExperience: Experience;
	deleteReferenceSyncedBlockExperience: Experience;
	deleteSourceSyncedBlockExperience?: Experience;
	syncedLocationsExperience?: Experience;
	testId: SyncedBlockButtonId;
	unsyncReferenceSyncedBlockExperience?: Experience;
	unsyncSourceSyncedBlockExperience?: Experience;
};
const handleButtonClick = ({
	testId,
	button,
	createSourcePrimaryToolbarExperience,
	createSourceBlockMenuExperience,
	createSourceQuickInsertMenuExperience,
	deleteReferenceSyncedBlockExperience,
	unsyncReferenceSyncedBlockExperience,
	unsyncSourceSyncedBlockExperience,
	deleteSourceSyncedBlockExperience,
	syncedLocationsExperience,
}: HandleButtonClickProps) => {
	switch (testId) {
		case SYNCED_BLOCK_BUTTON_TEST_ID.primaryToolbarCreate:
			createSourcePrimaryToolbarExperience.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.blockMenuCreate:
			createSourceBlockMenuExperience.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.quickInsertCreate:
			createSourceQuickInsertMenuExperience.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarReferenceDelete:
			deleteReferenceSyncedBlockExperience.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarReferenceUnsync:
			unsyncReferenceSyncedBlockExperience?.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarSourceUnsync:
			unsyncSourceSyncedBlockExperience?.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarSourceDelete:
			deleteSourceSyncedBlockExperience?.start({ forceRestart: true });
			break;
		case SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarSyncedLocationsTrigger:
			// Only track when opening the dropdown
			if (button.getAttribute('aria-pressed') === 'false') {
				syncedLocationsExperience?.start({ forceRestart: true });
			}
			break;
		default: {
			// Exhaustiveness check: if a new SyncedBlockToolbarButtonId is added
			// but not handled above, TypeScript will error here.
			const _exhaustiveCheck: never = testId;
			return _exhaustiveCheck;
		}
	}
};

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

const syncedBlockAddedToDomCheck = (refs: {
	containerElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	wrapperElement?: HTMLElement;
}) =>
	new ExperienceCheckDomMutation({
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

const referenceSyncBlockRemovedFromDomCheck = (refs: {
	containerElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	wrapperElement?: HTMLElement;
}) =>
	new ExperienceCheckDomMutation({
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

const syncBlockDeleteConfirmationModalAddedCheck = (refs: {
	containerElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	wrapperElement?: HTMLElement;
}) =>
	new ExperienceCheckDomMutation({
		onDomMutation: ({ mutations }) => {
			if (mutations.some(isDeleteConfirmationModalAddedInMutation)) {
				return { status: 'success' };
			}
			return undefined;
		},
		observeConfig: () => {
			return {
				target: document.body,
				options: {
					childList: true,
					subtree: true,
				},
			};
		},
	});

const isDeleteConfirmationModalAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isDeleteConfirmationModalWithinNode);
};

const isDeleteConfirmationModalWithinNode = (node?: Node | null) =>
	getNodeQuery('[data-testid="sync-block-delete-confirmation"]')(node);

const syncedLocationsDropdownOpenedCheck = (refs: {
	containerElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	wrapperElement?: HTMLElement;
}) =>
	new ExperienceCheckDomMutation({
		onDomMutation: ({ mutations }) => {
			if (mutations.some(isSyncedLocationsDropdownErrorInMutation)) {
				return { status: 'failure' };
			}
			if (mutations.some(isSyncedLocationsDropdownAddedInMutation)) {
				return { status: 'success' };
			}
			return undefined;
		},
		observeConfig: () => {
			return {
				target: document.body,
				options: {
					childList: true,
					subtree: true,
				},
			};
		},
	});

const isSyncedLocationsDropdownAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isSyncedLocationsDropdownWithinNode);
};

const isSyncedLocationsDropdownErrorInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isSyncedLocationsDropdownErrorWithinNode);
};

const isSyncedLocationsDropdownWithinNode = (node?: Node | null) => {
	return !!(
		getNodeQuery('[data-testid="synced-locations-dropdown-content"]')(node) ||
		getNodeQuery('[data-testid="synced-locations-dropdown-content-no-results"]')(node)
	);
};

const isSyncedLocationsDropdownErrorWithinNode = (node?: Node | null) => {
	return !!getNodeQuery('[data-testid="synced-locations-dropdown-content-error"]')(node);
};
