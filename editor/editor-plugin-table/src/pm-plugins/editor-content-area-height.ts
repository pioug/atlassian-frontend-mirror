import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

type EditorContentAreaHeightPluginState = {
	height: number;
};

export const pluginKey = new PluginKey<EditorContentAreaHeightPluginState>(
	'editorContentAreaHeightPlugin',
);

export const INITIAL_STATIC_VIEWPORT_HEIGHT = 1200;
export const EDITOR_CONTENT_AREA_REGION_CLASSNAME = '.ak-editor-content-area-region';

const createPlugin = () =>
	new SafePlugin({
		key: pluginKey,
		state: {
			init() {
				return {
					height: INITIAL_STATIC_VIEWPORT_HEIGHT,
				};
			},
			apply(tr, pluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					return { ...pluginState, ...meta };
				}

				return pluginState;
			},
		},
		view: (view) => {
			const editorContentAreaEl = view.dom.closest(EDITOR_CONTENT_AREA_REGION_CLASSNAME);
			let resizeObserver: ResizeObserver;
			if (editorContentAreaEl) {
				resizeObserver = new ResizeObserver((entries) => {
					for (const entry of entries) {
						const height = entry.contentRect.height;
						const tr = view.state.tr.setMeta(pluginKey, { height, isObserved: true });
						view.dispatch(tr);
					}
				});
				resizeObserver.observe(editorContentAreaEl);
			}
			return {
				destroy() {
					resizeObserver?.disconnect();
				},
			};
		},
	});

export { createPlugin };
