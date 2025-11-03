import type { DocNode } from '@atlaskit/adf-schema';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import { type SyncBlockNode, type SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';
import type { NodeDataProvider } from '@atlaskit/node-data-provider';

import {
	SyncedBlockNodeComponentRenderer,
	type SyncedBlockNodeProps,
} from './ui/SyncedBlockNodeComponentRenderer';

export const getSyncedBlockNodeComponent = (
	dataProvider: NodeDataProvider<SyncBlockNode, SyncBlockInstance>,
	doc: DocNode,
) => {
	const { content } = doc;
	const isEmpty = !content || !Array.isArray(content) || content.length === 0;
	const syncBlockNodes = isEmpty
		? []
		: content.filter((node: JSONNode) => node.type === 'syncBlock');

	const dataPromise = dataProvider.fetchNodesData(syncBlockNodes as SyncBlockNode[]);

	return (props: SyncedBlockNodeProps) =>
		SyncedBlockNodeComponentRenderer({ ...props, dataPromise });
};
