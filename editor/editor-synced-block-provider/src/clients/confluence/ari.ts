/* eslint-disable require-unicode-regexp  */

/**
 * The type of the Confluence page
 */
export type PAGE_TYPE = 'page' | 'blogpost';

/**
 * Generates the Confluence page ARI
 * @param pageId - the ID of the page
 * @param cloudId - the cloud ID
 * @param pageType - the type of the page
 * @returns the Confluence page ARI
 */
export const getConfluencePageAri = (
	pageId: string,
	cloudId: string,
	pageType: PAGE_TYPE = 'page',
) => `ari:cloud:confluence:${cloudId}:${pageType}/${pageId}`;

/**
 * Extracts the page ID and type from the Confluence page ARI
 * @param ari - the Confluence page ARI
 * @returns the page ID and type
 */
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

/**
 * Extracts the local ID from the Confluence page content property resource ID
 * @param resourceId - the Confluence page content property resource ID
 * @returns the local ID
 */
export const getLocalIdFromContentPropertyResourceId = (resourceId: string) => {
	const match = resourceId.match(
		/ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+\/([a-zA-Z0-9-]+)/,
	);
	if (match?.[2]) {
		return match[2];
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

/**
 * Extracts the Confluence page ARI from the Confluence content property resource ID
 * @param resourceId - the Confluence content property resource ID
 * @returns the Confluence page ARI
 */
export const getPageAriFromContentPropertyResourceId = (resourceId: string) => {
	const match = resourceId.match(
		/(ari:cloud:confluence:[^:]+:(page|blogpost)\/\d+)\/([a-zA-Z0-9-]+)$/,
	);
	if (match?.[1]) {
		return match[1];
	}
	throw new Error(`Invalid resourceId: ${resourceId}`);
};

/**
 * Generates the Confluence page content property resource ID from the source ID and local ID
 * @param sourceId - the source ID
 * @param localId - the local ID
 * @returns the Confluence page content property resource ID
 */
export const resourceIdFromConfluencePageSourceIdAndLocalId = (sourceId: string, localId: string) =>
	`${sourceId}/${localId}`;
