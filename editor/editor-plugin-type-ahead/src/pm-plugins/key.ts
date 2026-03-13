import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { TypeAheadPluginState } from '../types';

export const pluginKey: PluginKey<TypeAheadPluginState> = new PluginKey<TypeAheadPluginState>(
	'typeAheadPlugin',
);
