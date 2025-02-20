import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { contextualToolbarPluginKey } from './plugin-key';
import type { ContextualToolbarActions, ContextualToolbarState } from './types';

const defaultEditState: ContextualToolbarState = {
	display: 'collapsed',
};

export const contextualToolbarPlugin = () => {
	return new SafePlugin({
		key: contextualToolbarPluginKey,
		state: {
			init() {
				return defaultEditState;
			},
			apply(tr, pluginState: ContextualToolbarState) {
				if (pluginState.display === 'static') {
					return pluginState;
				}

				const action = tr.getMeta(contextualToolbarPluginKey) as
					| ContextualToolbarActions
					| undefined;

				if (action) {
					switch (action.type) {
						case 'expand-toolbar':
							return { display: 'expanded' };
						case 'collapse-toolbar':
							return { display: 'collapsed' };
						default:
							return pluginState;
					}
				}

				return pluginState;
			},
		},
	});
};
