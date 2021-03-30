import { PluginKey } from 'prosemirror-state';
import { TypeAheadPluginState } from '../types';

export const pluginKey = new PluginKey<TypeAheadPluginState>('typeAheadPlugin');
