import { confluenceUnsupportedBlock } from '@atlaskit/adf-schema/confluence-unsupported-block';
import { confluenceUnsupportedInline } from '@atlaskit/adf-schema/confluence-unsupported-inline';
import { unsupportedBlock } from '@atlaskit/adf-schema/unsupported-block';
import { unsupportedInline } from '@atlaskit/adf-schema/unsupported-inline';
import { unsupportedMark } from '@atlaskit/adf-schema/unsupported-mark';
import { unsupportedNodeAttribute } from '@atlaskit/adf-schema/unsupported-node-attributes';
import ReactNodeView, { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactory, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { UnsupportedBlockNodeView } from './nodeviews/unsupported-block-node-view';
import { UnsupportedInlineNodeView } from './nodeviews/unsupported-inline-node-view';
import { UnsupportedInlineNodeViewVanilla } from './nodeviews/unsupported-inline-node-view-vanilla';
import type { UnsupportedContentPlugin } from './unsupportedContentPluginType';

const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin: PMPluginFactory = (pmPluginFactoryParams: PMPluginFactoryParams) => {
	const { portalProviderAPI, eventDispatcher, dispatchAnalyticsEvent, getIntl } =
		pmPluginFactoryParams;
	const intl = getIntl();

	return new SafePlugin({
		key: pluginKey,
		props: {
			nodeViews: {
				confluenceUnsupportedBlock: isExperimentEnabled('platform_editor_vanilla_node_views_phase1')
					? (node: PMNode) => new UnsupportedBlockNodeView(node, intl, dispatchAnalyticsEvent)
					: ReactNodeView.fromComponent(
							UnsupportedBlock,
							portalProviderAPI,
							eventDispatcher,
							{ dispatchAnalyticsEvent },
							undefined,
						),
				confluenceUnsupportedInline: isExperimentEnabled(
					'platform_editor_vanilla_node_views_phase1',
				)
					? (node: PMNode) =>
							new UnsupportedInlineNodeViewVanilla(node, intl, dispatchAnalyticsEvent)
					: getInlineNodeViewProducer({
							pmPluginFactoryParams,
							Component: UnsupportedInlineNodeView,
							extraComponentProps: { dispatchAnalyticsEvent },
						}),
				unsupportedBlock: isExperimentEnabled('platform_editor_vanilla_node_views_phase1')
					? (node: PMNode) => new UnsupportedBlockNodeView(node, intl, dispatchAnalyticsEvent)
					: ReactNodeView.fromComponent(
							UnsupportedBlock,
							portalProviderAPI,
							eventDispatcher,
							{ dispatchAnalyticsEvent },
							undefined,
						),
				unsupportedInline: isExperimentEnabled('platform_editor_vanilla_node_views_phase1')
					? (node: PMNode) =>
							new UnsupportedInlineNodeViewVanilla(node, intl, dispatchAnalyticsEvent)
					: getInlineNodeViewProducer({
							pmPluginFactoryParams,
							Component: UnsupportedInlineNodeView,
							extraComponentProps: { dispatchAnalyticsEvent },
						}),
			},
		},
	});
};

/**
 * Unsupported content plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const unsupportedContentPlugin: UnsupportedContentPlugin = () => ({
	name: 'unsupportedContent',

	marks() {
		return [
			{ name: 'unsupportedMark', mark: unsupportedMark },
			{ name: 'unsupportedNodeAttribute', mark: unsupportedNodeAttribute },
		];
	},

	nodes() {
		return [
			{
				name: 'confluenceUnsupportedBlock',
				node: confluenceUnsupportedBlock,
			},
			{
				name: 'confluenceUnsupportedInline',
				node: confluenceUnsupportedInline,
			},
			{
				name: 'unsupportedBlock',
				node: unsupportedBlock,
			},
			{
				name: 'unsupportedInline',
				node: unsupportedInline,
			},
		];
	},

	pmPlugins() {
		return [
			{
				name: 'unsupportedContent',
				plugin: createPlugin,
			},
		];
	},
});
