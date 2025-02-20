import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ContextualToolbarState } from './types';

export const contextualToolbarPluginKey = new PluginKey<ContextualToolbarState>(
	'contextualToolbar',
);
