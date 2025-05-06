import {
	type IconItemFailure,
	type IconItemSuccess,
	type LinkIconData,
	ProviderNames,
	type RawLinkData,
} from './types';

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

const isIconItemSuccess = (
	response: IconItemSuccess | IconItemFailure,
): response is IconItemSuccess => {
	return response.status === 200;
};

/**
 * Converts batched list of json-ld responses into list of formatted LinkIconData { url, icon_url }
 *
 * @param batchResp - list of json-ld responses { body, status }
 */
export const transformIconData = (
	batchResp: (IconItemSuccess | IconItemFailure)[],
): LinkIconData[] =>
	batchResp
		.filter(isIconItemSuccess)
		.map((resp: IconItemSuccess) => resp.body.data)
		.map(formatLinkIconData)
		.filter((linkIconData) => linkIconData.iconUrl !== undefined);

const getConfluenceFavicon = (url: string): string =>
	`https://${new URL(url).hostname}/wiki/favicon.ico`;

const getJiraFavicon = (url: string): string => `https://${new URL(url).hostname}/favicon.ico`;
