import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import reducer from './reducer';

const pluginKey = new PluginKey('mediaPixelResizingPlugin');

const { createPluginState, createCommand, getPluginState } = pluginFactory(pluginKey, reducer, {
	onSelectionChanged() {
		return {
			isPixelEditorOpen: false,
		};
	},
});

export const createPlugin = ({ dispatch }: PMPluginFactoryParams) => {
	return new SafePlugin({
		state: createPluginState(dispatch, { isPixelEditorOpen: false }),
		key: pluginKey,
	});
};

export { createCommand, getPluginState };
