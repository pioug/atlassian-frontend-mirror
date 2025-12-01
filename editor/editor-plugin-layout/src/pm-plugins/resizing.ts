import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type LayoutPlugin } from '../layoutPluginType';
import { LayoutSectionView } from '../nodeviews';
import type { LayoutPluginOptions } from '../types';

export const pluginKey = new PluginKey('layoutResizingPlugin');

export default (
	options: LayoutPluginOptions,
	pluginInjectionApi: ExtractInjectionAPI<LayoutPlugin>,
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
) =>
	new SafePlugin<undefined>({
		key: pluginKey,
		props: {
			nodeViews: {
				layoutSection: (node, view, getPos) => {
					return new LayoutSectionView({
						node,
						view,
						getPos,
						portalProviderAPI,
						eventDispatcher,
						pluginInjectionApi,
						options,
					}).init();
				},
			},
		},
	});
