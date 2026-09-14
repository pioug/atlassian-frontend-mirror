export const currentSiteCloudIdConstants: {
	CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY_PREFIX: string;
	CURRENT_SITE_CLOUD_ID_TTL_MS: number;
	SMART_CARD_STORAGE_SCOPE: string;
} = {
	SMART_CARD_STORAGE_SCOPE: 'smart-card-social-proof',
	CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY_PREFIX: 'site-cloud-id:v1:',
	CURRENT_SITE_CLOUD_ID_TTL_MS: 24 * 60 * 60 * 1000,
};
