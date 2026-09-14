import { currentSiteCloudIdConstants } from './constants';
import { normalizeBaseUri } from './normalizeBaseUri';

export function cloudIdStorageItemKey(baseUriWithNoTrailingSlash = ''): string {
	return `${currentSiteCloudIdConstants.CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(
		normalizeBaseUri(baseUriWithNoTrailingSlash),
	)}`;
}
