import uuid from 'uuid';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockNode } from '../common/types';

export const createSyncBlockNode = (
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

export const createSyncBlockPMNode = (nodeType: NodeType): PMNode => {
	// TODO: EDITOR-1644 - properly implement creation of the synced block
	// below is a temporary implementation for the creation of the synced block
	// the resource id needs to have pageId and content property key in it
	const id = uuid();
	const node = nodeType.createChecked(
		{
			resourceId: id,
			localId: id,
		},
		null,
	) as PMNode;
	return node;
};

export const generateSyncBlockSourceUrl = (node: PMNode): string => {
	const { localId, resourceId } = node.attrs;
	// TODO: EDITOR-1644 - To be implemented under EDITOR-1644
	// below is a temporary implementation for the url generation
	const url = new URL(location.origin + location.pathname);
	url.searchParams.set('localId', localId);
	url.searchParams.set('resourceId', resourceId);
	return url.toString();
};
