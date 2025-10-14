export const getConfluencePageAri = (pageId: string, cloudId: string) =>
	`ari:cloud:confluence:${cloudId}:page/${pageId}`;

export const getPageIdFromAri = (ari: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = ari.match(/ari:cloud:confluence:[^:]+:page\/(\d+)/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

/**
 *
 * @param ari ari:cloud:confluence:<cloudId>:page/<pageId>/<localId>
 * @returns
 */
export const getLocalIdFromAri = (ari: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = ari.match(/ari:cloud:confluence:[^:]+:page\/\d+\/([a-zA-Z0-9-]+)/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getPageARIFromResourceId = (resourceId: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = resourceId.match(/(ari:cloud:confluence:[^:]+:page\/\d+)\/([a-zA-Z0-9-]+)$/);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

export const getContentPropertyAri = (contentPropertyId: string, cloudId: string) =>
	`ari:cloud:confluence:${cloudId}:content/${contentPropertyId}`;

export const getContentPropertyIdFromAri = (ari: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = ari.match(/ari:cloud:confluence:[^:]+:content\/([^/]+)/);
	if (match) {
		return match[1];
	}
	throw new Error(`Invalid content property ARI: ${ari}`);
};

export const resourceIdFromSourceAndLocalId = (sourceId: string, localId: string): string => {
	return sourceId + '/' + localId;
};
