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

	constructor(dataProvider?: SyncBlockDataProvider) {
		// In future, if reference manager needs to reach to source manager and read it's current in memorey cache
		// we can pass the source manager as a parameter to the reference manager constructor
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(dataProvider);
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(dataProvider);
	}

	public setFireAnalyticsEvent(fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) {
		this.referenceSyncBlockStoreManager.setFireAnalyticsEvent(fireAnalyticsEvent);
		this.sourceSyncBlockStoreManager.setFireAnalyticsEvent(fireAnalyticsEvent);
	}

	public get referenceManager(): ReferenceSyncBlockStoreManager {
		return this.referenceSyncBlockStoreManager;
	}
	public get sourceManager(): SourceSyncBlockStoreManager {
		return this.sourceSyncBlockStoreManager;
	}

	destroy(): void {
		this.referenceSyncBlockStoreManager.destroy();
		this.sourceSyncBlockStoreManager.destroy();
	}
}

const createSyncBlockStoreManager = (dataProvider?: SyncBlockDataProvider) => {
	return new SyncBlockStoreManager(dataProvider);
};

export const useMemoizedSyncBlockStoreManager = (
	dataProvider?: SyncBlockDataProvider,
	fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
) => {
	const syncBlockStoreManager = useMemo(() => {
		const syncBlockStoreManager = createSyncBlockStoreManager(dataProvider);
		return syncBlockStoreManager;
	}, [dataProvider]);

	syncBlockStoreManager.setFireAnalyticsEvent(fireAnalyticsEvent);
	return syncBlockStoreManager;
};
