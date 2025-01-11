import { withLazyLoading, type NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { blockCardNodeView, type BlockCardNodeViewProperties } from './blockCard';

export const lazyBlockCardView: (props: BlockCardNodeViewProperties) => NodeViewConstructor = (
	props: BlockCardNodeViewProperties,
) => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return blockCardNodeView(props);
	}

	return withLazyLoading({
		nodeName: 'blockCard',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-block-card-item-nodeview" */
				'./blockCard'
			).then(({ blockCardNodeView }) => {
				return blockCardNodeView(props);
			});
			return result;
		},
	});
};
