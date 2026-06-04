import { sortByOrder } from '@atlaskit/editor-common/legacy-rank-plugins';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PMPluginCreateConfig } from '../types/pm-plugin-list';

import { createEditorNativeAnchorSupportPlugin } from './editorNativeAnchorSupportPlugin';
import { createEditorStateNotificationPlugin } from './editorStateNotificationPlugin';

export function createPMPlugins(config: PMPluginCreateConfig): SafePlugin[] {
	const { editorConfig } = config;

	const pmPlugins = editorConfig.pmPlugins
		.sort(sortByOrder('plugins'))
		.map(({ plugin }) =>
			plugin({
				schema: config.schema,
				dispatch: config.dispatch,
				eventDispatcher: config.eventDispatcher,
				providerFactory: config.providerFactory,
				errorReporter: config.errorReporter,
				portalProviderAPI: config.portalProviderAPI,
				nodeViewPortalProviderAPI: config.nodeViewPortalProviderAPI,
				dispatchAnalyticsEvent: config.dispatchAnalyticsEvent,
				featureFlags: config.featureFlags || {},
				getIntl: config.getIntl,
			}),
		)
		.filter((plugin): plugin is SafePlugin => typeof plugin !== 'undefined');

	if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		pmPlugins.push(createEditorNativeAnchorSupportPlugin(config.schema));
	}

	if (config.onEditorStateUpdated !== undefined) {
		return [
			createEditorStateNotificationPlugin(
				config.onEditorStateUpdated,
				config.editorConfig.onEditorViewStateUpdatedCallbacks,
			),
			...pmPlugins,
		];
	}

	return pmPlugins;
}
