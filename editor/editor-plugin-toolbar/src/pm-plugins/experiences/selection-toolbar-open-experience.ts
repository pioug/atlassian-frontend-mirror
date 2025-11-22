import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	containsPopupWithNestedElement,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const pluginKey = new PluginKey('selectionToolbarOpenExperience');

const START_METHOD = {
	MOUSE_UP: 'mouse-up',
	KEY_DOWN: 'key-down',
};

const ABORT_REASON = {
	SELECTION_CLEARED: 'selection-cleared',
	BLOCK_MENU_OPENED: 'block-menu-opened',
	EDITOR_DESTROYED: 'editor-destroyed',
};

type SelectionToolbarOpenExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: { popupsMountPoint?: HTMLElement };
};

/**
 * This experience tracks when the selection toolbar is opened.
 *
 * Start: When user makes a selection via mouseup or shift+arrow key down
 * Success: When the selection toolbar is added to the DOM within 1000ms of start
 * Failure: When 1000ms passes without the selection toolbar being added to the DOM
 * Abort: When selection transitions to empty or block menu is opened
 */
export const getSelectionToolbarOpenExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: SelectionToolbarOpenExperienceOptions) => {
	let editorView: EditorView | undefined;
	let targetEl: HTMLElement | undefined;
	let shiftArrowKeyPressed = false;
	let mouseDownPos: { x: number; y: number } | undefined;

	const getTarget = () => {
		if (!targetEl) {
			targetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorView?.dom);
		}
		return targetEl;
	};

	const experience = new Experience('selection-toolbar-open', {
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({
				durationMs: 1000,
				onTimeout: () => {
					if (isBlockMenuWithinNode(getTarget())) {
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

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => ({}),
			apply: (_tr, pluginState, oldState, newState) => {
				if (!oldState.selection.empty && isSelectionWithoutTextContent(newState.selection)) {
					experience.abort({ reason: ABORT_REASON.SELECTION_CLEARED });
				}

				if (
					shiftArrowKeyPressed &&
					!newState.selection.eq(oldState.selection) &&
					!isSelectionWithoutTextContent(newState.selection)
				) {
					experience.start({ method: START_METHOD.KEY_DOWN });
					shiftArrowKeyPressed = false;
				}

				return pluginState;
			},
		},
		props: {
			handleDOMEvents: {
				mousedown: (_view: EditorView, e: MouseEvent) => {
					mouseDownPos = { x: e.clientX, y: e.clientY };
				},
				mouseup: (view: EditorView, e: MouseEvent) => {
					if (
						!mouseDownPos ||
						isSelectionWithoutTextContent(view.state.selection) ||
						isSelectionWithinCodeBlock(view.state.selection) ||
						isSelectionToolbarWithinNode(getTarget())
					) {
						return;
					}

					if (e.clientX !== mouseDownPos.x || e.clientY !== mouseDownPos.y) {
						experience.start({ method: START_METHOD.MOUSE_UP });
					}
				},
				dblclick: (view: EditorView, e: MouseEvent) => {
					if (
						isSelectionWithoutTextContent(view.state.selection) ||
						isSelectionWithinCodeBlock(view.state.selection) ||
						isSelectionToolbarWithinNode(getTarget())
					) {
						return;
					}

					experience.start({ method: START_METHOD.MOUSE_UP });
				},
				keydown: (_view: EditorView, { shiftKey, key }: KeyboardEvent) => {
					shiftArrowKeyPressed =
						shiftKey && key.includes('Arrow') && !isSelectionToolbarWithinNode(getTarget());
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
