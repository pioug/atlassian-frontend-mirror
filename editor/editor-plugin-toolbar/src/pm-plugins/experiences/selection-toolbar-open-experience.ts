import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	containsPopupWithNestedElement,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
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
 * Success: When the selection toolbar is added to the DOM within 500ms of start
 * Failure: When 500ms passes without the selection toolbar being added to the DOM
 * Abort: When selection transition to empty or block menu is opened
 */
export const getSelectionToolbarOpenExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: SelectionToolbarOpenExperienceOptions) => {
	let targetEl: HTMLElement | undefined;
	let editorViewEl: HTMLElement | undefined;

	const getTarget = () => {
		if (!targetEl) {
			targetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorViewEl);
		}
		return targetEl;
	};

	const experience = new Experience('selection-toolbar-open', {
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({
				durationMs: 500,
				onTimeout: () => {
					if (isBlockMenuWithinNode(getTarget())) {
						return {
							status: 'abort',
							metadata: { reason: ABORT_REASON.BLOCK_MENU_OPENED },
						};
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
				if (!oldState.selection.empty && newState.selection.empty) {
					experience.abort({ metadata: { reason: ABORT_REASON.SELECTION_CLEARED } });
				}

				return pluginState;
			},
		},
		props: {
			handleDOMEvents: {
				mouseup: (view: EditorView) => {
					if (!view.state.selection.empty && !isSelectionToolbarWithinNode(getTarget())) {
						experience.start({ metadata: { method: START_METHOD.MOUSE_UP } });
					}
				},
				keydown: (_view: EditorView, { shiftKey, key }: KeyboardEvent) => {
					if (shiftKey && key.includes('Arrow') && !isSelectionToolbarWithinNode(getTarget())) {
						experience.start({ metadata: { method: START_METHOD.KEY_DOWN } });
					}
				},
			},
		},
		view: (view: EditorView) => {
			editorViewEl = view.dom;

			return {
				destroy: () => {
					experience.abort({ metadata: { reason: ABORT_REASON.EDITOR_DESTROYED } });
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
