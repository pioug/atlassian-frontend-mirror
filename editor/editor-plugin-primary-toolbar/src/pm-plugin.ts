import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { getToolbarComponents } from './toolbar-configuration';
import type { ComponentRegistry, PrimaryToolbarPluginState } from './types';

export const primaryToolbarPluginKey = new PluginKey<PrimaryToolbarPluginState>('primaryToolbar');

export const createPlugin = (componentRegistry: ComponentRegistry) => {
	return new SafePlugin({
		key: primaryToolbarPluginKey,
		state: {
			init: (): PrimaryToolbarPluginState => ({
				components: getToolbarComponents(componentRegistry),
			}),
			apply: (
				_tr: ReadonlyTransaction,
				pluginState: PrimaryToolbarPluginState,
			): PrimaryToolbarPluginState => pluginState,
		},
	});
};
