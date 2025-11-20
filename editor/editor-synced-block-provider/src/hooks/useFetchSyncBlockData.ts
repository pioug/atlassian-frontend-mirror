import { useCallback, useEffect, useState } from 'react';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';
import { createSyncBlockNode } from '../utils/utils';

export interface UseFetchSyncBlockDataResult {
	isLoading: boolean;
	providerFactory: ProviderFactory | undefined;
	reloadData: () => Promise<void>;
	syncBlockInstance: SyncBlockInstance | null;
}

export const useFetchSyncBlockData = (
	manager: SyncBlockStoreManager,
	resourceId?: string,
	localId?: string,
): UseFetchSyncBlockDataResult => {
	const [syncBlockInstance, setSyncBlockInstance] = useState<SyncBlockInstance | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const reloadData = useCallback(async () => {
		if (isLoading) {
			return;
		}

		const syncBlockNode = resourceId && localId ? createSyncBlockNode(localId, resourceId) : null;
		if (!syncBlockNode) {
			return;
		}

		setIsLoading(true);

		try {
			// Fetch sync block data, the `subscribeToSyncBlock` will update the state once data is fetched
			await manager.referenceManager.fetchSyncBlocksData([syncBlockNode]);
		} catch (error) {
			// Set error state if fetching fails
			setSyncBlockInstance({
				resourceId: resourceId || '',
				error: SyncBlockError.Errored,
			});
		}
		setIsLoading(false);
	}, [isLoading, localId, manager.referenceManager, resourceId]);

	useEffect(() => {
		const unsubscribe = manager.referenceManager.subscribeToSyncBlock(
			resourceId || '',
			localId || '',
			(data: SyncBlockInstance) => {
				setSyncBlockInstance(data);
				setIsLoading(false);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [localId, manager.referenceManager, resourceId]);

	return {
		isLoading,
		providerFactory: manager.referenceManager.getProviderFactory(resourceId || ''),
		reloadData,
		syncBlockInstance,
	};
};
