import { withLazyLoading, type NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { embedCardNodeView, type EmbedCardNodeViewProperties } from './embedCard';

export const lazyEmbedCardView: (props: EmbedCardNodeViewProperties) => NodeViewConstructor = (
	props: EmbedCardNodeViewProperties,
) => {
	const { isPageSSRed } = props;

	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) ||
		(isPageSSRed && expValEquals('platform_editor_smart_card_otp', 'isEnabled', true))
	) {
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
