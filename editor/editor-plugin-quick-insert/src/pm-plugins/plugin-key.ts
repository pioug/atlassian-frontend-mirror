import type { QuickInsertPluginState as CommonQuickInsertPluginState } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type QuickInsertPluginState = CommonQuickInsertPluginState & {
	elementBrowserInitialCategory?: string;
};

export type QuickInsertPluginStateKeys = keyof QuickInsertPluginState;

export const pluginKey: PluginKey<QuickInsertPluginState> = new PluginKey<QuickInsertPluginState>(
	'quickInsertPluginKey',
);
