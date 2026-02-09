import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { inlineCardNodeView, type InlineCardNodeViewProperties } from './inlineCard';

export const lazyInlineCardView = (props: InlineCardNodeViewProperties) => {
	const { isPageSSRed = false } = props;

	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) ||
		expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true) ||
		isPageSSRed
	) {
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
