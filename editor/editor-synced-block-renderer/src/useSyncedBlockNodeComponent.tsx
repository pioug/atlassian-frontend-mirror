import React, { useCallback, useEffect } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { ACTION_SUBJECT, type AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { SyncBlockActionsProvider } from '@atlaskit/editor-common/sync-block';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import {
	convertSyncBlockJSONNodeToSyncBlockNode,
	useMemoizedSyncBlockStoreManager,
	type SyncBlockDataProvider,
	type SyncBlockInstance,
	type SyncBlockNode,
	type SyncedBlockProvider,
	type SyncBlockPrefetchData,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from './types';
import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

export type GetSyncedBlockNodeComponentProps = {
	fireAnalyticsEvent?: (payload: AnalyticsEventPayload) => void;
	getPrefetchedData?: () => SyncBlockPrefetchData | undefined;
	getSSRData?: () => Record<string, SyncBlockInstance> | undefined;
	syncBlockNodes: SyncBlockNode[];
	syncBlockProvider: SyncedBlockProvider;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
};

export const getSyncBlockNodesFromDoc = (doc: DocNode): SyncBlockNode[] => {
	const { content } = doc;
	const isEmpty = !content || !Array.isArray(content) || content.length === 0;
	const syncBlockNodes: SyncBlockNode[] = isEmpty
		? []
		: content
				.map((node: JSONNode) => convertSyncBlockJSONNodeToSyncBlockNode(node))
				.filter((node: SyncBlockNode | undefined): node is SyncBlockNode => node !== undefined);
	return syncBlockNodes;
};

export const useMemoizedSyncedBlockNodeComponent = ({
	syncBlockNodes,
	syncBlockProvider,
	syncBlockRendererOptions,
	fireAnalyticsEvent,
	getSSRData,
	getPrefetchedData,
}: GetSyncedBlockNodeComponentProps): ((props: SyncedBlockNodeProps) => React.JSX.Element) => {
	const syncBlockStoreManager = useMemoizedSyncBlockStoreManager(
		syncBlockProvider as SyncBlockDataProvider,
		fireAnalyticsEvent,
	);

	// Initialize SSR data if available
	useEffect(() => {
		if (getSSRData) {
			const ssrData = getSSRData();
			if (ssrData && (syncBlockProvider as SyncBlockDataProvider).setSSRData) {
				(syncBlockProvider as SyncBlockDataProvider).setSSRData(ssrData);
			}
		}
	}, [getSSRData, syncBlockProvider]);

	// Process prefetched data next, if available
	useEffect(() => {
		let prefetchedData: SyncBlockPrefetchData | undefined;
		if (getPrefetchedData) {
			prefetchedData = getPrefetchedData();
			syncBlockStoreManager.referenceManager.processPrefetchedData(prefetchedData);
		}
	}, [getPrefetchedData, syncBlockStoreManager.referenceManager]);

	// Initial fetch sync block data (will use SSR data as initial cache, or the prefetched data if available)
	useEffect(() => {
		syncBlockStoreManager.referenceManager.fetchSyncBlocksData(syncBlockNodes);
	}, [syncBlockNodes, syncBlockStoreManager.referenceManager]);

	return useCallback(
		(props: SyncedBlockNodeProps) => (
			<ErrorBoundary
				component={ACTION_SUBJECT.SYNCED_BLOCK}
				dispatchAnalyticsEvent={fireAnalyticsEvent}
				fallbackComponent={null}
			>
				<SyncBlockActionsProvider
					fetchSyncBlockSourceInfo={(sourceAri: string) =>
						syncBlockStoreManager.referenceManager.fetchSyncBlockSourceInfoBySourceAri(sourceAri)
					}
				>
					<SyncedBlockNodeComponentRenderer
						key={props.localId}
						nodeProps={props}
						syncBlockStoreManager={syncBlockStoreManager}
						rendererOptions={syncBlockRendererOptions}
					/>
				</SyncBlockActionsProvider>
			</ErrorBoundary>
		),
		[syncBlockStoreManager, syncBlockRendererOptions, fireAnalyticsEvent],
	);
};
