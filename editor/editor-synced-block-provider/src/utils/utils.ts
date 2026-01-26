/* eslint-disable require-unicode-regexp  */

import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncBlockData, BlockInstanceId, ResourceId, SyncBlockNode, SyncBlockProduct } from '../common/types';

export const convertSyncBlockPMNodeToSyncBlockData = (node: PMNode): SyncBlockData => {
	return {
		blockInstanceId: node.attrs.localId,
		content: node.content.toJSON(),
		resourceId: node.attrs.resourceId,
	};
};

export const createSyncBlockNode = (
	localId: BlockInstanceId,
	resourceId: ResourceId,
): SyncBlockNode => {
	return {
		type: 'syncBlock',
		attrs: {
			localId,
			resourceId,
		},
	};
};

export const convertSyncBlockJSONNodeToSyncBlockNode = (
	node: JSONNode,
): SyncBlockNode | undefined => {
	if (
		node.type !== 'syncBlock' ||
		!node.attrs ||
		!('localId' in node.attrs) ||
		!('resourceId' in node.attrs) ||
		typeof node.attrs.localId !== 'string' ||
		typeof node.attrs.resourceId !== 'string'
	) {
		return undefined;
	}

	return createSyncBlockNode(node.attrs.localId, node.attrs.resourceId);
};

export const convertPMNodeToSyncBlockNode = (node: PMNode): SyncBlockNode | undefined => {
	if (
		node.type.name !== 'syncBlock' ||
		!node.attrs?.localId ||
		!node.attrs?.resourceId ||
		typeof node.attrs.localId !== 'string' ||
		typeof node.attrs.resourceId !== 'string'
	) {
		return undefined;
	}

	return createSyncBlockNode(node.attrs.localId, node.attrs.resourceId);
};

export const convertPMNodesToSyncBlockNodes = (nodes: PMNode[]): SyncBlockNode[] => {
	return (
		nodes
			.map((node) => convertPMNodeToSyncBlockNode(node))
			.filter((node: SyncBlockNode | undefined): node is SyncBlockNode => node !== undefined) || []
	);
};

/*
* From a reference block resource id (the resourceId stored in the node attributes)
* e.g. confluence-page/5769323474/cdf6a1bc-b241-487a-93e9-e30bde363cbc
* Extracts the source page content id and source product
*/
export const getContentIdAndProductFromResourceId = (resourceId: string) => {
	const match = resourceId.match(/^(confluence-page|jira-work-item)\/([^/]+)/);
	if (match?.[2]) {
		return {
			sourceProduct: match[1] as SyncBlockProduct,
			sourceContentId: match[2],
		};
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
}

export const convertContentUpdatedAt = (contentUpdatedAt: number | undefined): string | undefined => {
	if (typeof contentUpdatedAt === 'number' && fg('platform_synced_block_dogfooding')) {
		try {
			return new Date(contentUpdatedAt).toISOString();
		} catch {
			return undefined;
		}
	}
	return undefined;
};