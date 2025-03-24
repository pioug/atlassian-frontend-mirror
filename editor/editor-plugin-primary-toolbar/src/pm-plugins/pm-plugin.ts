import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ComponentRegistry, PrimaryToolbarPluginState } from '../primaryToolbarPluginType';

import { getToolbarComponents } from './toolbar-configuration';

export const primaryToolbarPluginKey = new PluginKey<PrimaryToolbarPluginState>('primaryToolbar');

type PluginConfig = {
	componentRegistry: ComponentRegistry;
	contextualFormattingEnabled?: boolean;
};

export const createPlugin = ({ componentRegistry, contextualFormattingEnabled }: PluginConfig) => {
	return new SafePlugin({
		key: primaryToolbarPluginKey,
		state: {
			init: (_config: Object, editorState: EditorState): PrimaryToolbarPluginState => ({
				components: getToolbarComponents({
					componentRegistry,
					editorState,
					contextualFormattingEnabled,
				}),
			}),
			apply: (
				_tr: ReadonlyTransaction,
				pluginState: PrimaryToolbarPluginState,
			): PrimaryToolbarPluginState => pluginState,
		},
	});
};
