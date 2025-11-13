/* eslint-disable require-unicode-regexp  */

export type PAGE_TYPE = 'page' | 'blogpost';

export const getConfluencePageAri = (
	pageId: string,
	cloudId: string,
	pageType: PAGE_TYPE = 'page',
) => `ari:cloud:confluence:${cloudId}:${pageType}/${pageId}`;

export const getPageIdAndTypeFromAri = (ari: string): { id: string; type: PAGE_TYPE } => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/(\d+)/);
	if (match?.[2]) {
		return {
			type: match[1] as PAGE_TYPE,
			id: match[2],
		};
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getLocalIdFromAri = (ari: string) => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+\/([a-zA-Z0-9-]+)/);
	if (match?.[2]) {
		return match[2];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getPageARIFromResourceId = (resourceId: string) => {
	const match = resourceId.match(
		/(ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+)\/([a-zA-Z0-9-]+)$/,
	);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

export const resourceIdFromSourceAndLocalId = (sourceId: string, localId: string): string => {
	return sourceId + '/' + localId;
};

/**
 * For the following functions, they are used for the block service API provider.
 * The resourceId/blockResourceId always refers to the block ARI.
 */

/**
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
 * @param ari - the block ARI. E.G ari:cloud:blocks:cloudId:synced-block/localId
 * @returns the localId of the block node. A randomly generated UUID
 */
export const getLocalIdFromResourceId = (ari: string) => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+\/([a-zA-Z0-9-]+)/);
	if (match?.[2]) {
		return match[2];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};
