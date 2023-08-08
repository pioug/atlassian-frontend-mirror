import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { TextFormattingState } from '@atlaskit/editor-common/types';

export const pluginKey = new PluginKey<TextFormattingState>('textFormatting');
