import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPreservationPluginState } from './types';

export const selectionPreservationPluginKey = new PluginKey<SelectionPreservationPluginState>(
	'selectionPreservationPlugin',
);
