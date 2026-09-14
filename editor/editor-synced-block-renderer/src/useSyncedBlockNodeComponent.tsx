import React, { useCallback, useEffect } from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { SyncBlockActionsProvider } from '@atlaskit/editor-common/sync-block';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import {
	convertSyncBlockJSONNodeToSyncBlockNode,
	useMemoizedSyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';
import type {
	SyncBlockNode,
	SyncedBlockProvider,
	SyncBlockPrefetchData,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from './types';
import { SyncedBlockNodeComponentRenderer } from './ui/SyncedBlockNodeComponentRenderer';
import type { SyncedBlockNodeProps } from './ui/SyncedBlockNodeComponentRenderer';

export type GetSyncedBlockNodeComponentProps = {
	/**
	 * Whether reference blocks should hold a real-time subscription and refresh in
	 * place when their source is edited elsewhere. Defaults to `true`.
	 *
	 * Surfaces that must show content as of page load — the Confluence classic
	 * page/blog renderer — pass `false`, so no `blockService_onBlockUpdated`
	 * subscription is ever opened.
	 */
	enableRealTimeSubscriptions?: boolean;
	fireAnalyticsEvent?: (payload: AnalyticsEventPayload) => void;
	getAccountId?: () => string | null;
	getPrefetchedData?: () => SyncBlockPrefetchData | undefined;
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
	getAccountId,
	getPrefetchedData,
	enableRealTimeSubscriptions,
}: GetSyncedBlockNodeComponentProps): ((props: SyncedBlockNodeProps) => React.JSX.Element) => {
	const syncBlockStoreManager = useMemoizedSyncBlockStoreManager(
		syncBlockProvider,
		fireAnalyticsEvent,
		{ enableRealTimeSubscriptions },
	);

	// Process prefetched data early, if available
	useEffect(() => {
		if (getPrefetchedData) {
			try {
				const prefetchedData = getPrefetchedData();
				syncBlockStoreManager.referenceManager.processPrefetchedData(prefetchedData);
			} catch {
				// Silently ignore errors from getPrefetchedData so the fetch effect can still run
			}
		}
	}, [getPrefetchedData, syncBlockStoreManager.referenceManager]);

	// Initial fetch sync block data (will use SSR data as initial cache, or the prefetched data if available)
	useEffect(() => {
		// On Jira the data provider resolves asynchronously (and is nulled on
		// `destroy()`), so an eager fetch can throw `Data provider not set`
		// (EDITOR-7860). Skip until ready; the effect re-runs (referenceManager
		// identity changes) once the provider resolves, fetching exactly once.
		if (!(syncBlockStoreManager.referenceManager.hasDataProvider?.() ?? false)) {
			return;
		}
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
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					fetchSyncBlockSourceInfo={(sourceAri: string) =>
						syncBlockStoreManager.referenceManager.fetchSyncBlockSourceInfoBySourceAri(sourceAri)
					}
				>
					<SyncedBlockNodeComponentRenderer
						key={props.localId}
						nodeProps={props}
						syncBlockStoreManager={syncBlockStoreManager}
						rendererOptions={syncBlockRendererOptions}
						getAccountId={getAccountId}
					/>
				</SyncBlockActionsProvider>
			</ErrorBoundary>
		),
		[syncBlockStoreManager, syncBlockRendererOptions, fireAnalyticsEvent, getAccountId],
	);
};
