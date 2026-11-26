import { sortByOrder } from '@atlaskit/editor-common/legacy-rank-plugins';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PMPluginCreateConfig } from '../types/pm-plugin-list';
import { createEditorEscapeKeydownPlugin } from './editorEscapeKeydownPlugin';
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

	if (
		expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) ||
		isExperimentEnabled('platform_editor_block_control_migration')
	) {
		pmPlugins.push(createEditorNativeAnchorSupportPlugin(config.schema));
	}

	// Last, so every other plugin sees the Escape first.
	if (fg('platform-dst-top-layer')) {
		pmPlugins.push(createEditorEscapeKeydownPlugin());
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
