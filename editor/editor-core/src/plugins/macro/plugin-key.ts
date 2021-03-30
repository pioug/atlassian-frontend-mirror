import { PluginKey } from 'prosemirror-state';
import { MacroState } from './types';

export const pluginKey = new PluginKey<MacroState>('macroPlugin');
