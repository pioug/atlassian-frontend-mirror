import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { StatusState } from '../types';

export const pluginKeyName = 'statusPlugin';
export const pluginKey = new PluginKey<StatusState>('statusPlugin');
