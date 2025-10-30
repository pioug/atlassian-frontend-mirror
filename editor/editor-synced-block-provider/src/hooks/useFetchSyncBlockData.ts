import { useEffect, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { FetchSyncBlockDataResult } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const SYNC_BLOCK_FETCH_INTERVAL = 3000;

export const useFetchSyncBlockData = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): FetchSyncBlockDataResult | null => {
	const [fetchSyncBlockDataResult, setFetchSyncBlockDataResult] =
		useState<FetchSyncBlockDataResult | null>(null);

	useEffect(() => {
		const unsubscribe = manager.subscribeToSyncBlockData(
			syncBlockNode,
			(data: FetchSyncBlockDataResult) => {
				setFetchSyncBlockDataResult(data);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [manager, setFetchSyncBlockDataResult, syncBlockNode]);

	return fetchSyncBlockDataResult;
};
