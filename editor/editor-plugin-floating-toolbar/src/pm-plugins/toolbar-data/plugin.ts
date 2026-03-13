import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import type { FloatingToolbarPluginData } from '../../floatingToolbarPluginType';

import { createPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';

export const createPlugin = (dispatch: Dispatch): SafePlugin<FloatingToolbarPluginData> => {
	return new SafePlugin({
		state: createPluginState(dispatch, {}),
		key: pluginKey,
	});
};
