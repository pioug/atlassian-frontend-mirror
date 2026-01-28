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
} from '@atlaskit/editor-synced-block-provider';
import type { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncedBlockRendererOptions } from './types';
import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

export type GetSyncedBlockNodeComponentProps = {
	fireAnalyticsEvent?: (payload: AnalyticsEventPayload) => void;
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
}: GetSyncedBlockNodeComponentProps): ((props: SyncedBlockNodeProps) => React.JSX.Element) => {
	const syncBlockStoreManager = useMemoizedSyncBlockStoreManager(
		syncBlockProvider as SyncBlockDataProvider,
		fireAnalyticsEvent,
	);

	// Initialize SSR data if available
	useEffect(() => {
		if (getSSRData && fg('platform_synced_block_dogfooding')) {
			const ssrData = getSSRData();
			if (ssrData && (syncBlockProvider as SyncBlockDataProvider).setSSRData) {
				(syncBlockProvider as SyncBlockDataProvider).setSSRData(ssrData);
			}
		}
	}, [getSSRData, syncBlockProvider]);

	// Initial fetch sync block data (will use SSR data as initial cache if available)
	useEffect(() => {
		syncBlockStoreManager.referenceManager.fetchSyncBlocksData(syncBlockNodes);
	}, [syncBlockNodes, syncBlockStoreManager.referenceManager]);

	return useCallback(
		(props: SyncedBlockNodeProps) =>
			fg('platform_synced_block_dogfooding') ? (
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
			) : (
				<SyncedBlockNodeComponentRenderer
					key={props.localId}
					nodeProps={props}
					syncBlockStoreManager={syncBlockStoreManager}
					rendererOptions={syncBlockRendererOptions}
				/>
			),
		[syncBlockStoreManager, syncBlockRendererOptions, fireAnalyticsEvent],
	);
};
