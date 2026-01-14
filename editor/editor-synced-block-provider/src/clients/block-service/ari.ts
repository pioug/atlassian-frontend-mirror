/* eslint-disable require-unicode-regexp */
import { type SyncBlockProduct } from '../../common/types';

/**
 * Generates the block ARI from the source page ARI and the source block's resource ID.
 * @param cloudId - the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
 * @param parentId - the parentId of the block. E.G the pageId for a confluence page, or the issueId for a Jira work item
 * @param resourceId - the resource ID of the block node. A randomly generated UUID
 * @param product - the product of the block. E.G 'confluence-page', 'jira-work-item'
 * @returns the block ARI. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
 */
export const generateBlockAri = ({
	cloudId,
	parentId,
	product,
	resourceId,
}: {
	cloudId: string;
	parentId: string;
	product: SyncBlockProduct;
	resourceId: string;
}): string => {
	return `ari:cloud:blocks:${cloudId}:synced-block/${product}/${parentId}/${resourceId}` as const;
};

/**
 * Generates the block ARI from the reference synced block ARI and the resource ID
 * @param cloudId - the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
 * @param resourceId - the resource ID of the reference synced block. E.G confluence-page/pageId/sourceResourceId
 * @returns the block ARI. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
 */
export const generateBlockAriFromReference = ({
	cloudId,
	resourceId,
}: {
	cloudId: string;
	resourceId: string;
}): string => {
	return `ari:cloud:blocks:${cloudId}:synced-block/${resourceId}` as const;
};

/**
 * Extracts the local ID from a block ARI.
 * @param ari - the block ARI. E.G ari:cloud:blocks:cloudId:synced-block/localId
 * @returns the localId of the block node. A randomly generated UUID
 */
export const getLocalIdFromBlockResourceId = (ari: string): string => {
	const match = ari.match(/ari:cloud:blocks:[^:]+:synced-block\/([a-zA-Z0-9-]+)/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};
