import { useCallback, useEffect, useState } from 'react';

import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';
import { fetchErrorPayload } from '../utils/errorHandling';
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
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
): UseFetchSyncBlockDataResult => {
	// Initialize both states from a single cache lookup to avoid race conditions.
	// When a block is moved/remounted, the old component's cleanup may clear the cache
	// before or after the new component mounts. By doing a single lookup, we ensure
	// consistency between syncBlockInstance and isLoading initial values.
	const [{ syncBlockInstance, isLoading }, setFetchState] = useState(() => {
		if (resourceId) {
			const initialData = manager?.referenceManager?.getInitialSyncBlockData(resourceId);
			return {
				syncBlockInstance: initialData ?? null,
				isLoading: initialData === undefined,
			};
		}
		return { syncBlockInstance: null, isLoading: true };
	});

	const reloadData = useCallback(async () => {
		if (isLoading) {
			return;
		}

		try {
			const syncBlockNode = resourceId && localId ? createSyncBlockNode(localId, resourceId) : null;
			if (!syncBlockNode) {
				throw new Error('Failed to create sync block node from resourceid and localid');
			}

			setFetchState((prev) => ({ ...prev, isLoading: true }));

			// Fetch sync block data, the `subscribeToSyncBlock` will update the state once data is fetched
			await manager.referenceManager.fetchSyncBlocksData([syncBlockNode]);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/useFetchSyncBlockData',
			});
			fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));

			// Set error state if fetching fails
			setFetchState({
				syncBlockInstance: {
					resourceId: resourceId || '',
					error: SyncBlockError.Errored,
				},
				isLoading: false,
			});
			return;
		}
		setFetchState((prev) => ({ ...prev, isLoading: false }));
	}, [isLoading, localId, manager.referenceManager, resourceId, fireAnalyticsEvent]);

	useEffect(() => {
		const unsubscribe = manager.referenceManager.subscribeToSyncBlock(
			resourceId || '',
			localId || '',
			(data: SyncBlockInstance) => {
				setFetchState({ syncBlockInstance: data, isLoading: false });
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
