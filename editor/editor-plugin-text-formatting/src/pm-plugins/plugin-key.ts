import type { TextFormattingState } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey = new PluginKey<TextFormattingState>('textFormatting');
