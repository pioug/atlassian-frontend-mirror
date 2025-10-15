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

export const getContentPropertyAri = (contentPropertyId: string, cloudId: string) =>
	`ari:cloud:confluence:${cloudId}:content/${contentPropertyId}`;

/**
 * DEPRECATED - Will be removed in the future
 * @private
 * @deprecated
 * @param ari
 * @returns
 */
export const getContentPropertyIdFromAri = (ari: string) => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:content\/([^/]+)/);
	if (match) {
		return match[1];
	}
	throw new Error(`Invalid content property ARI: ${ari}`);
};

export const resourceIdFromSourceAndLocalId = (sourceId: string, localId: string): string => {
	return sourceId + '/' + localId;
};
