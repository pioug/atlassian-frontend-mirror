import { PluginKey } from 'prosemirror-state';
import { TextFormattingState } from '../types';

export const pluginKey = new PluginKey<TextFormattingState>('textFormatting');
