import { type LinkIconData, ProviderNames, type RawLinkData } from './types';

const getConfluenceFavicon = (url: string): string =>
	`https://${new URL(url).hostname}/wiki/favicon.ico`;

const getJiraFavicon = (url: string): string => `https://${new URL(url).hostname}/favicon.ico`;

/**
 * Formats data into LinkIconData with appropriate Jira/Confluence favicon urls.
 * Undefined icons remain undefined.
 * Exported for testing purposes.
 *
 * Confluence favicon extension: /wiki/favicon.ico
 * Jira favicon extension: /favicon.ico
 *
 * @param jsonLd - raw JSON-LD data for an individual link
 */
export const formatLinkIconData = (jsonLd: RawLinkData): LinkIconData => {
	const {
		url,
		generator: { name, icon },
	} = jsonLd;

	switch (name) {
		case ProviderNames.CONFLUENCE:
			return {
				linkUrl: url,
				iconUrl: getConfluenceFavicon(url),
				productName: name,
			};
		case ProviderNames.JIRA:
			return {
				linkUrl: url,
				iconUrl: getJiraFavicon(url),
				productName: name,
			};
		default:
			return {
				linkUrl: url,
				iconUrl: typeof icon === 'object' ? icon['url'] : icon,
				productName: name,
			};
	}
};
