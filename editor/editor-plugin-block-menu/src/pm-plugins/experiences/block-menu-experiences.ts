import { bind } from 'bind-event-listener';

import {
	ACTION,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { BLOCK_MENU_ACTION_TEST_ID } from '@atlaskit/editor-common/block-menu';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	getParentDOMAtSelection,
	handleDeleteDomMutation,
	handleMenuOpenDomMutation,
	handleMoveDomMutation,
	isBlockMenuVisible,
	isDragHandleElement,
} from './experience-check-utils';

const TIMEOUT_DURATION = 1000;

const pluginKey = new PluginKey('blockMenuExperiences');

const START_METHOD = {
	DRAG_HANDLE_CLICK: 'dragHandleClick',
	KEYBOARD: 'keyboard',
} as const;

type StartMethod = (typeof START_METHOD)[keyof typeof START_METHOD];

const ABORT_REASON = {
	USER_CANCELED: 'userCanceled',
	EDITOR_DESTROYED: 'editorDestroyed',
} as const;

type ExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: {
		popupsMountPoint?: HTMLElement;
	};
};

export const getBlockMenuExperiencesPlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: ExperienceOptions) => {
	let popupTargetEl: HTMLElement | undefined;
	let editorView: EditorView | undefined;

	const getPopupsTarget = () => {
		if (!popupTargetEl) {
			popupTargetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorView?.dom);
		}
		return popupTargetEl;
	};

	const blockMenuOpenExperience = new Experience(EXPERIENCE_ID.MENU_OPEN, {
		actionSubjectId: ACTION_SUBJECT_ID.BLOCK_MENU,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleMenuOpenDomMutation,
				observeConfig: () => ({
					target: getPopupsTarget(),
					options: { childList: true },
				}),
			}),
		],
	});

	const actionObserveConfig = () => ({
		target: getParentDOMAtSelection(editorView),
		options: { childList: true },
	});

	const blockMoveUpExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.MOVED,
		actionSubjectId: ACTION_SUBJECT_ID.MOVE_UP_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleMoveDomMutation,
				observeConfig: actionObserveConfig,
			}),
		],
	});

	const blockMoveDownExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.MOVED,
		actionSubjectId: ACTION_SUBJECT_ID.MOVE_DOWN_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleMoveDomMutation,
				observeConfig: actionObserveConfig,
			}),
		],
	});

	const blockDeleteExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.DELETED,
		actionSubjectId: ACTION_SUBJECT_ID.DELETE_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleDeleteDomMutation,
				observeConfig: actionObserveConfig,
			}),
		],
	});

	const handleMenuOpened = (method: StartMethod) => {
		// Don't start if block menu is already visible
		if (isBlockMenuVisible(getPopupsTarget())) {
			return;
		}

		blockMenuOpenExperience.start({ method });
	};

	const handleItemActioned = (target: HTMLElement) => {
		const button = target.closest('button[data-testid]');

		if (
			!button ||
			!(button instanceof HTMLButtonElement) ||
			button.disabled ||
			button.getAttribute('aria-disabled') === 'true'
		) {
			return;
		}

		const testId = button.dataset.testid;

		if (!testId) {
			return;
		}

		switch (testId) {
			case BLOCK_MENU_ACTION_TEST_ID.MOVE_UP:
				blockMoveUpExperience.start();
				break;
			case BLOCK_MENU_ACTION_TEST_ID.MOVE_DOWN:
				blockMoveDownExperience.start();
				break;
			case BLOCK_MENU_ACTION_TEST_ID.DELETE:
				blockDeleteExperience.start();
				break;
		}
	};

	const unbindClickListener = bind(document, {
		type: 'click',
		listener: (event: MouseEvent) => {
			const target = event.target;

			if (!(target instanceof HTMLElement)) {
				return;
			}

			if (isDragHandleElement(target)) {
				handleMenuOpened(START_METHOD.DRAG_HANDLE_CLICK);
			} else {
				handleItemActioned(target);
			}
		},
		options: { capture: true },
	});

	const unbindKeydownListener = bind(document, {
		type: 'keydown',
		listener: (event: KeyboardEvent) => {
			const target = event.target;

			if (!(target instanceof HTMLElement)) {
				return;
			}

			// Check if Enter or Space is pressed on a drag handle
			if ((event.key === 'Enter' || event.key === ' ') && isDragHandleElement(target)) {
				handleMenuOpened(START_METHOD.KEYBOARD);
			}

			// Abort on Escape key if block menu is not yet visible
			if (event.key === 'Escape' && !isBlockMenuVisible(getPopupsTarget())) {
				blockMenuOpenExperience.abort({ reason: ABORT_REASON.USER_CANCELED });
			}
		},
		options: { capture: true },
	});

	return new SafePlugin({
		key: pluginKey,
		view: (view) => {
			editorView = view;

			return {
				destroy: () => {
					blockMenuOpenExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					blockMoveUpExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					blockMoveDownExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					blockDeleteExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					editorView = undefined;
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	});
};
