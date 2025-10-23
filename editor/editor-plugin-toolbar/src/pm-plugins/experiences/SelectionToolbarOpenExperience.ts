import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const pluginKey = new PluginKey('selectionToolbarOpenExperience');

type SelectionToolbarOpenExperienceOptions = {
	editorViewDomRef: { current?: HTMLElement };
	popupsMountPointRef: { current?: HTMLElement };
};

export default ({
	popupsMountPointRef,
	editorViewDomRef,
}: SelectionToolbarOpenExperienceOptions) => {
	const getTarget = () =>
		popupsMountPointRef.current || editorViewDomRef.current?.closest('.ak-editor-content-area');

	const experience = new Experience('selection-toolbar-open', {
		checks: [
			new ExperienceCheckTimeout(500),
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
						subtree: true,
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
					experience.abort();
				}

				return pluginState;
			},
		},
		props: {
			handleDOMEvents: {
				mouseup: (view: EditorView) => {
					if (!view.state.selection.empty) {
						experience.start();
					}
				},
				keydown: (_view: EditorView, { shiftKey, key }: KeyboardEvent) => {
					if (shiftKey && key.includes('Arrow') && !isSelectionToolbarWithinNode(getTarget())) {
						experience.start();
					}
				},
			},
		},
		view: () => {
			return {
				destroy: () => {
					experience.abort();
				},
			};
		},
	});
};

const isSelectionToolbarAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && Array.from(addedNodes).some(isSelectionToolbarWithinNode);
};

const isSelectionToolbarWithinNode = (node?: Node | null) => {
	return (
		node instanceof HTMLElement && !!node.querySelector('[data-testid="editor-floating-toolbar"]')
	);
};
