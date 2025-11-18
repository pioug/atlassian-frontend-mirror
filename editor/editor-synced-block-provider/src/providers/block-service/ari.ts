/* eslint-disable require-unicode-regexp */
/**
 * Generates a unique block ARI from a source ARI and a local ID.
 * @param sourceId - the ARI of the document. E.G ari:cloud:confluence:cloudId:page/pageId
 * @param localId - the localId of the block node. A randomly generated UUID
 * @returns the block ARI. E.G ari:cloud:blocks:cloudId:synced-block/localId
 */
export const blockResourceIdFromSourceAndLocalId = (sourceId: string, localId: string): string => {
	const match = sourceId.match(/ari:cloud:confluence:([^:]+):(page|blogpost)\/.*/);
	if (!match?.[1]) {
		throw new Error(`Invalid source ARI: ${sourceId}`);
	}
	const cloudId = match[1];
	return `ari:cloud:blocks:${cloudId}:synced-block/${localId}`;
};

/**
 * Extracts the local ID from a block ARI.
 * @param ari - the block ARI. E.G ari:cloud:blocks:cloudId:synced-block/localId
 * @returns the localId of the block node. A randomly generated UUID
 */
export const getLocalIdFromResourceId = (ari: string) => {
	const match = ari.match(/ari:cloud:blocks:[^:]+:synced-block\/([a-zA-Z0-9-]+)/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};
