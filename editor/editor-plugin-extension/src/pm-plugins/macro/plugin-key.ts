import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MacroState } from './types';

export const pluginKey: PluginKey<MacroState> = new PluginKey<MacroState>('macroPlugin');
