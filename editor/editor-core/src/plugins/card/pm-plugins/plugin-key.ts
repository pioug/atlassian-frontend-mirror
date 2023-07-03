import { PluginKey } from 'prosemirror-state';
import { CardPluginState } from '../types';

export const pluginKey = new PluginKey<CardPluginState>('cardPlugin');
