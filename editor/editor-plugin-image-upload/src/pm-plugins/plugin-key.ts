import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ImageUploadPluginState } from '../types';

export const stateKey: PluginKey<ImageUploadPluginState> = new PluginKey<ImageUploadPluginState>(
	'imageUploadPlugin',
);
