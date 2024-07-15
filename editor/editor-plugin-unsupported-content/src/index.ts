import {
	confluenceUnsupportedBlock,
	confluenceUnsupportedInline,
	unsupportedBlock,
	unsupportedInline,
	unsupportedMark,
	unsupportedNodeAttribute,
} from '@atlaskit/adf-schema';
import ReactNodeView, { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	NextEditorPlugin,
	PMPluginFactory,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { UnsupportedInlineNodeView } from './unsupported-inline-node-view';

const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin: PMPluginFactory = (pmPluginFactoryParams: PMPluginFactoryParams) => {
	const { portalProviderAPI, eventDispatcher, dispatchAnalyticsEvent } = pmPluginFactoryParams;
	return new SafePlugin({
		key: pluginKey,
		props: {
			nodeViews: {
				confluenceUnsupportedBlock: ReactNodeView.fromComponent(
					UnsupportedBlock,
					portalProviderAPI,
					eventDispatcher,
					{ dispatchAnalyticsEvent },
					undefined,
				),
				confluenceUnsupportedInline: getInlineNodeViewProducer({
					pmPluginFactoryParams,
					Component: UnsupportedInlineNodeView,
					extraComponentProps: { dispatchAnalyticsEvent },
				}),
				unsupportedBlock: ReactNodeView.fromComponent(
					UnsupportedBlock,
					portalProviderAPI,
					eventDispatcher,
					{ dispatchAnalyticsEvent },
					undefined,
				),
				unsupportedInline: getInlineNodeViewProducer({
					pmPluginFactoryParams,
					Component: UnsupportedInlineNodeView,
					extraComponentProps: { dispatchAnalyticsEvent },
				}),
			},
		},
	});
};

export type UnsupportedContentPlugin = NextEditorPlugin<'unsupportedContent'>;
/**
 * Unsupported content plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
const unsupportedContentPlugin: UnsupportedContentPlugin = () => ({
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

export { unsupportedContentPlugin };
