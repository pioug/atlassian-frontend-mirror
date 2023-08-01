import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { TextFormattingState } from '../types';

export const pluginKey = new PluginKey<TextFormattingState>('textFormatting');
