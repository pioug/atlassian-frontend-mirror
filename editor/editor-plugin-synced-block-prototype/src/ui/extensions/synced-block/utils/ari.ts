import { getCloudId } from '../constants';

export const getConfluencePageAri = (pageId: string) =>
	`ari:cloud:confluence:${getCloudId()}:page/${pageId}`;

export const getPageIdFromAri = (ari: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = ari.match(/ari:cloud:confluence:[^:]+:page\/(\d+)/);
	if (match) {
		return match[1];
	}
	throw new Error(`Invalid page ARI: ${ari}`);
};

export const getContentPropertyAri = (contentPropertyId: string) =>
	`ari:cloud:confluence:${getCloudId()}:content/${contentPropertyId}`;

export const getContentPropertyIdFromAri = (ari: string) => {
	// eslint-disable-next-line require-unicode-regexp
	const match = ari.match(/ari:cloud:confluence:[^:]+:content\/([^/]+)/);
	if (match) {
		return match[1];
	}
	throw new Error(`Invalid content property ARI: ${ari}`);
};
