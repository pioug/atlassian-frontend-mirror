import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { contextualToolbarPluginKey } from './plugin-key';
import type { ContextualToolbarActions, ContextualToolbarState } from './types';

const defaultEditState: ContextualToolbarState = {
	isCollapsed: true,
};

export const contextualToolbarPlugin = () => {
	return new SafePlugin({
		key: contextualToolbarPluginKey,
		state: {
			init() {
				return defaultEditState;
			},
			apply(tr, pluginState: ContextualToolbarState) {
				const action = tr.getMeta(contextualToolbarPluginKey) as
					| ContextualToolbarActions
					| undefined;

				if (action) {
					switch (action.type) {
						case 'expand-toolbar':
							return { isCollapsed: false };
						case 'collapse-toolbar':
							return { isCollapsed: true };
						default:
							return pluginState;
					}
				}

				return pluginState;
			},
		},
	});
};
