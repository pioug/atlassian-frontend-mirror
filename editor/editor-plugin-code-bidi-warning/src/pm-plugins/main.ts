import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAppearance, PMPluginFactoryParams } from '@atlaskit/editor-common/types';

import { codeBidiWarningPluginKey } from '../plugin-key';

import {
	createBidiWarningsDecorationSetFromDoc,
	createPluginState,
	getPluginState,
} from './plugin-factory';

export const createPlugin = (
	{ dispatch, getIntl }: PMPluginFactoryParams,
	{ appearance }: { appearance?: EditorAppearance },
) => {
	const intl = getIntl();

	const codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);

	return new SafePlugin({
		key: codeBidiWarningPluginKey,
		state: createPluginState(dispatch, (state) => {
			return {
				decorationSet: createBidiWarningsDecorationSetFromDoc({
					doc: state.doc,
					codeBidiWarningLabel,
					tooltipEnabled: true,
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
