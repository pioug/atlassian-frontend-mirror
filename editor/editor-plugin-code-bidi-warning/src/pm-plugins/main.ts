import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAppearance, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { codeBidiWarningPluginKey } from './plugin-key';
import {
	createBidiWarningsDecorationSetFromDoc as reactCreateBidiWarningsDecorationSetFromDoc,
	pluginFactoryCreator as reactPluginFactoryCreator,
} from './react-plugin-factory';
import {
	createBidiWarningsDecorationSetFromDoc as vanillaCreateBidiWarningsDecorationSetFromDoc,
	pluginFactoryCreator as vanillaPluginFactoryCreator,
} from './vanilla-plugin-factory';

export const createPlugin = (
	{ dispatch, getIntl, nodeViewPortalProviderAPI }: PMPluginFactoryParams,
	{ appearance }: { appearance?: EditorAppearance },
) => {
	const intl = getIntl();

	const codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);

	const { createPluginState, getPluginState } = fg('platform_editor_vanilla_codebidi_warning')
		? vanillaPluginFactoryCreator()
		: reactPluginFactoryCreator(nodeViewPortalProviderAPI);

	return new SafePlugin({
		key: codeBidiWarningPluginKey,
		state: createPluginState(dispatch, (state) => {
			return {
				decorationSet: fg('platform_editor_vanilla_codebidi_warning')
					? vanillaCreateBidiWarningsDecorationSetFromDoc({
							doc: state.doc,
							codeBidiWarningLabel,
							tooltipEnabled: true,
						})
					: reactCreateBidiWarningsDecorationSetFromDoc({
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
