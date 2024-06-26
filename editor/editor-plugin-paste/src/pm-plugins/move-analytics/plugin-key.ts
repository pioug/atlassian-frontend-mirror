import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MoveAnalyticsPluginState } from './types';

export const pluginKey = new PluginKey<MoveAnalyticsPluginState>('moveAnalyticsPlugin');
