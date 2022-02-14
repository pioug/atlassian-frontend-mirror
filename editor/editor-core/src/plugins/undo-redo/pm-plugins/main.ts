import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PMPluginFactory } from '../../../types';
import { pluginKey } from './plugin-key';

export const createPlugin: PMPluginFactory = ({ dispatch }) => {
  return new SafePlugin({
    key: pluginKey,
  });
};
