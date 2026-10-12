import { useEffect, useMemo, useRef } from 'react';

import type { SyncBlockEventPayload } from '@atlaskit/editor-common/analytics/types/sync-block-events';
import type { Experience } from '@atlaskit/editor-common/experiences/Experience';
import { logException } from '@atlaskit/editor-common/monitoring/error';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { getProductFromSourceAri } from '../clients/block-service/ari';
import { SyncBlockError } from '../common/types';
import type { BlockInstanceId, ReferencesSourceInfo, ResourceId } from '../common/types';
import type { SyncBlockDataProviderInterface, SyncBlockSourceInfo } from '../providers/types';
import { fetchReferencesErrorPayload } from '../utils/errorHandling';
import {
	getFetchReferencesExperience,
	getFetchSourceInfoExperience,
} from '../utils/experienceTracking';
import { getSourceProductFromResourceIdSafe } from '../utils/utils';
import { ReferenceSyncBlockStoreManager } from './referenceSyncBlockStoreManager';
import { SourceSyncBlockStoreManager } from './sourceSyncBlockStoreManager';

// A parent store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Contains two child store managers: ReferenceSyncBlockStoreManager and SourceSyncBlockStoreManager.
// ReferenceSyncBlockStoreManager is responsible for the lifecycle and state management of reference sync blocks in an editor instance.
// SourceSyncBlockStoreManager is responsible for the lifecycle and state management of source sync blocks in an editor instance.
// Can be used in both editor and renderer contexts.

export type SyncBlockStoreManagerOptions = {
	/**
	 * Whether reference blocks managed by this store should hold a real-time
	 * (`blockService_onBlockUpdated`) subscription and refresh in place when the
	 * source changes elsewhere. Defaults to `true`.
	 *
	 * Surfaces that show content "as of load" — most notably the Confluence
	 * classic page/blog renderer, where a document being read must not change
	 * under the reader — pass `false`. This is deliberately independent of
	 * `viewMode`: a live doc in read mode is the editor in view mode and must
	 * stay live, so `viewMode` cannot be used to identify those surfaces.
	 */
	enableRealTimeSubscriptions?: boolean;
};

export class SyncBlockStoreManager {
	private referenceSyncBlockStoreManager: ReferenceSyncBlockStoreManager;
	private sourceSyncBlockStoreManager: SourceSyncBlockStoreManager;
	private dataProvider?: SyncBlockDataProviderInterface;
	private fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void;

	private fetchReferencesExperience: Experience | undefined;
	private fetchSourceInfoExperience: Experience | undefined;

	constructor(
		dataProvider?: SyncBlockDataProviderInterface,
		viewMode?: ViewMode,
		isLivePage?: boolean,
		options?: SyncBlockStoreManagerOptions,
	) {
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(
			dataProvider,
			viewMode,
			isLivePage,
		);
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(
			dataProvider,
			viewMode,
			this.sourceSyncBlockStoreManager,
		);
		this.dataProvider = dataProvider;
		// Set in the constructor rather than from an effect on the consumer side:
		// reference nodes subscribe as they mount, so any later toggle would open
		// (and immediately tear down) subscriptions the surface never wanted.
		this.referenceSyncBlockStoreManager.setRealTimeSubscriptionsEnabled(
			options?.enableRealTimeSubscriptions ?? true,
		);
	}

	isSyncBlock(node: PMNode): boolean {
		return (
			this.sourceSyncBlockStoreManager.isSourceBlock(node) ||
			this.referenceSyncBlockStoreManager.isReferenceBlock(node)
		);
	}

	private getDocumentReferenceIds(
		resourceId: ResourceId,
		doc?: PMNode,
	): Set<BlockInstanceId> | undefined {
		if (!doc) {
			return undefined;
		}
		const localIds = new Set<BlockInstanceId>();
		doc.descendants((node) => {
			if (
				this.referenceManager.isReferenceBlock(node) &&
				node.attrs.resourceId === resourceId &&
				node.attrs.localId
			) {
				localIds.add(node.attrs.localId);
			}
		});
		return localIds;
	}

	public async fetchReferencesSourceInfo(
		resourceId: ResourceId,
		blockInstanceId: BlockInstanceId,
		isSourceSyncBlock: boolean,
		doc?: PMNode,
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

			const patchEnabled = isExperimentEnabled('platform_editor_blocks_patch_12');
			const referenceResourceId =
				patchEnabled && isSourceSyncBlock
					? this.referenceSyncBlockStoreManager.generateResourceIdForReference(resourceId)
					: resourceId;
			const documentIds = patchEnabled
				? this.getDocumentReferenceIds(referenceResourceId, doc)
				: undefined;
			const localIds = patchEnabled
				? documentIds
					? [...documentIds]
					: this.referenceSyncBlockStoreManager.getSubscribedLocalIds(referenceResourceId)
				: [];
			// Saved references on this document can already have been removed in the editor.
			const references = (response.references ?? []).filter(
				(reference) =>
					documentIds === undefined ||
					!reference.onSameDocument ||
					Boolean(reference.blockInstanceId && documentIds.has(reference.blockInstanceId)),
			);

			if (references.length === 0 && localIds.length === 0) {
				if (documentIds !== undefined) {
					this.fetchReferencesExperience?.success();
					return { references: [] };
				}
				return this.getUnregisteredReferences(resourceId, blockInstanceId, isSourceSyncBlock);
			}

			this.fetchReferencesExperience?.success();

			const sourceInfoPromises = references.map(async (reference) => {
				if (!reference.hasAccess && isExperimentEnabled('platform_editor_blocks_patch_11')) {
					return this.fetchRestrictedReferenceInfo(reference.documentAri);
				}

				this.fetchSourceInfoExperience?.start();
				const sourceInfo = await this.dataProvider?.fetchSyncBlockSourceInfo(
					reference.blockInstanceId || '',
					reference.documentAri,
					getProductFromSourceAri(reference.documentAri),
					reference.hasAccess,
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
					...(reference.locationScope !== undefined && { locationScope: reference.locationScope }),
					hasAccess: reference.hasAccess,
					productType: sourceInfo.productType,
				};
			});

			const sourceInfos: Array<SyncBlockSourceInfo | undefined> =
				await Promise.all(sourceInfoPromises);

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

			// Only instances in this editor belong to its unsaved document. A matching
			// local ID on another document must not hide an unsaved copy here.
			const registeredLocalIds = new Set<BlockInstanceId>();
			for (const reference of references) {
				if (reference.onSameDocument && reference.blockInstanceId) {
					registeredLocalIds.add(reference.blockInstanceId);
				}
			}
			const localSourceInfos = await Promise.all(
				localIds
					.filter((localId) => !registeredLocalIds.has(localId))
					.map(async (localId): Promise<SyncBlockSourceInfo | undefined> => {
						const sourceInfo =
							await this.referenceSyncBlockStoreManager.fetchSyncBlockSourceInfoByLocalId(localId);
						return sourceInfo
							? { ...sourceInfo, onSameDocument: true, hasAccess: true, isSource: false }
							: undefined;
					}),
			);
			sourceInfos.push(...localSourceInfos);

			return { references: sourceInfos };
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/syncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(
				fetchReferencesErrorPayload(
					(error as Error).message,
					resourceId,
					getSourceProductFromResourceIdSafe(resourceId),
				),
			);

			return { error: SyncBlockError.Errored };
		}
	}

	public setFireAnalyticsEvent(
		fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
	): void {
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

	/**
	 * Keeps only the link of a location the user cannot read, so its title never reaches the UI.
	 * The location still counts when the link cannot be resolved or there is no document to link to.
	 */
	private async fetchRestrictedReferenceInfo(
		documentAri: string | undefined,
	): Promise<SyncBlockSourceInfo> {
		if (!documentAri) {
			return { sourceAri: '', hasAccess: false, onSameDocument: false };
		}

		const productType = getProductFromSourceAri(documentAri);
		let url: string | undefined;

		this.fetchSourceInfoExperience?.start();
		try {
			const sourceInfo = await this.dataProvider?.fetchSyncBlockSourceInfo(
				undefined,
				documentAri,
				productType,
				false,
			);
			url = sourceInfo?.url;
			this.fetchSourceInfoExperience?.success();
		} catch (error) {
			this.fetchSourceInfoExperience?.failure({ reason: (error as Error).message });
		}

		return { sourceAri: documentAri, productType, url, hasAccess: false, onSameDocument: false };
	}

	private async getUnregisteredReferences(
		resourceId: ResourceId,
		blockInstanceId: BlockInstanceId,
		isSourceSyncBlock: boolean,
	): Promise<ReferencesSourceInfo> {
		// No reference found
		if (isSourceSyncBlock) {
			// Verify that a reference sync block for this specific source actually
			// exists on the current page by checking if the reference manager has
			// an active subscription for the derived reference resourceId.
			const referenceResourceId =
				this.referenceSyncBlockStoreManager.generateResourceIdForReference(resourceId);
			const hasUnregisteredReferenceOnPage = this.referenceSyncBlockStoreManager
				.getSubscribedResourceIds()
				.includes(referenceResourceId);

			if (hasUnregisteredReferenceOnPage) {
				// This is current page data. It is the same for data for source and reference
				const sourceSyncBlockData =
					await this.sourceSyncBlockStoreManager.getSyncBlockSourceInfo(blockInstanceId);
				const references: SyncBlockSourceInfo[] = [];

				if (sourceSyncBlockData) {
					const sourceSyncBlockReference = {
						...sourceSyncBlockData,
						onSameDocument: true,
						hasAccess: true,
						isSource: true,
					};
					const referenceSyncBlockReference = {
						...sourceSyncBlockData,
						onSameDocument: true,
						hasAccess: true,
						isSource: false,
					};
					references.push(sourceSyncBlockReference, referenceSyncBlockReference);
				}

				this.fetchReferencesExperience?.success();
				return { references };
			}

			// No remote or local reference exists — show info text with link to doco on how to use Synced Blocks
			this.fetchReferencesExperience?.success();
			return { references: [] };
		}

		// Though no references registered yet for this reference sync block,
		// still show the source and the current page itself since they are known
		// but not saved yet.
		const references: SyncBlockSourceInfo[] = [];

		const sourceSyncBlockData =
			await this.referenceSyncBlockStoreManager.fetchSyncBlockSourceInfo(resourceId);
		if (sourceSyncBlockData) {
			references.push({
				...sourceSyncBlockData,
				onSameDocument: Boolean(sourceSyncBlockData?.onSameDocument),
				hasAccess: true,
				isSource: true,
			});
		}

		const currentPageData =
			await this.referenceSyncBlockStoreManager.fetchSyncBlockSourceInfoByLocalId(blockInstanceId);
		if (currentPageData) {
			references.push({
				...currentPageData,
				onSameDocument: true,
				hasAccess: true,
				isSource: false,
			});
		}

		if (references.length === 0) {
			this.fetchReferencesExperience?.failure({
				reason: 'No references found for reference synced block',
			});
			return { error: SyncBlockError.Errored };
		}

		this.fetchReferencesExperience?.success();
		return { references };
	}
}

const createSyncBlockStoreManager = (
	dataProvider?: SyncBlockDataProviderInterface,
	options?: SyncBlockStoreManagerOptions,
) => {
	return new SyncBlockStoreManager(dataProvider, undefined, undefined, options);
};

export const useMemoizedSyncBlockStoreManager = (
	dataProvider?: SyncBlockDataProviderInterface,
	fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
	options?: SyncBlockStoreManagerOptions,
): SyncBlockStoreManager => {
	// Destructured so the memo depends on the value, not on the identity of an
	// options object that callers commonly build inline.
	const enableRealTimeSubscriptions = options?.enableRealTimeSubscriptions;

	const syncBlockStoreManager = useMemo(() => {
		return createSyncBlockStoreManager(dataProvider, { enableRealTimeSubscriptions });
	}, [dataProvider, enableRealTimeSubscriptions]);

	const prevFireAnalyticsEventRef = useRef<((payload: SyncBlockEventPayload) => void) | undefined>(
		undefined,
	);

	if (fireAnalyticsEvent !== prevFireAnalyticsEventRef.current) {
		prevFireAnalyticsEventRef.current = fireAnalyticsEvent;
		syncBlockStoreManager.setFireAnalyticsEvent(fireAnalyticsEvent);
	}

	// Destroy the SyncBlockStoreManager when:
	//   (a) the component unmounts — manager is fully cleaned up, or
	//   (b) dataProvider changes — the old manager (now orphaned by the
	//       useMemo recalculation) is destroyed before the new one takes over.
	//
	// Without this, orphaned managers leak timers, GQL subscriptions, and
	// in-flight fetches indefinitely. The effect dep is `syncBlockStoreManager`
	// (the useMemo result) — it changes identity precisely when dataProvider
	// changes, triggering the cleanup for the old instance.
	useEffect(() => {
		return () => {
			syncBlockStoreManager.destroy();
		};
	}, [syncBlockStoreManager]);

	return syncBlockStoreManager;
};
