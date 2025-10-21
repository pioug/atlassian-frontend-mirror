import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockData, SyncBlockNode } from '../common/types';

import type { PAGE_TYPE } from './ari';

export const convertSyncBlockPMNodeToSyncBlockNode = (
	node: PMNode,
	includeContent: boolean = false,
): SyncBlockNode => {
	const transformer = new JSONTransformer();
	const toJSON = (node: PMNode) => transformer.encodeNode(node);
	return {
		type: 'syncBlock',
		attrs: {
			localId: node.attrs.localId,
			resourceId: node.attrs.resourceId,
		},
		content: includeContent ? node.content.content.map(toJSON) : undefined,
	};
};

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
