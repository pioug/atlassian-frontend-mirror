import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages/codeBidiWarning';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types/plugin-factory';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { CodeBidiWarningPlugin } from '../codeBidiWarningPluginType';
import { codeBidiWarningPluginKey } from './plugin-key';
import {
	createBidiWarningsDecorationSetFromDoc as reactCreateBidiWarningsDecorationSetFromDoc,
	pluginFactoryCreator as reactPluginFactoryCreator,
} from './react-plugin-factory';
import type { CodeBidiWarningPluginState } from './types';

export const createPlugin = (
	api: ExtractInjectionAPI<CodeBidiWarningPlugin> | undefined,
	{ dispatch, getIntl, nodeViewPortalProviderAPI }: PMPluginFactoryParams,
	{ appearance }: { appearance?: EditorAppearance },
): SafePlugin<CodeBidiWarningPluginState> => {
	const intl = getIntl();

	const codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);

	const { createPluginState, getPluginState } =
		reactPluginFactoryCreator(nodeViewPortalProviderAPI);

	return new SafePlugin({
		key: codeBidiWarningPluginKey,
		state: createPluginState(dispatch, (state) => {
			if (api?.limitedMode?.sharedState.currentState()?.enabled) {
				return {
					decorationSet: DecorationSet.empty,
					codeBidiWarningLabel: '',
					tooltipEnabled: false,
				};
			}

			return {
				decorationSet: reactCreateBidiWarningsDecorationSetFromDoc({
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
