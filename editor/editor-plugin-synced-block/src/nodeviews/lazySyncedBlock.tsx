import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';

import type { SyncBlockNodeViewProperties } from './syncedBlock';

export const lazySyncBlockView: (props: SyncBlockNodeViewProperties) => NodeViewConstructor = (
	props: SyncBlockNodeViewProperties,
) => {
	return withLazyLoading({
		nodeName: 'syncBlock',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-synced-block-nodeview" */
				'./syncedBlock'
			).then(({ syncBlockNodeView }) => {
				return syncBlockNodeView(props);
			});
			return result;
		},
	});
};
