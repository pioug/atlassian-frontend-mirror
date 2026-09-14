import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	containsPopupWithNestedElement,
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { UserIntent } from '@atlaskit/editor-plugin-user-intent/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	hasSelectionChanged,
	isPlainShiftArrowKey,
	isSelectionToolbarSuppressedByUserIntent,
} from '../../ui/SelectionToolbar/visibility';

const pluginKey = new PluginKey('selectionToolbarOpenExperience');

const START_METHOD = {
	MOUSE_UP: 'mouseUp',
	KEY_DOWN: 'keyDown',
};

const ABORT_REASON = {
	SELECTION_CLEARED: 'selectionCleared',
	BLOCK_MENU_OPENED: 'blockMenuOpened',
	EDITOR_DESTROYED: 'editorDestroyed',
	USER_INTENT_SUPPRESSED: 'userIntentSuppressed',
};

type SelectionToolbarOpenExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	getCurrentUserIntent?: () => UserIntent | undefined;
	refs: { popupsMountPoint?: HTMLElement };
};

/**
 * This experience tracks when the selection toolbar is opened.
 *
 * Start: When user makes a selection via mouseup or shift+arrow key down
 * Success: When the selection toolbar is added to the DOM within 1000ms of start
 * Failure: When 1000ms passes without the selection toolbar being added to the DOM
 * Abort: When selection transitions to empty or block menu is opened
 *
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/6262117789/Experience+tracking+Selection+toolbar+open
 */
export const getSelectionToolbarOpenExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
	getCurrentUserIntent,
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
}: SelectionToolbarOpenExperienceOptions): SafePlugin<{}> => {
	const isIntentFixEnabled = fg('platform_editor_toolbar_intent_fix');
	let editorView: EditorView | undefined;
	let targetEl: HTMLElement | undefined;
	let shiftArrowKeyPressed = false;
	let mouseDownPos: { x: number; y: number } | undefined;
	let mouseDownSelection: Selection | undefined;

	const getTarget = () => {
		if (!targetEl) {
			targetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorView?.dom);
		}
		return targetEl;
	};

	const isCurrentUserIntentSuppressingToolbar = (selection?: Selection) => {
		if (!selection) {
			return false;
		}

		const isCellSelection = !selection.empty && '$anchorCell' in selection;
		return isSelectionToolbarSuppressedByUserIntent(getCurrentUserIntent?.(), isCellSelection);
	};

	const experience = new Experience(EXPERIENCE_ID.TOOLBAR_OPEN, {
		actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({
				durationMs: 1000,
				onTimeout: () => {
					if (
						isIntentFixEnabled &&
						isCurrentUserIntentSuppressingToolbar(editorView?.state.selection)
					) {
						return { status: 'abort', reason: ABORT_REASON.USER_INTENT_SUPPRESSED };
					} else if (isBlockMenuWithinNode(getTarget())) {
						return { status: 'abort', reason: ABORT_REASON.BLOCK_MENU_OPENED };
					} else if (isSelectionWithoutTextContent(editorView?.state.selection)) {
						return { status: 'abort', reason: ABORT_REASON.SELECTION_CLEARED };
					}
				},
			}),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					if (mutations.some(isSelectionToolbarAddedInMutation)) {
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

	const shouldSkipExperienceStart = (selection: Selection) => {
		if (
			isSelectionWithoutTextContent(selection) ||
			isSelectionWithinCodeBlock(selection) ||
			(isIntentFixEnabled && isCurrentUserIntentSuppressingToolbar(selection))
		) {
			return true;
		}

		const target = getTarget();

		if (!target) {
			// when target is not found, skip the experience start
			return true;
		}
		return isSelectionToolbarWithinNode(target) || isBlockMenuWithinNode(target);
	};

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => ({}),
			apply: (_tr, pluginState, oldState, newState) => {
				if (!oldState.selection.empty && isSelectionWithoutTextContent(newState.selection)) {
					experience.abort({ reason: ABORT_REASON.SELECTION_CLEARED });
				}

				const shouldStartExperience =
					shiftArrowKeyPressed &&
					!newState.selection.eq(oldState.selection) &&
					!shouldSkipExperienceStart(newState.selection);
				if (shouldStartExperience) {
					experience.start({ method: START_METHOD.KEY_DOWN });
					shiftArrowKeyPressed = false;
				}

				return pluginState;
			},
		},
		props: {
			handleDOMEvents: {
				mousedown: (view: EditorView, e: MouseEvent) => {
					mouseDownPos = { x: e.clientX, y: e.clientY };
					if (isIntentFixEnabled) {
						mouseDownSelection = view.state.selection;
					}
				},
				mouseup: (view: EditorView, e: MouseEvent) => {
					const initialMouseDownPos = mouseDownPos;
					const selectionChanged = hasSelectionChanged(mouseDownSelection, view.state.selection);

					if (isIntentFixEnabled) {
						mouseDownPos = undefined;
						mouseDownSelection = undefined;
					}

					if (!initialMouseDownPos || shouldSkipExperienceStart(view.state.selection)) {
						return;
					}

					const mouseCoordinatesChanged =
						e.clientX !== initialMouseDownPos.x || e.clientY !== initialMouseDownPos.y;
					if (mouseCoordinatesChanged && (!isIntentFixEnabled || selectionChanged)) {
						experience.start({ method: START_METHOD.MOUSE_UP });
					}
				},
				dblclick: (view: EditorView) => {
					if (shouldSkipExperienceStart(view.state.selection)) {
						return;
					}

					experience.start({ method: START_METHOD.MOUSE_UP });
				},
				keydown: (_view: EditorView, event: KeyboardEvent) => {
					shiftArrowKeyPressed =
						(isIntentFixEnabled
							? isPlainShiftArrowKey(event)
							: event.shiftKey && event.key.includes('Arrow')) &&
						!isSelectionToolbarWithinNode(getTarget());
				},
				keyup: () => {
					shiftArrowKeyPressed = false;
				},
			},
		},
		view: (view: EditorView) => {
			editorView = view;

			return {
				destroy: () => {
					experience.abort({ reason: ABORT_REASON.EDITOR_DESTROYED });
				},
			};
		},
	});
};

const isSelectionToolbarAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isSelectionToolbarWithinNode);
};

const isSelectionToolbarWithinNode = (node?: Node | null) => {
	return containsPopupWithNestedElement(node, '[data-testid="editor-floating-toolbar"]');
};

const isBlockMenuWithinNode = (node?: Node | null) => {
	return containsPopupWithNestedElement(node, '[data-testid="editor-block-menu"]');
};

const isSelectionWithoutTextContent = (selection?: Selection) => {
	if (!selection || selection.empty) {
		return true;
	}

	let hasText = false;
	selection.$from.doc.nodesBetween(selection.from, selection.to, (node) => {
		if (hasText) {
			return false;
		}
		if (node.isText && node.text && node.text.length > 0) {
			hasText = true;
			return false;
		}
		return true;
	});

	return !hasText;
};

const isSelectionWithinCodeBlock = (selection: Selection) => {
	const { $from, $to } = selection;
	return $from.sameParent($to) && $from.parent.type.name === 'codeBlock';
};
