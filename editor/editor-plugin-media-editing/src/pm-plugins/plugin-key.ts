import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaEditingPluginState } from './types';

export const stateKey = new PluginKey<MediaEditingPluginState>('mediaEditingPlugin');
