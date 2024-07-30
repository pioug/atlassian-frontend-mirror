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

import { ReactMediaNode } from './mediaNodeView';

export const lazyMediaView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	options: MediaOptions = {},
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
): NodeViewConstructor => {
	if (!fg('platform_editor_lazy-node-views')) {
		return ReactMediaNode(portalProviderAPI, eventDispatcher, providerFactory, options, api);
	}

	return withLazyLoading({
		nodeName: 'media',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-media-lazy-node-view" */
				'./mediaNodeView'
			).then(({ ReactMediaNode }) => {
				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
					return ReactMediaNode(
						portalProviderAPI,
						eventDispatcher,
						providerFactory,
						options,
						api,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
