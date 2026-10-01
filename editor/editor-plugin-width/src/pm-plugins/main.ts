import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Dispatch<WidthPluginState>): SafePlugin | undefined {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				return {
					// The init value of width is a placeholder, it cannot be 0,
					// we use `window.outerWidth` window dimension,
					// Which will not cause reflow at the start.
					width: isExperimentEnabled('platform_editor_reduce_forced_layout')
						? window.outerWidth
						: document.body.offsetWidth,
				};
			},
			apply(tr, pluginState: WidthPluginState) {
				const meta: WidthPluginState | undefined = tr.getMeta(pluginKey);

				if (!meta) {
					return pluginState;
				}

				const newPluginState: WidthPluginState = {
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
