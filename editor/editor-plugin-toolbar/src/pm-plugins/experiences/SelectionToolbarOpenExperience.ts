import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
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
	editorViewDomRef: { current?: HTMLElement };
	popupsMountPointRef: { current?: HTMLElement };
};

/**
 * This experience tracks when the selection toolbar is opened.
 *
 * Start: When user makes a selection via mouseup or shift+arrow key down
 * Success: When the selection toolbar is added to the DOM within 500ms of start
 * Abort: When selection transition to empty or block menu is opened
 */
export default ({
	popupsMountPointRef,
	editorViewDomRef,
}: SelectionToolbarOpenExperienceOptions) => {
	let cachedTarget: HTMLElement | null = null;

	const getTarget = () => {
		if (!cachedTarget) {
			cachedTarget =
				popupsMountPointRef.current ||
				editorViewDomRef.current
					?.closest('.ak-editor-content-area')
					?.querySelector(':scope > [data-testid="plugins-components-wrapper"]') ||
				null;
		}
		return cachedTarget;
	};

	const experience = new Experience('selection-toolbar-open', {
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
		view: () => {
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
	return containsPopupWithNestedTestId(node, 'editor-floating-toolbar');
};

const isBlockMenuWithinNode = (node?: Node | null) => {
	return containsPopupWithNestedTestId(node, 'editor-block-menu');
};

const containsPopupWithNestedTestId = (node?: Node | null, testId?: string) => {
	if (!(node instanceof HTMLElement)) {
		return false;
	}

	// Check if node itself has the popup attribute and contains the element with testId
	if (node.matches('[data-editor-popup="true"]')) {
		return !!node.querySelector(`[data-testid="${testId}"]`);
	}

	// Check if any direct child with popup attribute contains the element with testId
	return !!node.querySelector(`:scope > [data-editor-popup="true"] [data-testid="${testId}"]`);
};
