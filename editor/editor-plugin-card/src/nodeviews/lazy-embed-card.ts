import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { fg } from '@atlaskit/platform-feature-flags';

import { embedCardNodeView, type EmbedCardNodeViewProperties } from './embedCard';

export const lazyEmbedCardView = (props: EmbedCardNodeViewProperties) => {
	if (!fg('platform_editor_lazy-node-views')) {
		return embedCardNodeView(props);
	}

	return withLazyLoading({
		nodeName: 'embedCard',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-embed-card-item-nodeview" */
				'./embedCard'
			).then(({ embedCardNodeView }) => {
				return embedCardNodeView(props);
			});
			return result;
		},
	});
};
