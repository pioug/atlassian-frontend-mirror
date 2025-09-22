import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import { akEditorDefaultLayoutWidth, VIEWPORT_SIZES } from '@atlaskit/editor-shared-styles/consts';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Dispatch<WidthPluginState>): SafePlugin | undefined {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				if (editorExperiment('platform_editor_stop_width_reflows', true)) {
					return {
						// Optimise for default laptop MDPI width - this will update with the resize observer
						width: VIEWPORT_SIZES.laptopMDPI.width,
						// Use the default width - if full width or small it will update with resize observer
						lineLength: akEditorDefaultLayoutWidth,
					};
				} else {
					return {
						width: document.body.offsetWidth,
					};
				}
			},
			apply(tr, pluginState: WidthPluginState) {
				const meta: WidthPluginState | undefined = tr.getMeta(pluginKey);

				if (!meta) {
					return pluginState;
				}

				const newPluginState: WidthPluginState = editorExperiment(
					'platform_editor_stop_width_reflows',
					true,
				)
					? {
							width: meta.width ?? pluginState?.width,
							lineLength: meta.lineLength ?? pluginState?.lineLength,
						}
					: {
							...pluginState,
							...meta,
						};

				if (
					newPluginState &&
					(pluginState.width !== newPluginState.width ||
						pluginState.lineLength !== newPluginState.lineLength)
				) {
					dispatch(pluginKey, newPluginState);
					return newPluginState;
				}
				return pluginState;
			},
		},
	});
}
