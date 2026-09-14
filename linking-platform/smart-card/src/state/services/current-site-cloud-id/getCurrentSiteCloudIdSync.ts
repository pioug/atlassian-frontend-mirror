import { currentSiteCloudIdService } from './index';

export function getCurrentSiteCloudIdSync(baseUriWithNoTrailingSlash = ''): string | undefined {
	return currentSiteCloudIdService.getStoredCloudId(baseUriWithNoTrailingSlash);
}
