/* eslint-disable require-unicode-regexp  */

import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type {
	SyncBlockData,
	BlockInstanceId,
	ResourceId,
	SyncBlockNode,
	SyncBlockProduct,
} from '../common/types';

const normalizeSyncBlockJSONContentInternal = <T extends JSONNode | undefined>(
	content: T[],
	options: { convertPanelC1ToPanel: boolean },
): T[] => {
	let normalizedContent: T[] | undefined;

	content.forEach((contentNode, index) => {
		if (!contentNode) {
			normalizedContent?.push(contentNode);
			return;
		}

		const hasAnnotationMark = contentNode.marks?.some((mark) => mark.type === 'annotation');
		const shouldConvertPanelC1 = options.convertPanelC1ToPanel && contentNode.type === 'panel_c1';
		const childContent = contentNode.content
			? normalizeSyncBlockJSONContentInternal(contentNode.content, options)
			: undefined;
		const hasContentChanged = childContent !== undefined && childContent !== contentNode.content;

		if (!hasAnnotationMark && !shouldConvertPanelC1 && !hasContentChanged) {
			normalizedContent?.push(contentNode);
			return;
		}

		if (!normalizedContent) {
			normalizedContent = content.slice(0, index);
		}

		const normalizedNode = { ...contentNode };

		if (shouldConvertPanelC1) {
			normalizedNode.type = 'panel';
		}

		if (hasAnnotationMark) {
			const marks = contentNode.marks?.filter((mark) => mark.type !== 'annotation');
			if (marks && marks.length > 0) {
				normalizedNode.marks = marks;
			} else {
				delete normalizedNode.marks;
			}
		}

		if (hasContentChanged && childContent) {
			normalizedNode.content = childContent;
		}

		normalizedContent.push(normalizedNode as T);
	});

	return normalizedContent ?? content;
};

export const stripAnnotationMarksFromJSONContent = <T extends JSONNode | undefined>(
	content: T[],
): T[] => {
	return normalizeSyncBlockJSONContentInternal(content, { convertPanelC1ToPanel: false });
};

export const normalizeSyncBlockJSONContent = <T extends JSONNode | undefined>(content: T[]): T[] => {
	return normalizeSyncBlockJSONContentInternal(content, { convertPanelC1ToPanel: true });
};

export const convertSyncBlockPMNodeToSyncBlockData = (node: PMNode): SyncBlockData => {
	const content = node.content.toJSON();

	return {
		blockInstanceId: node.attrs.localId,
		content: content ? normalizeSyncBlockJSONContent(content) : content,
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
	return nodes
		.map((node) => convertPMNodeToSyncBlockNode(node))
		.filter((node: SyncBlockNode | undefined): node is SyncBlockNode => node !== undefined);
};

/*
 * From a reference block resource id (the resourceId stored in the node attributes)
 * e.g. confluence-page/5769323474/cdf6a1bc-b241-487a-93e9-e30bde363cbc
 * Extracts the source page content id and source product
 */
export const getContentIdAndProductFromResourceId = (
	resourceId: string,
): {
	sourceContentId: string;
	sourceProduct: SyncBlockProduct;
} => {
	const match = resourceId.match(/^(confluence-page|jira-work-item)\/([^/]+)/);
	if (match?.[2]) {
		return {
			sourceProduct: match[1] as SyncBlockProduct,
			sourceContentId: match[2],
		};
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

/*
 * Safe variant of `getContentIdAndProductFromResourceId` for analytics call-sites.
 * Returns `undefined` instead of throwing when the resourceId is missing or malformed,
 * so a bad value can never break the analytics pipeline.
 */
export const getSourceProductFromResourceIdSafe = (
	resourceId?: string,
): SyncBlockProduct | undefined => {
	if (!resourceId) {
		return undefined;
	}
	try {
		return getContentIdAndProductFromResourceId(resourceId).sourceProduct;
	} catch {
		return undefined;
	}
};

export const convertContentUpdatedAt = (
	contentUpdatedAt: number | undefined,
): string | undefined => {
	if (typeof contentUpdatedAt === 'number') {
		try {
			return new Date(contentUpdatedAt).toISOString();
		} catch {
			return undefined;
		}
	}
	return undefined;
};
