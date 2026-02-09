import { useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const SYNC_BLOCK_FETCH_INTERVAL = 3000;

// Component that manages synced block data synchronization.
// Component that manages synced block data synchronization.
// Uses provider-based GraphQL subscriptions for updates when online.
// Falls back to polling at regular intervals when offline.
export const SyncBlockRefresher = ({
	syncBlockStoreManager,
	api,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockStoreManager: SyncBlockStoreManager;
}) => {
	const { mode } = useSharedPluginStateWithSelector(api, ['connectivity'], (states) => ({
		mode: states.connectivityState?.mode,
	}));

	const isOnline = !isOfflineMode(mode);

	useEffect(() => {
		const useRealTimeSubscriptions = isOnline;
		syncBlockStoreManager.referenceManager.setRealTimeSubscriptionsEnabled(
			useRealTimeSubscriptions,
		);
	}, [syncBlockStoreManager, isOnline]);

	useEffect(() => {
		const useRealTimeSubscriptions = isOnline;
		if (useRealTimeSubscriptions) {
			return;
		}

		let interval: number = -1;
		if (isOnline) {
			interval = window.setInterval(() => {
				// check if document is visible to avoid unnecessary refreshes
				if (document?.visibilityState === 'visible') {
					syncBlockStoreManager.referenceManager.refreshSubscriptions();
				}
			}, SYNC_BLOCK_FETCH_INTERVAL);
		} else if (interval !== -1) {
			window.clearInterval(interval);
		}

		return () => {
			window.clearInterval(interval);
		};
	}, [syncBlockStoreManager, isOnline]);

	return null;
};
