import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';

import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Dispatch<WidthPluginState>): SafePlugin | undefined {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				return {
					width: document.body.offsetWidth,
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
