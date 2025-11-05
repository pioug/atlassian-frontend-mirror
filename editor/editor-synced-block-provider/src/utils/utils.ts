import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockData, BlockInstanceId, ResourceId, SyncBlockNode } from '../common/types';

import type { PAGE_TYPE } from './ari';

export const convertSyncBlockPMNodeToSyncBlockData = (node: PMNode): SyncBlockData => {
	return {
		blockInstanceId: node.attrs.localId,
		content: node.content.toJSON(),
		resourceId: node.attrs.resourceId,
	};
};

export const isBlogPageType = (pageType: PAGE_TYPE): boolean => {
	return pageType === 'blogpost';
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

export const createBodiedSyncBlockNode = (
	localId: BlockInstanceId,
	resourceId: ResourceId,
): SyncBlockNode => {
	return {
		type: 'bodiedSyncBlock',
		attrs: { localId, resourceId },
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
