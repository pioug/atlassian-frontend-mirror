import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DatePluginState } from './types';

export const pluginKey = new PluginKey<DatePluginState>('datePlugin');
