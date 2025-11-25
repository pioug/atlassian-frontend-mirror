import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type HyperlinkToolbarItemsState = {
	/**
	 * If you are mounting your own items to the hyperlink toolbar you may decide
	 * you want to replace the hyperlink analytics with your own
	 * Defaults to false.
	 */
	skipAnalytics?: boolean;
};

export const toolbarKey = new PluginKey<HyperlinkToolbarItemsState | undefined>(
	'hyperlinkToolbarItems',
);

export const toolbarButtonsPlugin = (initialState?: { skipAnalytics: boolean }) => {
	return new SafePlugin<HyperlinkToolbarItemsState | undefined>({
		key: toolbarKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init: (_, __) => {
				return initialState;
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply: (tr, pluginState) => {
				const metaState = tr.getMeta(toolbarKey);
				if (metaState) {
					return metaState;
				}
				return pluginState;
			},
		},
	});
};
