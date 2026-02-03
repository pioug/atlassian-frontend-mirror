import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const aiSuggestionsPluginKey = new PluginKey('aiSuggestionsPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type AiSuggestionsPluginState = {};

export const createPlugin = () => {
	return new SafePlugin<AiSuggestionsPluginState>({
		key: aiSuggestionsPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(aiSuggestionsPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
