import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { TypeAheadPluginState } from '../types';

export const pluginKey = new PluginKey<TypeAheadPluginState>('typeAheadPlugin');
