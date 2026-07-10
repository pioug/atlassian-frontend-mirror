import type { IntlShape } from 'react-intl';

import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { EditorPlugin, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { EventDispatcher, createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

class SSREventDispatcher extends EventDispatcher {
	override emit() {
		// Don't notify about events in SSR
	}
}

/**
 * Creates PM plugins in SSR-safe manner using a no-op SSREventDispatcher
 * and an empty ProviderFactory.
 */
export function createSSRPMPlugins({
	plugins,
	schema,
	portalProviderAPI,
	getIntl,
}: {
	getIntl: () => IntlShape;
	plugins: EditorPlugin[];
	portalProviderAPI: PortalProviderAPI;
	schema: Schema;
}): SafePlugin[] {
	const eventDispatcher = new SSREventDispatcher();
	const providerFactory = new ProviderFactory();

	const pmPluginFactoryParams: PMPluginFactoryParams = {
		dispatch: createDispatch(eventDispatcher),
		dispatchAnalyticsEvent: () => {},
		eventDispatcher,
		featureFlags: {},
		getIntl,
		portalProviderAPI: portalProviderAPI,
		nodeViewPortalProviderAPI: portalProviderAPI,
		providerFactory,
		schema,
	};

	return plugins.reduce((acc, editorPlugin) => {
		editorPlugin.pmPlugins?.().forEach(({ plugin }) => {
			try {
				const pmPlugin = plugin(pmPluginFactoryParams);
				if (pmPlugin) {
					acc.push(pmPlugin);
				}
			} catch (error) {
				if (process.env.NODE_ENV !== 'production') {
					// eslint-disable-next-line no-console
					console.warn(
						`[EditorSSR] Failed to create PM plugin (${plugin?.name}) during SSR. This plugin will be skipped.`,
						error,
					);
				}
			}
		});
		return acc;
	}, [] as SafePlugin[]);
}
