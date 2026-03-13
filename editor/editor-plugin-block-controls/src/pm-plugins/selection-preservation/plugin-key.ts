import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPreservationPluginState } from './types';

export const selectionPreservationPluginKey: PluginKey<SelectionPreservationPluginState> =
	new PluginKey<SelectionPreservationPluginState>('selectionPreservationPlugin');
