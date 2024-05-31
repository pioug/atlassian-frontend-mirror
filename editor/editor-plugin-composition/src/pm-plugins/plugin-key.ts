import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export interface CompositionPluginState {
	isComposing: boolean;
	zeroWidthSpacePos?: number;
}

export const pluginKey = new PluginKey<CompositionPluginState>('compositionPlugin');
