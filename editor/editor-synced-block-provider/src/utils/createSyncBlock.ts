import type { BlockInstanceId, ResourceId, SyncBlockNode } from '../common/types';

export const createSyncBlockNode = (
	localId: BlockInstanceId,
	resourceId: ResourceId,
): SyncBlockNode => {
	return {
		type: 'syncBlock',
		attrs: {
			localId,
			resourceId,
		},
	};
};
