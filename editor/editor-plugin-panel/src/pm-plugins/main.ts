import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getPanelNodeView } from '../nodeviews/panel';
import { pluginKey } from '../panelPluginType';
import type { PanelPlugin, PanelPluginOptions } from '../panelPluginType';

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
): SafePlugin => {
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
				panel: getPanelNodeView(pluginOptions, api, nodeViewPortalProviderAPI, providerFactory),
				...(expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
					? {
							panel_c1: getPanelNodeView(
								pluginOptions,
								api,
								nodeViewPortalProviderAPI,
								providerFactory,
							),
						}
					: {}),
			},
			handleClickOn: createSelectionClickHandler(
				expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
					? ['panel', 'panel_c1']
					: ['panel'],
				(target) => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
		},
	});
};
