import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ImageUploadPluginState } from '../types';

export const stateKey = new PluginKey<ImageUploadPluginState>(
  'imageUploadPlugin',
);
