import { useCallback, useEffect, useMemo, useState } from 'react';

import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ProviderFactory, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { fg } from '@atlaskit/platform-feature-flags';

import { SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';
import { fetchErrorPayload } from '../utils/errorHandling';
import { createSyncBlockNode } from '../utils/utils';

type SSRProviders = { media?: MediaProvider | null };

export interface UseFetchSyncBlockDataResult {
	isLoading: boolean;
	providerFactory: ProviderFactory | undefined;
	reloadData: () => Promise<void>;
	ssrProviders?: SSRProviders | null;
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
			if (fg('platform_synced_block_patch_3')) {
				fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));
			} else {
				manager?.referenceManager?.fetchExperience?.failure({ reason: (error as Error).message });
			}

			// Set error state if fetching fails
			setFetchState({
				syncBlockInstance: {
					resourceId: resourceId || '',
					error: { type: SyncBlockError.Errored },
				},
				isLoading: false,
			});
			return;
		}
		setFetchState((prev) => ({ ...prev, isLoading: false }));
	}, [isLoading, localId, manager.referenceManager, resourceId, fireAnalyticsEvent]);

	useEffect(() => {
		if (isSSR()) {
			// in SSR, we don't need to subscribe to updates,
			// instead we rely on pre-fetched data ONLY, see initialization of syncBlockInstance above
			return;
		}

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

	const ssrProviders = useMemo(() => {
		return resourceId ? manager.referenceManager.getSSRProviders(resourceId) : null;
	}, [resourceId, manager.referenceManager]);

	return {
		isLoading,
		ssrProviders,
		providerFactory: manager.referenceManager.getProviderFactory(resourceId || ''),
		reloadData,
		syncBlockInstance,
	};
};
