import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { getPanelNodeView } from '../nodeviews/panel';
import { type PanelPlugin, type PanelPluginOptions, pluginKey } from '../panelPluginType';

import { handleCut } from './utils/utils';

export type PanelOptions = {
	color?: string;
	emoji?: string;
	emojiId?: string;
	emojiText?: string;
};

export const createPlugin = (
	dispatch: Dispatch,
	providerFactory: ProviderFactory,
	pluginOptions: PanelPluginOptions,
	api: ExtractInjectionAPI<PanelPlugin> | undefined,
	nodeViewPortalProviderAPI: PortalProviderAPI,
) => {
	const { useLongPressSelection = false } = pluginOptions;
	return new SafePlugin({
		key: pluginKey,
		// @ts-ignore - Workaround for help-center local consumption

		appendTransaction: (transactions, oldState, newState) => {
			// @ts-ignore - Workaround for help-center local consumption

			const tr = transactions.find((tr) => tr.getMeta('uiEvent') === 'cut');
			if (tr) {
				return handleCut(newState, oldState);
			}
		},
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			nodeViews: {
				panel: getPanelNodeView(pluginOptions, api, nodeViewPortalProviderAPI, providerFactory),
			},
			handleClickOn: createSelectionClickHandler(
				['panel'],
				(target) => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
		},
	});
};
