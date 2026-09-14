import { formatLinkIconData } from './formatLinkIconData';
import { type IconItemFailure, type IconItemSuccess, type LinkIconData } from './types';

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
