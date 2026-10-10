import { useEffect } from 'react';

import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider/syncBlockStoreManager';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

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

	return null;
};
