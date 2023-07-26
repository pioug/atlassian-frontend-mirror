import { PluginKey } from 'prosemirror-state';
import type { TextFormattingState } from '../types';

export const pluginKey = new PluginKey<TextFormattingState>('textFormatting');
