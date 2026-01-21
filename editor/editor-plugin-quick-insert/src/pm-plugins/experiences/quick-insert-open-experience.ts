import { ACTION_SUBJECT_ID, type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	containsPopupWithNestedElement,
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const pluginKey = new PluginKey('quickInsertOpenExperience');

const START_METHOD = {
	QUICK_INSERT_BUTTON: 'quick-insert-button',
	TYPEAHEAD: 'typeahead',
};

const ABORT_REASON = {
	USER_CANCELED: 'user-canceled',
	EDITOR_DESTROYED: 'editor-destroyed',
};

type QuickInsertOpenExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: { popupsMountPoint?: HTMLElement; wrapperElement?: HTMLElement };
};

/**
 * This experience tracks when the quick insert is opened.
 *
 * Start: When user types `/` to open quick insert or clicks the quick insert button
 * Success: When the quick insert menu is added to the DOM within 500ms of start
 * Failure: When 500ms passes without the quick insert menu being added to the DOM
 * Abort: When user presses escape or backspace
 */
export const getQuickInsertOpenExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: QuickInsertOpenExperienceOptions) => {
	let targetEl: HTMLElement | undefined;
	let editorViewEl: HTMLElement | undefined;

	const getTarget = () => {
		if (!targetEl) {
			targetEl =
				refs.popupsMountPoint ||
				refs.wrapperElement ||
				getPopupContainerFromEditorView(editorViewEl);
		}
		return targetEl;
	};

	const experience = new Experience(EXPERIENCE_ID.MENU_OPEN, {
		actionSubjectId: ACTION_SUBJECT_ID.QUICK_INSERT,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 500 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					if (mutations.some(isQuickInsertMenuAddedInMutation)) {
						return { status: 'success' };
					}
				},
				observeConfig: () => ({
					target: getTarget(),
					options: {
						childList: true,
					},
				}),
			}),
		],
	});

	return new SafePlugin({
		key: pluginKey,
		props: {
			handleDOMEvents: {
				click: (_view, event) => {
					if (isTargetQuickInsertButton(event.target)) {
						experience.start({ method: START_METHOD.QUICK_INSERT_BUTTON });
					}
				},
				beforeinput: (view, event) => {
					if (isQuickInsertTrigger(event) && isSelectionWhichSupportsTypeahead(view)) {
						experience.start({ method: START_METHOD.TYPEAHEAD });
					}
				},
				keydown: (_view, event) => {
					if (isCancelKey(event.key) && !isQuickInsertMenuWithinNode(getTarget())) {
						experience.abort({ reason: ABORT_REASON.USER_CANCELED });
					}
				},
			},
		},
		view: (editorView: EditorView) => {
			editorViewEl = editorView.dom;

			return {
				destroy: () => {
					experience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
				},
			};
		},
	});
};

const isQuickInsertTrigger = ({ inputType, data }: InputEvent) => {
	return inputType === 'insertText' && data === '/';
};

const isSelectionWhichSupportsTypeahead = ({ state }: EditorView) => {
	const { from, $from } = state.selection;
	if ($from.parent.type.name === 'codeBlock') {
		return false;
	}

	if ($from.marks().some((mark) => mark.type.name === 'code')) {
		return false;
	}

	if (from === 0) {
		return true;
	}

	const nodeBefore = state.doc.resolve(from).nodeBefore;
	if (!nodeBefore) {
		return true;
	}

	const charBefore = nodeBefore.textContent?.slice(-1) || '';
	return charBefore.trim().length === 0;
};

const isCancelKey = (key: string) => {
	return key === 'Escape' || key === 'Backspace';
};

const isTargetQuickInsertButton = (target?: EventTarget | null) => {
	return (
		target instanceof HTMLElement &&
		(target.dataset.testid === 'editor-quick-insert-button' ||
			!!target.closest('[data-testid="editor-quick-insert-button"]'))
	);
};

const isQuickInsertMenuAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isQuickInsertMenuWithinNode);
};

const isQuickInsertMenuWithinNode = (node?: Node | null) => {
	return containsPopupWithNestedElement(node, '.fabric-editor-typeahead');
};
