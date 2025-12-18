import { useMemo } from 'react';

import type { SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';

import type { SyncBlockDataProvider } from '../providers/types';

import { ReferenceSyncBlockStoreManager } from './referenceSyncBlockStoreManager';
import { SourceSyncBlockStoreManager } from './sourceSyncBlockStoreManager';

// A parent store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Contains two child store managers: ReferenceSyncBlockStoreManager and SourceSyncBlockStoreManager.
// ReferenceSyncBlockStoreManager is responsible for the lifecycle and state management of reference sync blocks in an editor instance.
// SourceSyncBlockStoreManager is responsible for the lifecycle and state management of source sync blocks in an editor instance.
// Can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private referenceSyncBlockStoreManager: ReferenceSyncBlockStoreManager;
	private sourceSyncBlockStoreManager: SourceSyncBlockStoreManager;

	constructor(
		dataProvider?: SyncBlockDataProvider,
		fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
	) {
		// In future, if reference manager needs to reach to source manager and read it's current in memorey cache
		// we can pass the source manager as a parameter to the reference manager constructor
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(
			dataProvider,
			fireAnalyticsEvent,
		);
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(
			dataProvider,
			fireAnalyticsEvent,
		);
	}

	public get referenceManager(): ReferenceSyncBlockStoreManager {
		return this.referenceSyncBlockStoreManager;
	}
	public get sourceManager(): SourceSyncBlockStoreManager {
		return this.sourceSyncBlockStoreManager;
	}

	destroy() {
		this.referenceSyncBlockStoreManager.destroy();
		this.sourceSyncBlockStoreManager.destroy();
	}
}

export const useMemoizedSyncBlockStoreManager = (
	dataProvider?: SyncBlockDataProvider,
	fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
) => {
	return useMemo(() => {
		const syncBlockStoreManager = new SyncBlockStoreManager(dataProvider, fireAnalyticsEvent);

		return syncBlockStoreManager;
	}, [dataProvider, fireAnalyticsEvent]);
};
