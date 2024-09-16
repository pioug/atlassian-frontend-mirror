import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { getPanelNodeView } from '../nodeviews/panel';
import { type PanelPlugin, type PanelPluginOptions, pluginKey } from '../types';
import { handleCut } from '../utils';

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
) => {
	const { useLongPressSelection = false } = pluginOptions;
	return new SafePlugin({
		key: pluginKey,
		appendTransaction: (transactions, oldState, newState) => {
			const tr = transactions.find((tr) => tr.getMeta('uiEvent') === 'cut');
			if (tr) {
				return handleCut(newState, oldState);
			}
		},
		props: {
			nodeViews: {
				panel: getPanelNodeView(pluginOptions, api, providerFactory),
			},
			handleClickOn: createSelectionClickHandler(
				['panel'],
				(target) => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
		},
	});
};
