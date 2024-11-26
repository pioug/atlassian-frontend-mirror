import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAppearance, PMPluginFactoryParams } from '@atlaskit/editor-common/types';

import { createBidiWarningsDecorationSetFromDoc, pluginFactoryCreator } from './plugin-factory';
import { codeBidiWarningPluginKey } from './plugin-key';

export const createPlugin = (
	{ dispatch, getIntl, nodeViewPortalProviderAPI }: PMPluginFactoryParams,
	{ appearance }: { appearance?: EditorAppearance },
) => {
	const intl = getIntl();

	const codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);

	const { createPluginState, getPluginState } = pluginFactoryCreator(nodeViewPortalProviderAPI);

	return new SafePlugin({
		key: codeBidiWarningPluginKey,
		state: createPluginState(dispatch, (state) => {
			return {
				decorationSet: createBidiWarningsDecorationSetFromDoc({
					doc: state.doc,
					codeBidiWarningLabel,
					tooltipEnabled: true,
					nodeViewPortalProviderAPI,
				}),
				codeBidiWarningLabel,
				tooltipEnabled: true,
			};
		}),
		props: {
			decorations: (state) => {
				const { decorationSet } = getPluginState(state);

				return decorationSet;
			},
		},
	});
};
