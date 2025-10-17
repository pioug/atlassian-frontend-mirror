import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';

import type { BodiedSyncBlockNodeViewProperties } from './bodiedSyncedBlock';

export const lazyBodiedSyncBlockView: (props: BodiedSyncBlockNodeViewProperties) => NodeViewConstructor = (
	props: BodiedSyncBlockNodeViewProperties,
) => {
	return withLazyLoading({
		nodeName: 'bodiedSyncBlock',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-bodied-synced-block-nodeview" */
				'./bodiedSyncedBlock'
			).then(({ bodiedSyncBlockNodeView }) => {
				return bodiedSyncBlockNodeView(props);
			});
			return result;
		},
	});
};
