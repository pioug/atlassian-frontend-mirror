import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type NodeViewConstructor, withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type PortalProviderAPI } from '@atlaskit/editor-common/src/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MediaNextEditorPluginType } from '../next-plugin-type';
import type { MediaOptions } from '../types';

import { ReactMediaSingleNode } from './mediaSingle';

export const lazyMediaSingleView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	options: MediaOptions = {},
): NodeViewConstructor => {
	if (!fg('platform_editor_lazy-node-views')) {
		return ReactMediaSingleNode(
			portalProviderAPI,
			eventDispatcher,
			providerFactory,
			api,
			dispatchAnalyticsEvent,
			options,
		);
	}

	return withLazyLoading({
		nodeName: 'mediaSingle',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-media-single-lazy-node-view" */
				'./mediaSingle'
			).then(({ ReactMediaSingleNode }) => {
				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
					return ReactMediaSingleNode(
						portalProviderAPI,
						eventDispatcher,
						providerFactory,
						api,
						dispatchAnalyticsEvent,
						options,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
