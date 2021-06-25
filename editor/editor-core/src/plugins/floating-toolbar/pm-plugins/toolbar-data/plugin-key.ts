import { PluginKey } from 'prosemirror-state';
import { FloatingToolbarPluginData } from './types';

export const pluginKey = new PluginKey<FloatingToolbarPluginData>(
  'floatingToolbarData',
);
