import { currentSiteCloudIdService } from './index';

export const getCurrentSiteCloudId = (
	baseUriWithNoTrailingSlash = '',
): Promise<string | undefined> => currentSiteCloudIdService.get(baseUriWithNoTrailingSlash);
