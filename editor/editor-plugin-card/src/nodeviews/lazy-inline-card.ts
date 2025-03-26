import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { inlineCardNodeView, type InlineCardNodeViewProperties } from './inlineCard';

export const lazyInlineCardView = (props: InlineCardNodeViewProperties) => {
	const isPageSSRed = props.isPageSSRed || false;
	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) ||
		!fg('platform_editor_ssr_fix_smartlinks') ||
		(isPageSSRed && fg('platform_ssr_smartlinks_editor'))
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
