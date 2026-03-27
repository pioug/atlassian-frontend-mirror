import { bind } from 'bind-event-listener';

import { ACTION, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	BLOCK_MENU_ACTION_TEST_ID,
	BLOCK_MENU_TEST_ID,
	EXTENSION_MENU_ITEM_TEST_ID,
} from '@atlaskit/editor-common/block-menu';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckPopupMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
	getSelectionAncestorDOM,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	handleDeleteDomMutation,
	handleMoveDomMutation,
	handleTransformDomMutation,
	isBlockMenuVisible,
	isDragHandleElement,
} from './experience-check-utils';

const TIMEOUT_DURATION = 1000;

const PORTAL_TEST_ID = {
	LINK_COPIED_TO_CLIPBOARD: 'link-copied-to-clipboard',
	SYNC_BLOCK_DELETE_CONFIRMATION: 'sync-block-delete-confirmation',
} as const;

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
}: ExperienceOptions): SafePlugin => {
	let popupTargetEl: HTMLElement | undefined;
	let editorView: EditorView | undefined;

	const getPopupsTarget = () => {
		if (!popupTargetEl) {
			popupTargetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorView?.dom);
		}
		return popupTargetEl;
	};

	const getEditorDom = (): HTMLElement | null => {
		if (editorView?.dom instanceof HTMLElement) {
			return editorView.dom;
		}
		return null;
	};

	const blockMenuOpenExperience = new Experience(EXPERIENCE_ID.MENU_OPEN, {
		actionSubjectId: ACTION_SUBJECT_ID.BLOCK_MENU,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckPopupMutation({
				nestedElementQuery: `[data-testid="${BLOCK_MENU_TEST_ID}"]`,
				getTarget: getPopupsTarget,
				type: 'editorContent',
			}),
		],
	});

	const observeConfigs = () => {
		const narrowTarget = getSelectionAncestorDOM(editorView);
		const editorDom = getEditorDom();
		return [
			...(narrowTarget
				? [
						{
							target: narrowTarget,
							options: { childList: true, subtree: true },
						},
					]
				: []),
			...(editorDom ? [{ target: editorDom, options: { childList: true } }] : []),
		];
	};

	const blockMoveUpExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.MOVED,
		actionSubjectId: ACTION_SUBJECT_ID.MOVE_UP_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleMoveDomMutation,
				observeConfig: observeConfigs,
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
				observeConfig: observeConfigs,
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
				observeConfig: observeConfigs,
			}),
			new ExperienceCheckPopupMutation({
				nestedElementQuery: `[data-testid="${PORTAL_TEST_ID.SYNC_BLOCK_DELETE_CONFIRMATION}"]`,
				type: 'portalRoot',
			}),
		],
	});

	const blockTransformExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.TRANSFORMED,
		actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckDomMutation({
				onDomMutation: handleTransformDomMutation,
				observeConfig: observeConfigs,
			}),
		],
	});

	const blockCopyLinkExperience = new Experience(EXPERIENCE_ID.MENU_ACTION, {
		action: ACTION.COPIED,
		actionSubjectId: ACTION_SUBJECT_ID.COPY_LINK_TO_BLOCK,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
			new ExperienceCheckPopupMutation({
				nestedElementQuery: `[data-testid="${PORTAL_TEST_ID.LINK_COPIED_TO_CLIPBOARD}"]`,
				type: 'portalRoot',
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

	const handleTransformActioned = (target: HTMLElement): boolean => {
		if (
			!target.closest('[data-testid="editor-turn-into-menu--content"]') ||
			// Skip experience tracking when the clicked item is an extension menu item
			// (e.g. Jira macro, etc.) - they don't perform block transforms
			target.closest(`[data-testid="${EXTENSION_MENU_ITEM_TEST_ID}"]`)
		) {
			return false;
		}

		const turnIntoButton = target.closest('button');
		if (
			turnIntoButton &&
			turnIntoButton instanceof HTMLElement &&
			!turnIntoButton.hasAttribute('disabled') &&
			turnIntoButton.getAttribute('aria-disabled') !== 'true'
		) {
			blockTransformExperience.start();
		}

		return true;
	};

	const handleItemActioned = (target: HTMLElement) => {
		if (handleTransformActioned(target)) {
			return;
		}

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
			case BLOCK_MENU_ACTION_TEST_ID.COPY_LINK:
				blockCopyLinkExperience.start();
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
					blockTransformExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					blockCopyLinkExperience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
					editorView = undefined;
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	});
};
