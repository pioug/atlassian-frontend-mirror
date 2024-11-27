import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type {
	Configuration,
	ContextIdentifierPlugin,
	PluginConfiguration,
} from '../contextIdentifierPluginType';

export const pluginKey = new PluginKey<Configuration | undefined>('contextIdentiferPlugin');

async function updateContextIdentifier(
	config: PluginConfiguration,
	api: ExtractInjectionAPI<ContextIdentifierPlugin> | undefined,
) {
	const provider = await config.contextIdentifierProvider;
	api?.core?.actions.execute(
		api?.contextIdentifier?.commands.setProvider({
			contextIdentifierProvider: provider,
		}),
	);
}

export const createPlugin =
	(
		initialConfig: PluginConfiguration | undefined,
		api: ExtractInjectionAPI<ContextIdentifierPlugin> | undefined,
	) =>
	() => {
		if (initialConfig) {
			updateContextIdentifier(initialConfig, api);
		}
		return new SafePlugin({
			key: pluginKey,
			state: {
				init: () => initialConfig,
				apply: (tr: ReadonlyTransaction, pluginState: Configuration | undefined) => {
					const meta = tr.getMeta(pluginKey);
					return meta ? meta : pluginState;
				},
			},
		});
	};
