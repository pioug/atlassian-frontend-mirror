import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { getToolbarComponents } from './toolbar-configuration';
import type { ComponentRegistry, PrimaryToolbarPluginState } from './types';

export const primaryToolbarPluginKey = new PluginKey<PrimaryToolbarPluginState>('primaryToolbar');

export const createPlugin = (componentRegistry: ComponentRegistry) => {
	return new SafePlugin({
		key: primaryToolbarPluginKey,
		state: {
			init: (_config: {}, editorState: EditorState): PrimaryToolbarPluginState => ({
				components: getToolbarComponents(componentRegistry, editorState),
			}),
			apply: (
				_tr: ReadonlyTransaction,
				pluginState: PrimaryToolbarPluginState,
			): PrimaryToolbarPluginState => pluginState,
		},
	});
};
