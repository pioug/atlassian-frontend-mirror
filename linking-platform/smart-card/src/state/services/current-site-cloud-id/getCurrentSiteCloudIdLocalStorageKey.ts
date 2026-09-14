import { cloudIdStorageItemKey } from './cloudIdStorageItemKey';
import { currentSiteCloudIdConstants } from './constants';

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
export const getCurrentSiteCloudIdLocalStorageKey = (baseUriWithNoTrailingSlash = ''): string =>
	`${currentSiteCloudIdConstants.SMART_CARD_STORAGE_SCOPE}_${cloudIdStorageItemKey(baseUriWithNoTrailingSlash)}`;
