import { Plugin } from 'prosemirror-state';
import { PMPluginFactory } from '../../../types';
import { pluginKey } from './plugin-factory';

export const createPlugin: PMPluginFactory = ({ dispatch }) =>
  new Plugin({
    key: pluginKey,
  });
