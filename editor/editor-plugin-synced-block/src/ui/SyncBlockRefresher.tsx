import { useEffect } from 'react';

import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

const REFRESH_INTERVAL = 3000;

// Component that refreshes synced block subscriptions at regular intervals
// this is a workaround for the subscription mechanism not being real-time
export const SyncBlockRefresher = ({
	syncBlockStoreManager,
}: {
	syncBlockStoreManager: SyncBlockStoreManager;
}) => {
	useEffect(() => {
		const interval = window.setInterval(() => {
			// check if document is visible to avoid unnecessary refreshes
			if (document?.visibilityState === 'visible') {
				syncBlockStoreManager.refreshSubscriptions();
			}
		}, REFRESH_INTERVAL);

		return () => {
			window.clearInterval(interval);
		};
	}, [syncBlockStoreManager]);

	return null;
};
