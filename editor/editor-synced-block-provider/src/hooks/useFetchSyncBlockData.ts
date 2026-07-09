import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ProviderFactory, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { fg } from '@atlaskit/platform-feature-flags';

import { isProviderNotReadyError, SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';
import {
	buildFetchErrorAttribution,
	fetchErrorPayload,
	getPiiSafeOriginalError,
} from '../utils/errorHandling';
import { createSyncBlockNode, getSourceProductFromResourceIdSafe } from '../utils/utils';

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

	// On Jira the data provider is wired asynchronously, so the manager can be
	// constructed with `dataProvider === undefined`. Fetching/subscribing in that
	// window throws `Data provider not set`, logged as a false fetch error
	// (EDITOR-7860). Gate on readiness; once the provider resolves a new manager
	// instance is created so `referenceManager` changes identity and the effect
	// below re-runs, subscribing exactly once.
	const isDataProviderReady = fg('platform_editor_blocks_patch_3')
		? (manager.referenceManager.hasDataProvider?.() ?? false)
		: true;

	const reloadData = useCallback(async () => {
		if (isLoading) {
			return;
		}

		// Not ready: skip fetch, emit no error (see readiness note above).
		if (!isDataProviderReady) {
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
			// EDITOR-7860: benign not-ready throw — emit no error and stay loading
			// so it resolves on retry once the provider is wired. Checked before
			// `logException` so the benign case produces no exception-tracker noise.
			// Gate-off behaviour is unchanged.
			if (isProviderNotReadyError(error) && fg('platform_editor_blocks_patch_3')) {
				setFetchState((prev) => ({ ...prev, isLoading: true }));
				return;
			}

			logException(error as Error, {
				location: 'editor-synced-block-provider/useFetchSyncBlockData',
			});

			fireAnalyticsEvent?.(
				fetchErrorPayload(
					(error as Error).message,
					resourceId,
					getSourceProductFromResourceIdSafe(resourceId),
					buildFetchErrorAttribution(
						fg('platform_editor_blocks_patch_3'),
						(error as Error).message,
					),
				),
			);

			// Thread the PII-safe original message/name so the renderer can de-opaque
			// this otherwise-bare `errored` failure. `originalMessage` carries the
			// Error.message and is preferred over `reason` by the renderer, so no
			// separate `reason` is set here.
			setFetchState({
				syncBlockInstance: {
					resourceId: resourceId || '',
					error: {
						type: SyncBlockError.Errored,
						...getPiiSafeOriginalError(error),
					},
				},
				isLoading: false,
			});
			return;
		}
		setFetchState((prev) => ({ ...prev, isLoading: false }));
	}, [
		isLoading,
		isDataProviderReady,
		localId,
		manager.referenceManager,
		resourceId,
		fireAnalyticsEvent,
	]);

	useEffect(() => {
		if (isSSR()) {
			// in SSR, we don't need to subscribe to updates,
			// instead we rely on pre-fetched data ONLY, see initialization of syncBlockInstance above
			return;
		}

		// Not ready: skip subscribe (it would trigger a batched fetch and a false
		// error) and keep `isLoading: true`. `isDataProviderReady` is in the deps,
		// so the effect re-runs and subscribes once the provider resolves.
		if (!isDataProviderReady) {
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
	}, [isDataProviderReady, localId, manager.referenceManager, resourceId]);

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
