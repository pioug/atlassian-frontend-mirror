import { CurrentSiteCloudIdService } from './CurrentSiteCloudIdService';
import { getCurrentSiteCloudIdLocalStorageKey } from './getCurrentSiteCloudIdLocalStorageKey';

/** Backwards-compatible default-scope key for existing tests and external assertions. */
export const CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY: string =
	getCurrentSiteCloudIdLocalStorageKey();

export const currentSiteCloudIdService: CurrentSiteCloudIdService = new CurrentSiteCloudIdService();
