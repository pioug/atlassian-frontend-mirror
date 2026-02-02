import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { CodeBidiWarningPlugin } from '../codeBidiWarningPluginType';

import { codeBidiWarningPluginKey } from './plugin-key';
import {
	createBidiWarningsDecorationSetFromDoc as reactCreateBidiWarningsDecorationSetFromDoc,
	pluginFactoryCreator as reactPluginFactoryCreator,
} from './react-plugin-factory';

export const createPlugin = (
	api: ExtractInjectionAPI<CodeBidiWarningPlugin> | undefined,
	{ dispatch, getIntl, nodeViewPortalProviderAPI }: PMPluginFactoryParams,
	{ appearance }: { appearance?: EditorAppearance },
) => {
	const intl = getIntl();

	const codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);

	const { createPluginState, getPluginState } =
		reactPluginFactoryCreator(nodeViewPortalProviderAPI);

	return new SafePlugin({
		key: codeBidiWarningPluginKey,
		state: createPluginState(dispatch, (state) => {
			if (expValEquals('platform_editor_remove_bidi_char_warning', 'isEnabled', true)) {
				return {
					decorationSet: DecorationSet.empty,
					codeBidiWarningLabel: '',
					tooltipEnabled: false,
				};
			}

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
				if (expValEquals('platform_editor_remove_bidi_char_warning', 'isEnabled', true)) {
					return DecorationSet.empty;
				}

				const { decorationSet } = getPluginState(state);

				return decorationSet;
			},
		},
	});
};
