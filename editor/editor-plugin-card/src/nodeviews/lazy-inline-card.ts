import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { inlineCardNodeView, type InlineCardNodeViewProperties } from './inlineCard';

export const lazyInlineCardView = (props: InlineCardNodeViewProperties) => {
	const { isPageSSRed = false } = props;

	if (editorExperiment('platform_editor_exp_lazy_node_views', false) || isPageSSRed) {
		return inlineCardNodeView(props);
	}

	return withLazyLoading({
		nodeName: 'inlineCard',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-inline-card-item-nodeview" */
				'./inlineCard'
			).then(({ inlineCardNodeView }) => {
				return inlineCardNodeView(props);
			});
			return result;
		},
	});
};
