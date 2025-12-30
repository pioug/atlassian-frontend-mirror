import React, { useCallback, useEffect } from 'react';

import {
	useMemoizedSyncBlockStoreManager,
	type SyncBlockDataProvider,
} from '@atlaskit/editor-synced-block-provider';

import type { GetSyncedBlockNodeComponentProps } from './getSyncedBlockNodeComponent';
import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

export const useMemoizedSyncedBlockNodeComponent = ({
	syncBlockNodes,
	syncBlockProvider,
	syncBlockRendererOptions,
	fireAnalyticsEvent,
}: GetSyncedBlockNodeComponentProps): ((props: SyncedBlockNodeProps) => React.JSX.Element) => {
	const syncBlockStoreManager = useMemoizedSyncBlockStoreManager(
		syncBlockProvider as SyncBlockDataProvider,
		fireAnalyticsEvent,
	);

	// Initial fetch sync block data
	useEffect(() => {
		syncBlockStoreManager.referenceManager.fetchSyncBlocksData(syncBlockNodes);
	}, [syncBlockNodes, syncBlockStoreManager.referenceManager]);

	return useCallback(
		(props: SyncedBlockNodeProps) => (
			<SyncedBlockNodeComponentRenderer
				key={props.localId}
				nodeProps={props}
				syncBlockStoreManager={syncBlockStoreManager}
				rendererOptions={syncBlockRendererOptions}
			/>
		),
		[syncBlockStoreManager, syncBlockRendererOptions],
	);
};
