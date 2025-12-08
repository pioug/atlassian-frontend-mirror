/* eslint-disable require-unicode-regexp */
import { type SyncBlockProduct } from "../../common/types";

/**
 * Generates the block ARI from the source page ARI and the source block's resource ID.
 * @param sourceAri - the ARI of the document. E.G ari:cloud:confluence:cloudId:page/pageId
 * @param resourceId - the resource ID of the block node. A randomly generated UUID
 * @returns the block ARI. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
 */
export const generateBlockAri = (sourceAri: string, resourceId: string, product: SyncBlockProduct): string => {
	const match = sourceAri.match(/ari:cloud:confluence:([^:]+):(page|blogpost)\/(\d+)/);
	if (!match?.[1]) {
		throw new Error(`Invalid source ARI: ${sourceAri}`);
	}
	const cloudId = match[1];
	const pageId = match[3];
	return `ari:cloud:blocks:${cloudId}:synced-block/${product}/${pageId}/${resourceId}`;
};

/**
 * 
 * @param sourceAri - the ARI of the document. E.G ari:cloud:confluence:cloudId:page/pageId
 * @param resourceId - the resource ID of the reference synced block. E.G confluence-page/pageId/sourceResourceId
 * @returns the block ARI. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
 */
export const generateBlockAriFromReference = (sourceAri: string, resourceId: string): string => {
	const match = sourceAri.match(/ari:cloud:confluence:([^:]+):(page|blogpost)\/(\d+)/);
	if (!match?.[1]) {
		throw new Error(`Invalid source ARI: ${sourceAri}`);
	}
	const cloudId = match[1];
	return `ari:cloud:blocks:${cloudId}:synced-block/${resourceId}`;
}

/**
 * Extracts the local ID from a block ARI.
 * @param ari - the block ARI. E.G ari:cloud:blocks:cloudId:synced-block/localId
 * @returns the localId of the block node. A randomly generated UUID
 */
export const getLocalIdFromBlockResourceId = (ari: string) => {
	const match = ari.match(/ari:cloud:blocks:[^:]+:synced-block\/([a-zA-Z0-9-]+)/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};
