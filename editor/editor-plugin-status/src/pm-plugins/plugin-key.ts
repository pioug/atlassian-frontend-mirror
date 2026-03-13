import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { StatusState } from '../types';

export const pluginKey: PluginKey<StatusState> = new PluginKey<StatusState>('statusPlugin');
