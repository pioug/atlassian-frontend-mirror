import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import {
	convertSyncBlockJSONNodeToSyncBlockNode,
	createAndInitializeSyncBlockStoreManager,
	type SyncBlockNode,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from './types';
import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

export type GetSyncedBlockNodeComponentProps = {
	fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void;
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

export const getSyncedBlockNodeComponent = ({
	syncBlockNodes,
	syncBlockProvider,
	syncBlockRendererOptions,
	fireAnalyticsEvent,
}: GetSyncedBlockNodeComponentProps) => {
	const syncBlockStoreManager = createAndInitializeSyncBlockStoreManager({
		dataProvider: syncBlockProvider,
		fireAnalyticsEvent,
	});

	// Initial fetch sync block data
	syncBlockStoreManager.referenceManager.fetchSyncBlocksData(syncBlockNodes);

	return (props: SyncedBlockNodeProps) => (
		<SyncedBlockNodeComponentRenderer
			key={props.localId}
			nodeProps={props}
			syncBlockStoreManager={syncBlockStoreManager}
			rendererOptions={syncBlockRendererOptions}
		/>
	);
};
