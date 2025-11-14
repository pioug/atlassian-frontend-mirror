import type React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import {
	convertSyncBlockJSONNodeToSyncBlockNode,
	SyncBlockStoreManager,
	type SyncBlockDataProvider,
	type SyncBlockNode,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from './types';
import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

type GetSyncedBlockNodeComponentProps = {
	doc: DocNode;
	syncBlockProvider: SyncedBlockProvider;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
};

const getSyncBlockNodesFromContent = (content: JSONNode[]): SyncBlockNode[] => {
	return content
		.map((node: JSONNode) => convertSyncBlockJSONNodeToSyncBlockNode(node))
		.filter((node: SyncBlockNode | undefined): node is SyncBlockNode => node !== undefined);
};

// For rendering reference synced block nodes in Renderer
export const getSyncedBlockNodeComponent = ({
	doc,
	syncBlockProvider,
	syncBlockRendererOptions,
}: GetSyncedBlockNodeComponentProps): ((props: SyncedBlockNodeProps) => React.JSX.Element) => {
	const { content } = doc;
	const isEmpty = !content || !Array.isArray(content) || content.length === 0;
	const syncBlockNodes: SyncBlockNode[] = isEmpty ? [] : getSyncBlockNodesFromContent(content);

	const syncBlockStoreManager = new SyncBlockStoreManager(
		syncBlockProvider as SyncBlockDataProvider,
	);

	// Pre-fetch sync block data
	syncBlockStoreManager.getReferenceSyncBlockStoreManager().fetchSyncBlocksData(syncBlockNodes);

	return (props: SyncedBlockNodeProps) =>
		SyncedBlockNodeComponentRenderer({
			nodeProps: props,
			syncBlockStoreManager,
			rendererOptions: syncBlockRendererOptions,
		});
};
