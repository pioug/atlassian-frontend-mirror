import { useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const SYNC_BLOCK_FETCH_INTERVAL = 3000;

// Component that refreshes synced block subscriptions at regular intervals
// this is a workaround for the subscription mechanism not being real-time
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
	useEffect(() => {
		let interval: number = -1;
		if (mode !== 'offline') {
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
	}, [syncBlockStoreManager, mode]);

	return null;
};
