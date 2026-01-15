import { useMemo } from 'react';

import type { SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';

import { getProductFromSourceAri } from '../clients/block-service/ari';
import {
	SyncBlockError,
	type BlockInstanceId,
	type ReferencesSourceInfo,
	type ResourceId,
} from '../common/types';
import type { SyncBlockDataProvider } from '../providers/types';
import { fetchReferencesErrorPayload } from '../utils/errorHandling';

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
	private dataProvider?: SyncBlockDataProvider;
	private fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void;

	constructor(dataProvider?: SyncBlockDataProvider) {
		// In future, if reference manager needs to reach to source manager and read it's current in memorey cache
		// we can pass the source manager as a parameter to the reference manager constructor
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(dataProvider);
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(dataProvider);
		this.dataProvider = dataProvider;
	}

	public async fetchReferencesSourceInfo(
		resourceId: ResourceId,
		blockInstanceId: BlockInstanceId,
		isSourceSyncBlock: boolean,
	): Promise<ReferencesSourceInfo> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}
			const response = await this.dataProvider.fetchReferences(resourceId, isSourceSyncBlock);
			if (response.error) {
				return { error: response.error };
			}

			if (!response.references || response.references?.length === 0) {
				// No reference found
				return isSourceSyncBlock ? { references: [] } : { error: SyncBlockError.Errored };
			}

			const sourceInfoPromises = response.references.map(async (reference) => {
				const sourceInfo = await this.dataProvider?.fetchSyncBlockSourceInfo(
					blockInstanceId,
					reference.documentAri,
					getProductFromSourceAri(reference.documentAri),
					this.fireAnalyticsEvent,
					reference.hasAccess,
					'view',
				);
				if (!sourceInfo) {
					return undefined;
				}
				return {
					...sourceInfo,
					onSamePage: reference.onSamePage,
					hasAccess: reference.hasAccess,
					productType: sourceInfo.productType,
				};
			});

			const sourceInfos = await Promise.all(sourceInfoPromises);

			const sourceSyncBlockData = await (isSourceSyncBlock
				? this.sourceSyncBlockStoreManager.getSyncBlockSourceInfo(blockInstanceId)
				: this.referenceSyncBlockStoreManager.fetchSyncBlockSourceInfo(resourceId));
			if (sourceSyncBlockData) {
				sourceInfos.push({
					...sourceSyncBlockData,
					onSamePage: Boolean(sourceSyncBlockData?.onSamePage),
					hasAccess: true,
					isSource: true,
					productType: sourceSyncBlockData?.productType,
				});
			}

			return { references: sourceInfos };
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/syncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(fetchReferencesErrorPayload((error as Error).message));

			return { error: SyncBlockError.Errored };
		}
	}

	public setFireAnalyticsEvent(fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) {
		this.fireAnalyticsEvent = fireAnalyticsEvent;
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
