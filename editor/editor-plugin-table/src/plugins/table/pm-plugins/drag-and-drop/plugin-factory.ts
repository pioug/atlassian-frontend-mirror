import { pluginFactory } from '@atlaskit/editor-common/utils';

import { pluginKey } from './plugin-key';
import reducer from './reducer';

const { createPluginState, createCommand } = pluginFactory(pluginKey, reducer);

export { createPluginState, createCommand };
