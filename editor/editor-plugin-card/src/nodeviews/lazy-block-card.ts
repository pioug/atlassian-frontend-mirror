import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { fg } from '@atlaskit/platform-feature-flags';

import { blockCardNodeView, type BlockCardNodeViewProperties } from './blockCard';

export const lazyBlockCardView = (props: BlockCardNodeViewProperties) => {
	if (!fg('platform_editor_lazy-node-views')) {
		return blockCardNodeView(props);
	}

	return withLazyLoading({
		nodeName: 'blockCard',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-tasks-and-decisions_task-item-nodeview" */
				'./blockCard'
			).then(({ blockCardNodeView }) => {
				return blockCardNodeView(props);
			});
			return result;
		},
	});
};
