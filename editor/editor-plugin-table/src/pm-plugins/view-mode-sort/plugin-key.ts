import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ViewModeSortPluginState } from './types';

export const tableViewModeSortPluginKey = new PluginKey<ViewModeSortPluginState>(
	'tableViewModeSortPlugin',
);
