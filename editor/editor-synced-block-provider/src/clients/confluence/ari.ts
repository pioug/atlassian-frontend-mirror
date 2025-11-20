/* eslint-disable require-unicode-regexp  */

export type PAGE_TYPE = 'page' | 'blogpost';

export const getConfluencePageAri = (
	pageId: string,
	cloudId: string,
	pageType: PAGE_TYPE = 'page',
) => `ari:cloud:confluence:${cloudId}:${pageType}/${pageId}`;

// For extracting from Page ARI and also the content property's version of resourceId
export const getPageIdAndTypeFromConfluencePageAri = (
	ari: string,
): { id: string; type: PAGE_TYPE } => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/(\d+)/);
	if (match?.[2]) {
		return {
			type: match[1] as PAGE_TYPE,
			id: match[2],
		};
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getLocalIdFromConfluencePageAri = (ari: string) => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+\/([a-zA-Z0-9-]+)/);
	if (match?.[2]) {
		return match[2];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getPageARIFromContentPropertyResourceId = (resourceId: string) => {
	const match = resourceId.match(
		/(ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+)\/([a-zA-Z0-9-]+)$/,
	);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

export const resourceIdFromConfluencePageSourceIdAndLocalId = (
	sourceId: string,
	localId: string,
): string => {
	return sourceId + '/' + localId;
};
