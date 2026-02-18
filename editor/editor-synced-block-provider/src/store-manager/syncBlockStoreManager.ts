import { useMemo } from 'react';

import type { SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { Experience } from '@atlaskit/editor-common/experiences';
import { logException } from '@atlaskit/editor-common/monitoring';

import { getProductFromSourceAri } from '../clients/block-service/ari';
import {
	SyncBlockError,
	type BlockInstanceId,
	type ReferencesSourceInfo,
	type ResourceId,
} from '../common/types';
import type { SyncBlockDataProviderInterface } from '../providers/types';
import { fetchReferencesErrorPayload } from '../utils/errorHandling';
import {
	getFetchReferencesExperience,
	getFetchSourceInfoExperience,
} from '../utils/experienceTracking';

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
	private dataProvider?: SyncBlockDataProviderInterface;
	private fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void;

	private fetchReferencesExperience: Experience | undefined;
	private fetchSourceInfoExperience: Experience | undefined;

	constructor(dataProvider?: SyncBlockDataProviderInterface) {
		// In future, if reference manager needs to reach to source manager and read it's current in memorey cache
		// we can pass the source manager as a parameter to the reference manager constructor
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(dataProvider);
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(dataProvider);
		this.dataProvider = dataProvider;
		this.referenceSyncBlockStoreManager.setRealTimeSubscriptionsEnabled(true);
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

			this.fetchReferencesExperience?.start();
			const response = await this.dataProvider.fetchReferences(resourceId, isSourceSyncBlock);
			if (response.error) {
				this.fetchReferencesExperience?.failure({ reason: response.error });

				return { error: response.error };
			}

			if (!response.references || response.references?.length === 0) {
				// No reference found
				if (isSourceSyncBlock) {
					this.fetchReferencesExperience?.success();
				} else {
					this.fetchReferencesExperience?.failure({
						reason: 'No references found for reference synced block',
					});
				}
				return isSourceSyncBlock ? { references: [] } : { error: SyncBlockError.Errored };
			}
			this.fetchReferencesExperience?.success();

			const sourceInfoPromises = response.references.map(async (reference) => {
				this.fetchSourceInfoExperience?.start();
				const sourceInfo = await this.dataProvider?.fetchSyncBlockSourceInfo(
					reference.blockInstanceId || '',
					reference.documentAri,
					getProductFromSourceAri(reference.documentAri),
					this.fireAnalyticsEvent,
					reference.hasAccess,
					'view',
				);
				if (!sourceInfo) {
					this.fetchSourceInfoExperience?.failure({
						reason: `no source info returned for ari: ${reference.documentAri}`,
					});
					return undefined;
				}
				this.fetchSourceInfoExperience?.success();
				return {
					...sourceInfo,
					onSameDocument: reference.onSameDocument,
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
					onSameDocument: Boolean(sourceSyncBlockData?.onSameDocument),
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

		this.fetchReferencesExperience = getFetchReferencesExperience(fireAnalyticsEvent);
		this.fetchSourceInfoExperience = getFetchSourceInfoExperience(fireAnalyticsEvent);
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

		this.fetchReferencesExperience?.abort({ reason: 'editorDestroyed' });
		this.fetchSourceInfoExperience?.abort({ reason: 'editorDestroyed' });
	}
}

const createSyncBlockStoreManager = (dataProvider?: SyncBlockDataProviderInterface) => {
	return new SyncBlockStoreManager(dataProvider);
};

export const useMemoizedSyncBlockStoreManager = (
	dataProvider?: SyncBlockDataProviderInterface,
	fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
) => {
	const syncBlockStoreManager = useMemo(() => {
		const syncBlockStoreManager = createSyncBlockStoreManager(dataProvider);
		return syncBlockStoreManager;
	}, [dataProvider]);

	syncBlockStoreManager.setFireAnalyticsEvent(fireAnalyticsEvent);
	return syncBlockStoreManager;
};
