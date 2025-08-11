import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { LimitedModePluginState } from '../limitedModePluginType';

export const limitedModePluginKey = new PluginKey('limitedModePlugin');

export const createPlugin = () => {
	let view: EditorView;

	let stateUpdated = false;

	function updateState(view: EditorView) {
		const newState = EditorState.create({
			schema: view.state.schema,
			doc: view.state.doc,
			// remove the state plugin to trigger the view cleanup function
			// @ts-ignore This plugin interaction is expected to be temporary - we can't pass the key via standard inter plugin communication as that would introduce cyclical dependencies
			plugins: view.state.plugins.filter((p) => p.key !== 'blockControls$'), // Filter out the unwanted plugin
		});

		view.updateState(newState);
		stateUpdated = true;
	}

	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		view: (_view) => {
			view = _view;
			return {};
		},
		state: {
			init(config, editorState) {
				if (editorState.doc.childCount > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
					return { documentSizeBreachesThreshold: true };
				}
				return { documentSizeBreachesThreshold: false };
			},
			apply: (tr, _currentPluginState) => {
				if (_currentPluginState.documentSizeBreachesThreshold) {
					if (!stateUpdated) {
						// when the document size reaches the threshold from the state initialisation there is no existing seam to communicate this
						// to the controls plug-in without putting in limited mode specific logic inside the controls plug-in as well.
						// to mitigate this we call the update state here. Which will mean the editor does not have state divergence
						// between when limited mode kicks in on first load versus mid edit session.
						updateState(view);
					}
					return { documentSizeBreachesThreshold: true };
				}
				if (tr.doc.childCount > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
					const customEvent = new CustomEvent('limited-mode-activated');
					document.dispatchEvent(customEvent);
					updateState(view);
					return { documentSizeBreachesThreshold: true };
				}
				return { documentSizeBreachesThreshold: false };
			},
		},
	});
};
