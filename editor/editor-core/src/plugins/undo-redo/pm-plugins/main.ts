import { Plugin } from 'prosemirror-state';
import { PMPluginFactory } from '../../../types';
import { pluginKey } from './plugin-key';

export const createPlugin: PMPluginFactory = ({ dispatch }) => {
  return new Plugin({
    key: pluginKey,
  });
};
