import { PluginKey } from 'prosemirror-state';
import { LayoutState } from './types';

export const pluginKey = new PluginKey<LayoutState>('layout');
