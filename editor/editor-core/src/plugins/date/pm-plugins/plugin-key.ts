import { PluginKey } from 'prosemirror-state';
import { DatePluginState } from './types';

export const pluginKey = new PluginKey<DatePluginState>('datePlugin');
