import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { MediaPluginState } from './types';

export const stateKey = new PluginKey<MediaPluginState>('mediaPlugin');
