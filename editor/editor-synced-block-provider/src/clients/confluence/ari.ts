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
export const getConfluencePageAri = ({
	pageId,
	cloudId,
	pageType,
}: {
	cloudId: string;
	pageId: string;
	pageType: PAGE_TYPE;
}): string => {
	return `ari:cloud:confluence:${cloudId}:${pageType}/${pageId}` as const;
};

/**
 * Extracts the page ID and type from the Confluence page ARI
 * @param ari - the Confluence page ARI
 * @returns the page ID and type
 */
export const getPageIdAndTypeFromConfluencePageAri = ({
	ari,
}: {
	ari: string;
}): { id: string; type: PAGE_TYPE } => {
	const match = ari.match(/ari:cloud:confluence:[^:]+:(page|blogpost)\/(\d+)/);
	if (match?.[2]) {
		return {
			type: match[1] as PAGE_TYPE,
			id: match[2],
		};
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};
