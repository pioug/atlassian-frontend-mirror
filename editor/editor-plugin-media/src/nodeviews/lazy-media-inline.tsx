import type { IntlShape } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { PortalProviderAPI } from '@atlaskit/editor-common/common';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view/types';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../mediaPluginType';

export const lazyMediaInlineView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	fallbackMediaNameFetcher?: (id: string) => Promise<string>,
	intl?: IntlShape,
): NodeViewConstructor => {
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
						fallbackMediaNameFetcher,
						intl,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
