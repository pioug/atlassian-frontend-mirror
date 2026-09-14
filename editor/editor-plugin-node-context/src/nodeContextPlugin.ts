import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { resolveNodeContextAtCoords } from './resolve-node-context-at-coords';
import { resolveNodeContextsInViewportRect } from './resolve-node-contexts-in-viewport-rect';
import type { NodeContextPlugin } from './nodeContextPluginType';
import { createPlugin } from './pm-plugins/main';

export const nodeContextPlugin: NodeContextPlugin = () => {
	let editorView: EditorView | undefined;

	return {
		name: 'nodeContext',
		actions: {
			getNodeContextAtCoords: (point) =>
				editorView ? resolveNodeContextAtCoords(editorView, point) : undefined,
			getNodeContextsInViewportRect: (rect) =>
				editorView ? resolveNodeContextsInViewportRect(editorView, rect) : [],
		},
		pmPlugins() {
			return [
				{
					name: 'nodeContextPlugin',
					plugin: () =>
						createPlugin({
							onEditorViewCreated: (view) => {
								editorView = view;
							},
							onEditorViewDestroyed: (view) => {
								if (editorView === view) {
									editorView = undefined;
								}
							},
						}),
				},
			];
		},
	};
};
