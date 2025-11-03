import { useEffect, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockInstance } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const SYNC_BLOCK_FETCH_INTERVAL = 3000;

export const useFetchSyncBlockData = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): SyncBlockInstance | null => {
	const [syncBlockInstance, setSyncBlockInstance] = useState<SyncBlockInstance | null>(null);

	useEffect(() => {
		const unsubscribe = manager.subscribeToSyncBlockData(
			syncBlockNode,
			(data: SyncBlockInstance) => {
				setSyncBlockInstance(data);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [manager, syncBlockNode]);

	return syncBlockInstance;
};
