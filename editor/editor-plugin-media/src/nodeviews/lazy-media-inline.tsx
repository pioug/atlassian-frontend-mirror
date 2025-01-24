import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../mediaPluginType';

import { ReactMediaInlineNode } from './mediaInline';

export const lazyMediaInlineView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return ReactMediaInlineNode(
			portalProviderAPI,
			eventDispatcher,
			providerFactory,
			api,
			dispatchAnalyticsEvent,
		);
	}

	return withLazyLoading({
		nodeName: 'mediaInline',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-media-inline-lazy-node-view" */
				'./mediaInline'
			).then(({ ReactMediaInlineNode }) => {
				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
					return ReactMediaInlineNode(
						portalProviderAPI,
						eventDispatcher,
						providerFactory,
						api,
						dispatchAnalyticsEvent,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
